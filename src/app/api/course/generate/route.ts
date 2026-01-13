import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { famousgu } from "@/data/gudata";
import { cookies } from "next/headers";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MAX_GUEST = 3;

async function searchMultipleNaver(query: string, display = 10) {
  try {
    const res = await fetch(
      `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
        query
      )}&display=${display}`,
      {
        headers: {
          "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
          "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
        },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch {
    return [];
  }
}

function extractRegionFromMessage(message: string | undefined): string | null {
  if (!message) return null;

  // 1. 구 이름 직접 매칭 (예: "강남구", "마포")
  for (const region of Object.keys(famousgu)) {
    if (message.includes(region)) return region;
  }

  // 2. hotspot 매칭 (예: "홍대", "신촌", "명동")
  for (const [region, hotspots] of Object.entries(famousgu)) {
    const hotspotList = hotspots.split(", ");
    for (const hotspot of hotspotList) {
      if (message.includes(hotspot)) return region;
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const cookieStore = cookies();

    const body = await req.json();
    const message: string = String(body.message ?? "").trim();
    const weather: string = body.weather ?? "";
    const time: string = body.time ?? "";
    const location: string = String(body.location ?? "").trim();

    if (!message)
      return NextResponse.json({ error: "message required" }, { status: 400 });

    // 익명 쿼터 체크
    const rawCount = (await cookieStore).get("guest_created_count")?.value;
    const count = rawCount ? parseInt(rawCount, 10) : 0;
    if (!userId && count >= MAX_GUEST) {
      return NextResponse.json(
        {
          ok: false,
          error: "guest_limit",
          guestRemaining: 0,
          message: "로그인 필요",
        },
        { status: 401 }
      );
    }

    const requestedRegion = extractRegionFromMessage(message);
    const foundFromLocation =
      location && Object.keys(famousgu).find((gu) => location.includes(gu));
    const targetRegion =
      requestedRegion ||
      foundFromLocation ||
      location ||
      Object.keys(famousgu)[0];

    const areaHint =
      famousgu[targetRegion as keyof typeof famousgu] || targetRegion;
    const district = targetRegion?.endsWith("구")
      ? targetRegion
      : `${targetRegion}구`;

    // 먼저 실제 장소들을 검색
    const [cafes, restaurants, attractions, shopping] = await Promise.all([
      searchMultipleNaver(`${district} 카페`, 8),
      searchMultipleNaver(`${district} 맛집`, 8),
      searchMultipleNaver(`${district} 명소`, 8),
      searchMultipleNaver(`${district} 관광`, 5),
    ]);

    const allPlaces = [...cafes, ...restaurants, ...attractions, ...shopping];

    if (allPlaces.length === 0) {
      return NextResponse.json(
        { error: `${district}에서 장소를 찾을 수 없습니다.` },
        { status: 404 }
      );
    }

    // 실제 검색된 장소 정보를 포맷팅
    const placeList = allPlaces
      .map(
        (p: any, idx: number) =>
          `${idx + 1}. ${p.title?.replace(/<[^>]*>/g, "") || "제목 없음"} - ${
            p.category || "카테고리 없음"
          } (주소: ${p.address || p.roadAddress || "주소 없음"})`
      )
      .join("\n");

    const systemPrompt = `
너는 서울 여행 전문 도슨트야. 사용자의 요청에 따라 "${district}" 인근의 실제 장소로만 구성된 하루 여행 코스를 만들어줘.

입력:
- 사용자 요청: "${message}"
- 현재 위치: ${location || "정보 없음"}
- 목적지: ${district}
- 주변 힌트: ${areaHint}
- 시간: ${time || "정보 없음"}
- 날씨: ${weather || "정보 없음"}

**중요: 아래 실제 검색된 장소 목록에서만 선택해서 코스를 구성해야 해:**

${placeList}

원칙:
1) **반드시 위 목록에 있는 실제 장소명만 사용할 것** (목록에 없는 장소를 절대 만들지 마)
2) 사용자 요청, 시간, 날씨를 고려해서 적합한 3~5개 장소 선택
3) 시간 순으로 배치, 총 소요 4~6시간
4) JSON만 반환. 코드블록 금지.
5) "name" 필드에는 위 목록의 장소명을 정확히 복사해서 사용

형식:
{
  "title": "...",
  "vibe": "...",
  "route": "...",
  "totalDuration": "...",
  "spots": [
    { "name":"위 목록의 정확한 장소명", "category":"카페|식당|관광지|쇼핑|문화공간", "arriveTime":"", "stayTime":"", "desc":"", "nextMove":"" }
  ]
}
`;

    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.6,
    });

    const raw = aiRes.choices?.[0]?.message?.content ?? "{}";
    const stripped = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const match = stripped.match(/\{[\s\S]*\}/);
    const jsonText = match ? match[0] : stripped;

    let course;
    try {
      course = JSON.parse(jsonText);
    } catch (err) {
      console.error("JSON parse error:", raw);
      return NextResponse.json(
        { error: "AI 응답 파싱 실패", raw },
        { status: 500 }
      );
    }

    if (!course || !Array.isArray(course.spots) || course.spots.length === 0) {
      return NextResponse.json(
        { error: "코스 스팟이 없습니다." },
        { status: 400 }
      );
    }

    // AI가 선택한 장소를 검색된 실제 장소와 매칭
    const verifiedSpots = course.spots.map((s: any) => {
      const name = String(s.name ?? "")
        .trim()
        .replace(/<[^>]*>/g, "");

      // 검색된 장소 목록에서 매칭 (제목에서 HTML 태그 제거 후 비교)
      const matchedPlace = allPlaces.find((p: any) => {
        const cleanTitle = p.title?.replace(/<[^>]*>/g, "").trim();
        return (
          cleanTitle === name ||
          cleanTitle?.includes(name) ||
          name.includes(cleanTitle)
        );
      });

      return {
        name,
        category: s.category ?? null,
        arriveTime: s.arriveTime ?? null,
        stayTime: s.stayTime ?? null,
        desc: s.desc ?? null,
        nextMove: s.nextMove ?? null,
        address:
          matchedPlace?.address ||
          matchedPlace?.roadAddress ||
          "주소 정보 없음",
        link: matchedPlace?.link ?? null,
      };
    });

    const anyValid = verifiedSpots.some(
      (v: any) => v.address !== "주소 정보 없음" || v.link
    );
    if (!anyValid) {
      return NextResponse.json(
        { error: `${district} 인근에서 유효한 장소를 찾지 못했습니다.` },
        { status: 404 }
      );
    }

    const generatedCourse = {
      title: course.title ?? `${district} 하루 코스`,
      vibe: course.vibe ?? "",
      route: course.route ?? verifiedSpots.map((p: any) => p.name).join(" → "),
      totalDuration: course.totalDuration ?? "",
      spots: verifiedSpots,
    };

    if (userId) {
      return NextResponse.json({
        ok: true,
        guestRemaining: null,
        course: generatedCourse,
      });
    }

    const newCount = count + 1;
    const maxAge = 60 * 60 * 24 * 365;
    const secureFlag = process.env.NODE_ENV === "production" ? "Secure; " : "";
    const res = NextResponse.json({
      ok: true,
      guestRemaining: Math.max(0, MAX_GUEST - newCount),
      course: generatedCourse,
    });
    res.headers.append(
      "Set-Cookie",
      `guest_created_count=${newCount}; Path=/; Max-Age=${maxAge}; HttpOnly; ${secureFlag}SameSite=Lax`
    );
    return res;
  } catch (error) {
    console.error("Error generating course:", error);
    return NextResponse.json(
      { error: "Failed to generate course" },
      { status: 500 }
    );
  }
}
