import { useMutation } from "@tanstack/react-query";

export function useCheckStar() {
  return useMutation({
    mutationKey: ["star"],
    mutationFn: async () => {
      const res = await fetch("/api/stars/check");
      const data = await res.json();
      return data;
    },
  });
}
