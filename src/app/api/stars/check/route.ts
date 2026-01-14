import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ saved: false });
    }

    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("placeId");

    if (!placeId) {
      return NextResponse.json({ saved: false });
    }

    const star = await db.star.findUnique({
      where: {
        userId_placeId: {
          userId,
          placeId,
        },
      },
    });

    return NextResponse.json({ saved: !!star });
  } catch (error) {
    return NextResponse.json({ saved: false });
  }
}
