import { useMutation } from "@tanstack/react-query";

export function useChat() {
  return useMutation({
    mutationKey: ["message"],
    mutationFn: async (message: string) => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("메세지를 보내는데 실패했습니다.");
      return res.json();
    },
  });
}
