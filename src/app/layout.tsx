import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { enterpriseData } from "@/constants/data";

import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | ${enterpriseData.name}`,
    default: `${enterpriseData.name}`,
  },
  description: "Aplicação",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </AuthProvider>
    </>
  );
}
