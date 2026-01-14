"use client";

import { ArrowBigLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function BackButton({ onClick, className }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`cursor-pointer ${className || ""}`}
    >
      <ArrowBigLeft className="size-8 text-purple-600" />
    </button>
  );
}
