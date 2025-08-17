import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";

const ui = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-ui" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
    title: "Pranay Chopra",
    description: "Made by Pranay, no turbulence detected",
};

export default function RootLayout({
                                       children,
                                       overlay,
                                   }: Readonly<{ children: ReactNode; overlay: ReactNode }>) {
    return (
        <html lang="en">
        <body className={`${ui.variable} ${mono.variable} antialiased`} style={{ background: "#F6F1EB" }}>
        <div className="relative min-h-screen">
            {children}
            {overlay}
        </div>
        </body>
        </html>
    );
}
