"use client";

import { useAddStar } from "@/hooks/mutation/useAddStar";
import { useCheckStar } from "@/hooks/mutation/useCheckStar";
import { useDeleteStar } from "@/hooks/mutation/useDeleteStar";
import { RecommendationItemProps } from "@/types/recommandation";
import {
  Coffee,
  Camera,
  Clock,
  ChevronRight,
  Utensils,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";

const iconMap: Record<string, any> = {
  Coffee,
  Utensils,
  Camera,
  Star,
};

export default function RecommendationItem({
  item,
  color,
  onClick,
}: RecommendationItemProps) {
  const IconComponent = iconMap[item.icon] || Coffee;
  const [saved, setSaved] = useState(false);

  const { mutate: checkStar } = useCheckStar();
  const { mutate: addStar, isPending: isAddingPending } = useAddStar();
  const { mutate: deleteStar, isPending: isDeletingPending } = useDeleteStar();

  const isLoading = isAddingPending || isDeletingPending;

  const save = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (saved) {
      deleteStar(
        {
          placeId: item.placeId,
          title: item.title,
          desc: item.desc || "",
          icon: item.icon,
          time: item.time,
          price: item.price || "",
          address: item.address,
        },
        {
          onSuccess: () => setSaved(false),
        }
      );
    } else {
      addStar(
        {
          placeId: item.placeId,
          title: item.title,
          desc: item.desc || "",
          icon: item.icon,
          time: item.time,
          price: item.price || "",
          address: item.address,
        },
        {
          onSuccess: () => setSaved(true),
        }
      );
    }
  };
  return (
    <div
      className="group flex items-center gap-6 sm:p-6 px-3 py-2 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer relative"
      onClick={onClick}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}20` }}
      >
        <IconComponent className="w-8 h-8" style={{ color }} />
      </div>
      <div className="flex-1">
        <div className="flex items-center my-2">
          <h4 className="sm:text-xl font-bold text-[15px] truncate text-gray-900 group-hover:text-purple-600 transition-colors ">
            {item.title}
          </h4>
          <button
            onClick={save}
            disabled={isLoading}
            className="ml-auto p-1  transition-transform disabled:opacity-50 disabled:cursor-not-allowed absolute sm:static right-3"
            aria-label={saved ? "Unsave" : "Save"}
          >
            <Star
              className={`size-5 transition-colors ${
                saved
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            />
          </button>
        </div>
        <p className="text-gray-600 mb-3 text-sm sm:text-base">{item.desc}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {item.time}
          </div>
          {item.price && (
            <div className="text-sm font-medium" style={{ color }}>
              {item.price}
            </div>
          )}
        </div>
      </div>
      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
    </div>
  );
}
