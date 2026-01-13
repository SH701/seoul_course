"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { useParams } from "next/navigation";

import {
  getPostDetail,
  getComments,
  addComment,
} from "@/app/post/[id]/actions";
import { CommentForm, PostContent, CommentList } from "@/components/post";

export default function PostDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

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

      <PostContent post={post} likeCount={likeCount} />
      <CommentForm
        newComment={newComment}
        setNewComment={setNewComment}
        onSubmit={handleAddComment}
      />
      <CommentList comments={comments} postUser={post.user} />
    </main>
  );
}
