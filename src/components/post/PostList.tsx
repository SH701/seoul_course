import { PostItem } from "@/components/post";
import { PostWithUser } from "@/types";

interface PostListProps {
  posts: PostWithUser[];
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
    <div className="flex flex-col gap-4 sm:mt-10 my-4">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} userImageUrl={userImageUrl} />
      ))}
    </div>
  );
}
