import type { Metadata } from "next";
import { Inter, Kanit } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// Google Fonts Setup
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// SEO Metadata
export const metadata: Metadata = {
  title: "คณะสังคมศาสตร์ | มหาวิทยาลัยราชภัฏเชียงราย",
  description: "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย - Faculty of Social Sciences, Chiang Rai Rajabhat University. เปิดสอนหลักสูตรปริญญาตรี และบัณฑิตศึกษา",
  keywords: ["สังคมศาสตร์", "มหาวิทยาลัยราชภัฏเชียงราย", "CRRU", "Social Sciences", "เชียงราย"],
  authors: [{ name: "Faculty of Social Sciences, CRRU" }],
  openGraph: {
    title: "คณะสังคมศาสตร์ | มหาวิทยาลัยราชภัฏเชียงราย",
    description: "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
    locale: "th_TH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" data-theme="socTheme" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${kanit.variable} font-sans antialiased bg-white text-scholar-text flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
