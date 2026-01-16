import { usePlacePhoto } from "@/hooks/queries";
import { NaverPlace } from "@/types";
import { ImageIcon } from "lucide-react";

export default function SubRecommendationCard({
  place,
}: {
  place: NaverPlace;
}) {
  const title = place.title.replace(/<[^>]*>/g, "");
  const { data: photo } = usePlacePhoto(title);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {photo ? (
        <img src={photo} alt={title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-purple-400" />
        </div>
      )}

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-500 mb-3">{place.keyword}</p>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {place.address}
        </p>

        <button
          onClick={() =>
            window.open(
              `https://map.naver.com/v5/search/${encodeURIComponent(title)}`,
              "_blank"
            )
          }
          className="w-full bg-purple-600 text-white text-sm py-2 rounded-lg hover:bg-purple-700 transition cursor-pointer"
        >
          지도에서 보기
        </button>
      </div>
    </div>
  );
}
