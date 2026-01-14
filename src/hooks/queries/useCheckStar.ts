import { useQuery } from "@tanstack/react-query";

export function useCheckStar(placeId: string | null) {
  return useQuery({
    queryKey: ["stars", placeId],
    queryFn: async () => {
      if (!placeId) return { saved: false };
      const res = await fetch(
        `/api/stars/check?placeId=${encodeURIComponent(placeId)}`
      );
      if (!res.ok) throw new Error("Failed to fetch star info");
      return res.json();
    },
    enabled: !!placeId,
  });
}
