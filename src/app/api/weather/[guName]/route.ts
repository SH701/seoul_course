import { Weather } from "@/lib/weather";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ guName: string }> }
) {
  try {
    const { guName: encodedGuName } = await params;
    const guName = decodeURIComponent(encodedGuName);
    const data = await Weather(guName);
    return NextResponse.json(data);
  } catch (error) {
    console.error("날씨 API 에러:", error);

    const message =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";

    const status = message.includes("찾을 수 없습니다") ? 404 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
