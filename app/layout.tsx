import type { Metadata } from "next";
import { Archivo, Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BetchaPokah — No-limit hold'em with friends",
    template: "%s · BetchaPokah",
  },
  description:
    "Play Texas Hold'em with 3 to 8 people. Free chips, no deposits, no real money. Sit down in under a minute.",
  keywords: ["poker", "texas hold'em", "online poker", "free chips", "no-limit"],
  openGraph: {
    title: "BetchaPokah — No-limit hold'em with friends",
    description:
      "Play Texas Hold'em with 3 to 8 people. Free chips, no deposits, no real money.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-baize-950 font-sans text-bone-100">
        {children}
      </body>
    </html>
  );
}