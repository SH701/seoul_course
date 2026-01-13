import { useMutation } from "@tanstack/react-query";

interface CourseParams {
  message: string;
  location: string;
}

export function useCourse() {
  return useMutation({
    mutationKey: ["course"],
    mutationFn: async (params: CourseParams) => {
      const res = await fetch("/api/course/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error("코스 생성에 실패했습니다.");
      return res.json();
    },
  });
}
