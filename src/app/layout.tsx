import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import { SyncUser } from "@/components/etc";
import { QueryProviders } from "./providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "SeoulCourse",
  description: "서울 여행 코스 추천 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ko">
        <body className={` antialiased `}>
          <QueryProviders>
            <SignedIn>
              <SyncUser />
            </SignedIn>
            {children}
            <Toaster />
          </QueryProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
