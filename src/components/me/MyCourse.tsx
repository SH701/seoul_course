import { Course } from "@/types/prisma";
import CourseItem from "./CourseItem";
import { Route } from "lucide-react";

interface MyCourseProps {
  courses: Course[];
}

export default function MyCourse({ courses }: MyCourseProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Route className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">
          내 코스 ({courses.length})
        </h2>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {courses.map((course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </ul>
    </section>
  );
}
