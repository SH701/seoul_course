import { useMutation } from "@tanstack/react-query";

export function useDeleteStar() {
  return useMutation({
    mutationKey: ["star", "delete"],
    mutationFn: async (data: { placeId: string }) => {
      const res = await fetch("/api/stars", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      return result;
    },
  });
}
