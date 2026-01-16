import { usePlacePhoto } from "@/hooks/queries";
import { NaverPlace } from "@/types";
import { Clock, ImageIcon, MapPin } from "lucide-react";

export default function MainRecommendation({ place }: { place: NaverPlace }) {
  const mainTitle = place.title.replace(/<[^>]*>/g, "");
  const { data: mainPhoto } = usePlacePhoto(mainTitle);

  return (
    <div className="bg-linear-to-br from-purple-100 to-pink-100 rounded-3xl sm:p-6 mb-6 shadow-lg">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shadow-lg">
          {mainPhoto ? (
            <img
              src={mainPhoto}
              alt={mainTitle}
              className="w-full h-80 object-cover"
            />
          ) : (
            <div className="w-full h-80 bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-purple-400" />
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 px-5 pb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{mainTitle}</h2>
          <p className="text-gray-600 mb-3">{place.keyword}</p>

          <div className="flex items-start gap-2 text-gray-700 mb-3">
            <MapPin className="w-4 h-4 text-purple-600 mt-1" />
            <span className="text-base truncate">{place.address}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm">{place.category}</span>
          </div>

          <button
            onClick={() =>
              window.open(
                `https://map.naver.com/v5/search/${encodeURIComponent(
                  mainTitle
                )}`,
                "_blank"
              )
            }
            className="mt-5 w-full bg-purple-600 text-white text-sm py-2 rounded-lg hover:bg-purple-700 transition cursor-pointer"
          >
            지도에서 보기
          </button>
        </div>
      </div>
    </div>
  );
}
