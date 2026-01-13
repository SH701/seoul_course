import { Star } from "lucide-react";
import StarItem from "./StarItem";
import { Stars } from "@/types/prisma";

interface MyStarProps {
  stars: Stars[];
}

export default function MyStar({ stars }: MyStarProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-6 h-6 text-yellow-500 fill-yellow-400" />
        <h2 className="text-xl font-bold text-gray-900">
          내 장소 ({stars.length})
        </h2>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stars.map((star) => (
          <StarItem key={star.placeId} star={star} />
        ))}
      </ul>
    </section>
  );
}
