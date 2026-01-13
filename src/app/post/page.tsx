import { getAllPosts } from "./actions";
import AddPost from "@/components/post/AddPost";
import { currentUser } from "@clerk/nextjs/server";
import Header from "@/components/post/Header";
import PostList from "@/components/post/PostList";
import Pagination from "@/components/post/Pagination";

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export const dynamic = "force-dynamic";

export default async function Posts({ searchParams }: Props) {
  const { page } = await searchParams;
  const pages = Number(page || "1");
  const { posts, totalPage } = await getAllPosts(pages);
  const user = await currentUser();

  return (
    <>
      <div className="relative flex items-start justify-center min-h-screen overflow-hidden transition-colors duration-500 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-28">
        <Header />
        <div className=" flex flex-col w-[80%] h-full mx-auto">
          <AddPost />
          <PostList posts={posts} userImageUrl={user?.imageUrl} />
          <Pagination totalPage={totalPage} currentPage={pages} />
        </div>
      </div>
    </>
  );
}
