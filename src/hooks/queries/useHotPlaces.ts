import { useQuery } from "@tanstack/react-query";
import { getMsUntilMidnight } from "@/lib";

export function useHotPlaces(gu: string) {
  return useQuery({
    queryKey: ["hot-places", gu],
    queryFn: async () => {
      const res = await fetch(`/api/hot-places?gu=${gu}`);
      if (!res.ok) throw new Error("Failed to fetch hot places");
      return res.json();
    },
    staleTime: getMsUntilMidnight(),
  });
}
