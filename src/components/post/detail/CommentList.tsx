import { CommentWithUser } from "@/types";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: CommentWithUser[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-center text-gray-500">등록된 댓글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
