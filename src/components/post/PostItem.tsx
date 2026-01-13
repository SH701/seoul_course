import Link from "next/link";
import Image from "next/image";
import PostDate from "@/components/post/PostDate";

interface PostItemProps {
  post: any;
  userImageUrl?: string;
}

export default function PostItem({ post, userImageUrl }: PostItemProps) {
  return (
    <Link
      href={`/post/${post.id}`}
      className="block py-5 hover:bg-purple-50/40 px-6  transition-all duration-200"
    >
      <div className="flex gap-4">
        {post.user.photo ? (
          <Image
            src={post.user.photo}
            alt="avatar"
            width={44}
            height={44}
            className="rounded-full size-11 border border-gray-200"
          />
        ) : (
          <Image
            src={userImageUrl || "/default-avatar.png"}
            alt="프로필"
            width={44}
            height={44}
            className="size-11 rounded-full border border-gray-200"
          />
        )}

        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-800">
              {post.user.username ??
                post.user.nickname ??
                post.user.email ??
                "익명 사용자"}
            </p>
            <PostDate date={post.created_at} />
          </div>
          <p className="pt-2 text-sm text-gray-700 leading-relaxed">
            {post.post}
          </p>
          {post.photo && (
            <div className="mt-3">
              <Image
                src={post.photo}
                alt="post image"
                width={600}
                height={400}
                className="rounded-lg object-cover max-h-80 w-full shadow-md"
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}