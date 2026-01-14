import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteStar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["star"],
    mutationFn: async (data: { placeId: string }) => {
      const res = await fetch("/api/stars", {
        method: "DELETE",
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
