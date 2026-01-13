import PostItem from "@/components/post/PostItem";

interface PostListProps {
  posts: any[];
  userImageUrl?: string;
}

export default function PostList({ posts, userImageUrl }: PostListProps) {
  if (posts.length === 0) {
    return (
      <span className="mt-[10%] text-center text-gray-600">
        등록된 글이 없습니다.
      </span>
    );
  }

  return (
    <div className="sm:mt-10 py-4 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100">
      <div className="flex flex-col divide-y divide-gray-400">
        {posts.map((post: any) => (
          <PostItem key={post.id} post={post} userImageUrl={userImageUrl} />
        ))}
      </div>
    </div>
  );
}