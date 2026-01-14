import { useMutation } from "@tanstack/react-query";

export function useCheckStar() {
  return useMutation({
    mutationKey: ["star", "check"],
    mutationFn: async ({ placeId }: { placeId: string }) => {
      const res = await fetch("/api/stars/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ placeId }),
      });
      const data = await res.json();
      return data.saved;
    },
  });
}
