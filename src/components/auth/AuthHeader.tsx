import { MapPin } from "lucide-react";
import { SignInButton, SignUpButton, SignedOut } from "@clerk/nextjs";

export default function AuthHeader() {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-10 py-6">
      <div className="flex items-center gap-2">
        <MapPin className="w-6 h-6 text-pink-400" />
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wide">
          SeoulCourse
        </h1>
      </div>

      <div className="flex items-center gap-3 z-50">
        <SignedOut>
          <SignInButton mode="modal" forceRedirectUrl="/main">
            <button className="px-4 sm:px-5 py-2 rounded-full font-semibold text-sm sm:text-base bg-white text-gray-900 shadow-md hover:bg-gray-100 transition">
              로그인
            </button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/main">
            <button className="px-4 sm:px-5 py-2 rounded-full font-semibold text-sm sm:text-base bg-white text-gray-900 shadow-md hover:bg-gray-100 transition">
              회원가입
            </button>
          </SignUpButton>
        </SignedOut>
      </div>
    </header>
  );
}
