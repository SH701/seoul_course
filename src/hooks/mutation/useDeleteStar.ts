import { Stars } from "@/types/star";
import { useMutation } from "@tanstack/react-query";

export function useDeleteStar() {
  return useMutation({
    mutationKey: ["star", "delete"],
    mutationFn: async (starData: Stars) => {
      const res = await fetch("/api/stars", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(starData),
      });
      const data = await res.json();
      return data;
    },
  });
}
