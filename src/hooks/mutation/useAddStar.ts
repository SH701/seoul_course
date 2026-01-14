import { Stars } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddStar() {
  const queryClient = useQueryClient();
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stars"] });
    },
  });
}
