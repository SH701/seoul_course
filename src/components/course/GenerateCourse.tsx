"use client";

import { useState } from "react";
import { X, Clock, MapPin, Calendar, LogIn, Lock } from "lucide-react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useCourse, useSaveCourse } from "@/hooks/mutation";
import { useGuest } from "@/hooks/queries";

interface GenerateCourseProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GenerateCourse({
  isOpen,
  onClose,
}: GenerateCourseProps) {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [course, setCourse] = useState<any | null>(null);
  const router = useRouter();

  const { data: guestData, refetch: refetchGuest } = useGuest(isOpen);
  const guestRemaining = guestData?.guestRemaining ?? null;
  const { mutateAsync: generateCourse, isPending: isGenerating } = useCourse();
  const { mutateAsync: saveCourse, isPending: isSaving } = useSaveCourse();

  const handleGenerate = async () => {
    if (!message.trim()) return;

    try {
      const data = await generateCourse({
        message,
        location: location.trim() || "",
      });

      if (data?.course?.spots) {
        console.log(
          "spots (from response):",
          data.course.spots.map((s: any, i: number) => ({
            i,
            name: s.name,
            nextMove: s.nextMove,
          }))
        );
      }
      setCourse(data.course);
      setLocation("");
      setMessage("");
      refetchGuest();
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("401") || err.message.includes("guest_limit")) {
        refetchGuest();
      } else {
        alert("코스 생성에 실패했습니다.");
      }
    }
  };

  const handleSave = async () => {
    if (!course) return;

    try {
      await saveCourse({
        title: course.title,
        vibe: course.vibe,
        route: course.route,
        totalDuration: course.totalDuration,
        spots: course.spots,
      });
      alert("✅ 코스가 저장되었습니다!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ 저장 중 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  const modal = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        {!course && (
          <div className="p-6 space-y-4">
            <div className="top-0 bg-white  px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  ✨ AI 하루 코스 생성기
                </h2>
                <p className="text-sm text-gray-500 my-1">
                  AI가 당신의 하루 코스를 만들어드립니다
                </p>
                {guestRemaining !== null && (
                  <div className="text-xs text-gray-600">
                    익명 유저 남은 생성횟수:{" "}
                    <span className="font-medium text-gray-900">
                      {guestRemaining}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📍 출발 위치
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예:성수역, 이태원"
                className="w-full p-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💬 코스 요청
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="시간,원하는 활동에 대해 정확히 적어주세요"
                className="w-full p-4 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || guestRemaining === 0}
                className="flex-1 px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-medium cursor-pointer"
              >
                {isGenerating ? "코스 생성 중..." : "🎯 코스 생성하기"}
              </button>
            </div>
          </div>
        )}
        <div className="px-6 pb-6 space-y-4">
          {course && (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl p-6 text-black bg-purple-50">
                <h3 className="text-2xl font-bold">{course.title}</h3>
                <p className="text-purple-500 mt-2">{course.vibe}</p>

                <div className="flex gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4" />
                    <span>{course.spots?.length || 0}개 장소</span>
                  </div>
                </div>

                {course.route && (
                  <div className="mt-4 text-sm text-purple-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span className="truncate">{course.route}</span>
                  </div>
                )}
              </div>

              <div className="relative space-y-6 pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-linear-to-b from-purple-400 to-pink-400"></div>

                {course.spots.map((spot: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-7 top-2 w-5 h-5 rounded-full bg-white border-4 border-purple-400 shadow-md"></div>
                    <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition border border-gray-100 ">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {spot.category && (
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {spot.category}
                            </span>
                          )}
                        </div>
                        {spot.stayTime && (
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {spot.stayTime}
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {spot.name}
                      </h4>

                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        {spot.desc}
                      </p>

                      {spot.address && (
                        <div className="flex items-start gap-2 text-xs text-gray-500 mb-2">
                          <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                          <span>{spot.address}</span>
                        </div>
                      )}
                      {spot.address && (
                        <div className="mt-2 mr-2">
                          <a
                            href={`https://map.naver.com/v5/search/${encodeURIComponent(
                              spot.name.replace(/<[^>]*>/g, "")
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${spot.name} 지도에서 보기 (새창)`}
                            className="mt-1 pt-3  flex items-center gap-2 text-sm text-purple-600"
                          >
                            <span className="font-medium">
                              {spot.name} 지도에서 보기
                            </span>
                            <svg
                              className="w-3 h-3 text-gray-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 3h7v7M10 14L21 3"
                              />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {course && (
            <button
              className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "저장 중..." : "💾 이 코스 저장하기"}
            </button>
          )}
        </div>
      </div>
      {guestRemaining === 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="guest-limit-title"
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white shadow-lg rounded-2xl p-8 max-w-md w-full z-10">
            <div className="flex justify-center mb-4">
              <Lock className="w-14 h-14 text-purple-500" />
            </div>

            <h1
              id="guest-limit-title"
              className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center"
            >
              로그인 후 이용할 수 있습니다
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 text-center">
              계속해서 서비스를 이용하려면 로그인해주세요.
            </p>

            <button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition"
            >
              <LogIn className="w-5 h-5" />
              로그인하러 가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
  return createPortal(modal, document.body);
}
