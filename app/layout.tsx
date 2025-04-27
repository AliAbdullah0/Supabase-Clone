import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import UserProvider from "@/context/UserContext";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Superbase",
  description: "An Open Source Supabase Alternative",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${monaSans.className} antialiased bg-dark`}
      >
        <UserProvider>
        {children}
        <Toaster
        position="bottom-right"
        toastOptions={{
          className: cn('bg-dark text-neutral-100 border-white/10'),
          style: {
            background: '#171717', // bg-hover
            color: '#f5f5f5', // neutral-100
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
      </UserProvider>
      </body>
    </html>
  );
}
