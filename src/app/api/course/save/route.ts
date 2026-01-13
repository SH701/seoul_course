import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, vibe, spots, personaId } = await req.json();

    const saved = await db.course.create({
      data: {
        userId,

        title,
        vibe,
        spots,
      },
    });

    return NextResponse.json({ success: true, courseId: saved.id });
  } catch (error) {
    console.error("❌ Error saving course:", error);
    return NextResponse.json(
      { error: "Failed to save course" },
      { status: 500 }
    );
  }
}
