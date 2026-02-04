import type { Metadata } from "next";
import { Inter, Kanit } from "next/font/google";
import Link from "next/link";
import ClientLayout from "@/components/ClientLayout";
import { ThemeProvider } from "@/components/theme-provider";
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
    <html lang="th" data-theme="socTheme" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${kanit.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
