import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddStar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["star", "add"],
    mutationFn: async (data: { placeId: string }) => {
      const res = await fetch("/api/stars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stars"] });
    },
  });
}
