import { useQuery } from "@tanstack/react-query";

export function useGuest(enabled: boolean = false) {
  return useQuery({
    queryKey: ["guest"],
    queryFn: async () => {
      const res = await fetch("/api/guest");
      if (!res.ok) throw new Error("Failed to fetch guest info");
      return res.json();
    },
    enabled,
  });
}
