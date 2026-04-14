import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/context/SettingsContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "National Judicial Staff Service — Papua New Guinea",
  description: "Official website of the National Judicial Staff Service (NJSS), the administrative arm of the Supreme Court and National Court of Papua New Guinea.",
  icons: {
    icon: "/png-coa.png",
    apple: "/png-coa.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
