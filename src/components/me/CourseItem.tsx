"use client";

import { useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import GenerateCourse from "../course/GenerateCourse";
import { useDeleteCourse } from "@/hooks/mutation/useDeleteCourse";
import { toast } from "sonner";
import { Course } from "@/types";

export default function CourseItem({ course }: { course: Course }) {
  const router = useRouter();
  const { mutate: deleteCourse, isPending } = useDeleteCourse();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    if (!confirm("정말 이 코스를 삭제하시겠습니까?")) return;

    deleteCourse(course.id, {
      onSuccess: () => {
        toast.success("코스를 삭제했습니다.");
        router.refresh();
      },
    });
  };
  return (
    <>
      <li className="group bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden relative">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="absolute top-3 right-3 z-10 p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg    cursor-pointer"
          title="삭제"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div>
          <div className="p-5">
            <h3
              className="text-lg font-bold text-gray-900 hover:text-purple-600 transition mb-2 pr-10 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              {course.title}
            </h3>

            {course.vibe && (
              <p className="text-sm text-gray-600 mb-3">{course.vibe}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {Array.isArray(course.spots) ? course.spots.length : 0}개 장소
                </span>
              </div>
            </div>

            {Array.isArray(course.spots) && course.spots.length > 0 && (
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <span className="truncate">
                  {course.spots
                    .slice(0, 3)
                    .map((s) => s.name)
                    .join(" → ")}
                  {course.spots.length > 3 && " ..."}
                </span>
              </div>
            )}
          </div>

          <div className="h-1 bg-linear-to-r from-purple-400 via-pink-400 to-blue-400"></div>
        </div>
      </li>
      <GenerateCourse
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialCourse={course}
      />
    </>
  );
}
