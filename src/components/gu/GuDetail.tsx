"use client";

import { MapPin, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/button/BackButton";
import { Key, useState } from "react";
import { useGuRecommendations } from "@/hooks/queries/useGuRecommendations";
import MainRecommendation from "@/components/gu/recommend/MainRecommend";
import SubRecommendationCard from "@/components/gu/recommend/SubRecommend";

type CategoryType = "cafe" | "restaurant" | "attraction";

const categoryInfo = {
  cafe: {
    label: "카페",
    color: "from-purple-500 to-pink-500",
  },
  restaurant: {
    label: "식당",
    color: "from-pink-500 to-red-500",
  },
  attraction: {
    label: "놀거리",
    color: "from-purple-600 to-blue-500",
  },
};

interface GuDetailClientProps {
  id: string;
  guName: string;
}

export default function GuDetail({ id, guName }: GuDetailClientProps) {
  const [activeCategory, setActiveCategory] =
    useState<CategoryType>("restaurant");
  const router = useRouter();

  const {
    data: recommendations = [],
    isLoading,
    error,
    refetch,
  } = useGuRecommendations(id, activeCategory);

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
        <div className="text-xl font-medium text-gray-700">
          추천 장소를 불러오는 중...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">오류 발생</h2>
          <p className="text-gray-600 mb-4">데이터를 불러오지 못했습니다.</p>
          <button
            onClick={() => refetch()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            다시 시도
          </button>
        </div>
      </div>
    );

  if (!recommendations.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            추천 장소가 없습니다
          </h2>
        </div>
      </div>
    );

  const main = recommendations[0];
  const sub = recommendations.slice(1, 4);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 카테고리 */}
        <div className="flex gap-6 mb-10 justify-center items-center">
          <button
            onClick={() => router.push("/main")}
            className="absolute left-8"
          >
            <BackButton />
          </button>

          {(Object.keys(categoryInfo) as CategoryType[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`p-3 rounded-full font-medium text-sm transition-all ${
                activeCategory === cat
                  ? `bg-gradient-to-r ${categoryInfo[cat].color} text-white shadow-lg`
                  : "bg-white text-purple-600 border-2 border-purple-200"
              }`}
            >
              <p className="font-semibold">{categoryInfo[cat].label}</p>
            </button>
          ))}
        </div>

        <div className="flex my-4">
          <MapPin className="w-8 h-8 text-purple-600 mt-1" />
          <h2 className="text-xl font-bold pt-1 pl-2">{guName}의 추천 장소</h2>
        </div>

        <MainRecommendation place={main} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sub.map((place: unknown, i: Key | null | undefined) => (
            <SubRecommendationCard key={i} place={place} />
          ))}
        </div>
      </div>
    </main>
  );
}
