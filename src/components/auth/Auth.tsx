"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import AuthHeader from "./AuthHeader";
import AuthSection from "./AuthSection";

export default function Auth() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/main");
    }
  }, [router, isLoaded, isSignedIn]);

  return (
    <>
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[40%] left-[-10%] sm:top-60 sm:left-10 w-75-[400px] lg:w-120 opacity-30 blur-sm animate-blob">
          <Image
            src="/login/namsan.png"
            alt="남산"
            width={480}
            height={480}
            className="rounded-full"
          />
        </div>
        <div className="absolute top-10 right-0 sm:top-20 sm:right-20 w-62.5:w-[400px] lg:w-120 opacity-30 blur-sm animate-blob animation-delay-2000">
          <Image
            src="/login/palace.png"
            alt="궁"
            width={480}
            height={480}
            className="rounded-full"
          />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-62.5 sm:w-100 lg:w-120 opacity-30 blur-sm animate-blob animation-delay-1000">
          <Image
            src="/login/ddp.png"
            alt="DDP"
            width={480}
            height={480}
            className="rounded-full"
          />
        </div>
      </div>
      <AuthHeader />
      <AuthSection />
    </>
  );
}
