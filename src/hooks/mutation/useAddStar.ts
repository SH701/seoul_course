import { Stars } from "@/types/star";
import { useMutation } from "@tanstack/react-query";

export function useAddStar() {
  return useMutation({
    mutationKey: ["star", "add"],
    mutationFn: async (starData: Stars) => {
      const res = await fetch("/api/stars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(starData),
      });
      const data = await res.json();
      return data;
    },
  });
}
