import Image from "next/image";
import { PostDate } from "@/components/post";

interface CommentItemProps {
  comment: any;
  postUser: any;
}

export default function CommentItem({ comment, postUser }: CommentItemProps) {
  return (
    <div className="flex gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
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
            {postUser?.username ??
              postUser?.nickname ??
              postUser?.email ??
              null}
          </p>
          <PostDate date={comment.created_at} />
        </div>
        <p className="text-gray-700 text-sm mt-1">{comment.comment}</p>
      </div>
    </div>
  );
}
