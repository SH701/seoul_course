import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteCourse() {
  return useMutation({
    mutationKey: ["course", "delete"],
    mutationFn: async (courseId: string) => {
      const res = await fetch(`/api/course/delete?id=${courseId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      return result;
    },
  });
}
