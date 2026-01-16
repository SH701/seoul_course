"use client";

import { deletePost } from "@/app/post/actions";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";

interface Props {
  postId: number;
  authorId: string;
}

export default function DeletePost({ postId, authorId }: Props) {
  const router = useRouter();
  const { user } = useUser();

  if (!user || user.id !== authorId) return null;

  async function handleDelete() {
    const res = await deletePost(postId);
    if (res.success) {
      toast.success("게시글이 삭제되었습니다.");
      router.push("/post");
    } else {
      toast.error("게시글이 삭제에 실패했습니다.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="ml-auto text-sm text-red-500 hover:text-red-700 font-semibold transition cursor-pointer"
    >
      삭제하기
    </button>
  );
}
