import { useMutation } from "@tanstack/react-query";

interface SaveCourseParams {
  title: string;
  vibe: string;
  route: string;
  totalDuration: string;
  spots: any[];
}

export function useSaveCourse() {
  return useMutation({
    mutationKey: ["save-course"],
    mutationFn: async (params: SaveCourseParams) => {
      const res = await fetch("/api/course/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error("코스 저장에 실패했습니다.");
      return res.json();
    },
  });
}
