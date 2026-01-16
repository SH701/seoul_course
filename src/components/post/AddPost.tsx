"use client";

import { writePost } from "@/app/post/actions";
import { useActionState } from "react";

export default function AddPost() {
  const [state, action, isPending] = useActionState(writePost, {
    success: false,
  });
  return (
    <form action={action} className="space-y-4 pb-4 sm:mb-6">
      <textarea
        name="post"
        placeholder="당신만의 코스를 공유해보세요!"
        className="textarea-bordered rounded w-full border p-3 h-[120%]"
      ></textarea>

      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
      <div className="flex justify-center gap-5">
        <button
          type="submit"
          disabled={isPending}
          className=" w-25 bg-purple-500  hover:bg-purple-600 text-white font-medium border-none py-1
        rounded-md text-center  transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-purple-400"
        >
          {isPending ? <span>작성 중...</span> : <span>작성하기</span>}
        </button>
      </div>
    </form>
  );
}
