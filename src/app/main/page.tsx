"use client";

import { ChatWidget } from "@/components/chat";
import {
  Top,
  Sidebar,
  StatsCards,
  HotPlaces,
  EmptyState,
  PlaceModal,
  RecommendationList,
} from "@/components/main";
import { useRecommendations, useWeather } from "@/hooks/queries";
import { useAppStore } from "@/store/useAppStore";

export default function Home() {
  const { selectedGu, selectedItem, setSelectedItem } = useAppStore();

  const { data: recommendations = [], isLoading } = useRecommendations(
    selectedGu?.id || ""
  );
  const { data: weather } = useWeather(selectedGu?.name || "");

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      <div className="hidden sm:block sm:w-72">
        <Sidebar isMobile={false} />
      </div>

      <main className="flex-1 min-h-screen">
        <Top />
        <Sidebar isMobile={true} />

        {selectedGu ? (
          <div className="p-4 sm:p-8 lg:p-12">
            <StatsCards
              rating={selectedGu.rating}
              vibe={selectedGu.vibe}
              hotspot={selectedGu.hotspot}
              weather={weather}
            />
            <RecommendationList
              recommendations={recommendations}
              loading={isLoading}
              selectedGuId={selectedGu.id}
              selectedGuColor={selectedGu.color}
              onItemClick={handleItemClick}
              guName={selectedGu.name}
            />
            <div className="bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl p-6 sm:p-8 text-white">
              <HotPlaces gu={selectedGu.name} />
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
        <ChatWidget />
      </main>

      <PlaceModal
        selectedItem={selectedItem}
        onClose={closeModal}
        guName={selectedGu?.name}
      />
    </div>
  );
}
