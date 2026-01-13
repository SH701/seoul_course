import { NextResponse } from "next/server";
import OpenAI from "openai";

import { personas } from "@/data/persona";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function searchNaver(query: string, display = 5) {
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
    if (!res.ok) return { items: [] };
    return res.json();
  } catch {
    return { items: [] };
  }
}

export async function POST(req: Request) {
  try {
    const { message, personaId } = await req.json();

    const persona = personas.find((p) => p.id === personaId) ?? personas[0];

    const keywordRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
너는 사용자의 문장에서 장소 검색에 적합한 키워드를 추출하는 어시스턴트야.
결과는 "지역 카테고리" 형식으로 출력해. (예: "합정 카페", "강남 맛집")
인사, 감탄사, 일반 대화는 무시하고 검색에 쓸만한 핵심만 추출해.

예시:
- 합정 카페 추천해줘 → 합정 카페
- 강남 맛집 알려줘 → 강남 맛집
- 홍대 근처 분위기 좋은 곳 → 홍대 카페
- 명동에서 먹을 곳 → 명동 맛집
- 안녕? → (출력 없음)
      `,
        },
        { role: "user", content: message },
      ],
    });

    const keyword = keywordRes.choices[0].message.content?.trim() || message;
    const naverData = await searchNaver(keyword);

    if (!naverData.items || naverData.items.length === 0) {
      return NextResponse.json({
        reply:
          "죄송해요, 해당 지역에서 장소를 찾지 못했어요. 다른 지역이나 카테고리로 다시 검색해볼까요?",
        persona: persona.name,
        imagePath: persona.image,
      });
    }

    // 검색된 장소 목록 포맷팅
    const placeList = naverData.items
      .map((item: any, idx: number) => {
        const name = item.title?.replace(/<[^>]*>/g, "") || "이름 없음";
        const category = item.category || "카테고리 없음";
        const address = item.address || item.roadAddress || "주소 없음";
        return `${idx + 1}. ${name} (${category}) - ${address}`;
      })
      .join("\n");

    const answerRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `${persona.prompt}

**중요 규칙:**
1. 아래 검색된 장소 목록에서만 선택해서 추천할 것
2. 목록에 없는 장소를 절대 만들거나 추천하지 말 것
3. 반드시 목록의 정확한 장소명을 사용할 것
4. 2~3곳만 추천하고, 각 장소마다 20자 이내로 특징 설명`,
        },
        {
          role: "user",
          content: `
사용자 요청: ${message}
검색 키워드: ${keyword}

**검색된 실제 장소 목록:**
${placeList}

위 목록에서만 골라서 추천해줘!`,
        },
      ],
    });

    const reply = answerRes.choices[0].message.content;

    return NextResponse.json({
      reply,
      persona: persona.name,
      imagePath: persona.image,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json({ error: "AI 추천 생성 실패" }, { status: 500 });
  }
}
