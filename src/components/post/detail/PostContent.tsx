"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { PostDate, DeletePost } from "@/components/post";
import { likePost, dislikePost } from "@/app/post/[id]/actions";
import { Post } from "@/types";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface PostContentUser {
  photo: string | null;
  username: string | null;
  nickname: string | null;
  email: string | null;
}

interface PostContentProps {
  post: Post & { user: PostContentUser; Like: { userId: string }[] };
  likeCount: number;
  currentUserId?: string | null;
}

export default function PostContent({
  post,
  likeCount: initialLikeCount,
  currentUserId,
}: PostContentProps) {
  const [isPending, startTransition] = useTransition();
  const [isLiked, setIsLiked] = useState(
    currentUserId
      ? post.Like.some((like) => like.userId === currentUserId)
      : false
  );
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLike = () => {
    startTransition(async () => {
      try {
        if (isLiked) {
          await dislikePost(post.id);
          setIsLiked(false);
          setLikeCount((prev) => prev - 1);
        } else {
          await likePost(post.id);
          setIsLiked(true);
          setLikeCount((prev) => prev + 1);
        }
      } catch {
        toast.error("좋아요 처리에 실패했습니다.");
      }
    });
  };
  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        {post.user.photo ? (
          <Image
            src={post.user.photo}
            alt="avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200" />
        )}
        <div className="flex justify-between items-center w-full">
          <p className="font-semibold text-gray-800">
            {post.user?.username ??
              post.user?.nickname ??
              post.user?.email ??
              "익명 사용자"}
          </p>
          <div className="flex flex-col gap-1">
            <PostDate date={post.created_at} />
            <DeletePost postId={post.id} authorId={post.userId} />
          </div>
        </div>
      </div>

      <p className="text-gray-800 whitespace-pre-wrap">{post.post}</p>

      {post.photo && (
        <div className="mt-4">
          <Image
            src={post.photo}
            alt="게시글 이미지"
            width={700}
            height={500}
            className="rounded-xl border object-cover max-h-112.5"
          />
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={handleLike}
          disabled={isPending}
          className="rounded-lg text-sm font-medium transition flex flex-row gap-1 items-center hover:opacity-70 disabled:opacity-50"
        >
          <Heart
            className={isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
          <p>{likeCount}</p>
        </button>
      </div>
    </div>
  );
}
