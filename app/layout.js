import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Weather — Real-time Forecasts",
  description:
    "Get instant weather updates for any city worldwide. Beautiful, fast, and accurate forecasts powered by cutting-edge technology.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body className={inter.className}>
        <div className="animated-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="blob blob-4"></div>
          <div className="noise-overlay"></div>
        </div>
        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
