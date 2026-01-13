interface CommentFormProps {
  newComment: string;
  setNewComment: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function CommentForm({
  newComment,
  setNewComment,
  onSubmit,
}: CommentFormProps) {
  return (
    <form
      onSubmit={onSubmit}
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
  );
}
