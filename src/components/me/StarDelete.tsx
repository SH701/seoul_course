"use client";

import { useDeleteStar } from "@/hooks/mutation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function StarDelete({ placeId }: { placeId: string }) {
  const { mutate: deleteStar, isPending } = useDeleteStar();
  const handleDelete = () => {
    deleteStar(
      { placeId },
      {
        onSuccess: () => {
          toast.success("저장 목록에서 삭제했습니다.");
        },
        onError: () => {
          toast.error("삭제에 실패했습니다.");
        },
      }
    );
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className=" p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg  cursor-pointer"
      title="삭제"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
