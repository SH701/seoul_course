import { db } from "@/lib/db";
import { FolderHeart } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { Course, Stars } from "@/types";

import { MyStar, MyCourse } from "@/components/me";
import { BackButton } from "@/components/common";

export default async function Me() {
  const user = await currentUser();
  const stars: Stars[] = await db.star.findMany({
    where: { userId: user?.id },
    orderBy: { created_at: "desc" },
  });
  const courses = (await db.course.findMany({
    where: { userId: user?.id },
    orderBy: { created_at: "desc" },
  })) as unknown as Course[];

  const isEmpty = stars.length === 0 && courses.length === 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <FolderHeart className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">내 저장 목록</h1>
          </div>
          <BackButton />
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-center bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-md p-12">
            <FolderHeart className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              아직 저장된 항목이 없습니다.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              마음에 드는 장소나 코스를 저장해 보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {courses.length > 0 && <MyCourse courses={courses} />}
            {stars.length > 0 && <MyStar stars={stars} />}
          </div>
        )}
      </div>
    </div>
  );
}
