"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useParams } from "next/navigation";

import {
  getPostDetail,
  getComments,
  addComment,
  likePost,
  dislikePost,
} from "./actions";
import PostDate from "@/components/post/PostDate";
import DeletePost from "@/components/post/DeletePost";

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const postData = await getPostDetail(Number(id));
        setPost(postData);
        setLikeCount(postData.likeCount || 0);

        const commentData = await getComments(Number(id));
        setComments(commentData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return alert("댓글을 입력해주세요.");
    const formData = new FormData();
    formData.append("postId", id.toString());
    formData.append("comment", newComment);
    try {
      await addComment(formData);
      const updatedComments = await getComments(Number(id));
      setComments(updatedComments);
      setNewComment("");
    } catch (error) {
      console.error(error);
      alert("댓글 작성 중 오류 발생");
    }
  }

  // 좋아요 토글
  async function toggleLike() {
    try {
      if (liked) {
        await dislikePost(Number(id));
        setLikeCount((prev) => prev - 1);
      } else {
        await likePost(Number(id));
        setLikeCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (err) {
      console.error(err);
      alert("좋아요 처리 중 오류 발생");
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        로딩 중...
      </div>
    );

  if (!post)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        게시글을 찾을 수 없습니다.
      </div>
    );

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <Link
            href="/post"
            className="text-lg font-semibold text-purple-600 hover:underline"
          >
            게시글 목록
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{post.post}</h1>
      </div>

      {/* 🔹 작성자 + 내용 */}
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
              className="rounded-xl border object-cover max-h-[450px]"
            />
          </div>
        )}

        {/* ❤️ 좋아요 버튼 */}
        <div className="mt-6">
          <button
            onClick={toggleLike}
            className={` rounded-lg text-sm font-medium transition flex flex-row gap-1`}
          >
            <p>❤️</p>
            {likeCount}
          </button>
        </div>
      </div>

      {/* 🔹 댓글 입력 */}
      <form
        onSubmit={handleAddComment}
        className="bg-white bordershadow-sm rounded-xl p-4 mb-6"
      >
        <textarea
          className="w-full border border-gray-400 rounded-md p-3 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none"
          placeholder="댓글을 입력하세요..."
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          className="mt-3 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition"
        >
          댓글 등록
        </button>
      </form>

      {/* 🔹 댓글 목록 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500">등록된 댓글이 없습니다.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100"
            >
              {comment.user.photo ? (
                <Image
                  src={comment.user.photo}
                  alt="avatar"
                  width={48}
                  height={36}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800">
                    {post.user?.username ??
                      post.user?.nickname ??
                      post.user?.email ??
                      null}
                  </p>
                  <PostDate date={comment.created_at} />
                </div>
                <p className="text-gray-700 text-sm mt-1">{comment.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
