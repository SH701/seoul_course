import Link from "next/link";

interface PaginationProps {
  totalPage: number;
  currentPage: number;
}

export default function Pagination({
  totalPage,
  currentPage,
}: PaginationProps) {
  return (
    <div className="flex gap-2 mt-8 justify-center">
      {Array.from({ length: totalPage }).map((_, i) => {
        const pageNum = i + 1;
        return (
          <Link
            key={pageNum}
            href={`/post?page=${pageNum}`}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
              currentPage === pageNum
                ? "bg-purple-500 text-white border-purple-500"
                : "bg-white/60 text-gray-700 border-gray-200 hover:bg-purple-50"
            }`}
          >
            {pageNum}
          </Link>
        );
      })}
    </div>
  );
}