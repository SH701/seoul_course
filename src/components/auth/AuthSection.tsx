"use client";

import { SignUpButton, SignedOut } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
export default function AuthSection() {
  const router = useRouter();
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 sm:py-32 px-4 sm:px-6 relative z-50">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 bg-linear-to-r from-pink-400 via-purple-500 to-blue-600 bg-clip-text text-transparent leading-tight"
      >
        서울 속 나만의 하루
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-gray-800 max-w-xl sm:max-w-2xl mb-10 text-base sm:text-lg leading-relaxed"
      >
        인기 카페와 맛집, 그리고 숨겨진 스팟까지.{" "}
        <br className="hidden sm:block" />
        AI가 당신의 취향을 이해하고, 딱 맞는 코스를 추천해드려요.
      </motion.p>

      <SignedOut>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <SignUpButton mode="modal" forceRedirectUrl="/main">
            <button className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full font-semibold text-lg bg-linear-to-r from-pink-500 via-purple-500 to-blue-600 text-white shadow-lg hover:scale-105 transform transition-transform">
              지금 시작하기
            </button>
          </SignUpButton>
          <button
            className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full font-semibold text-lg bg-linear-to-r from-pink-500 via-purple-500 to-blue-600 text-white shadow-lg hover:scale-105 transform transition-transform"
            onClick={() => router.push("/main")}
          >
            로그인 없이 시작하기
          </button>
        </motion.div>
      </SignedOut>
    </section>
  );
}
