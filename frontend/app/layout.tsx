import type { Metadata } from "next";
import { Inter, Kanit } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import JsonLd from "@/components/seo/JsonLd";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://soc.crru.ac.th'),
  title: {
    template: "%s | คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
    default: "คณะสังคมศาสตร์ | มหาวิทยาลัยราชภัฏเชียงราย",
  },
  description: "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย - Faculty of Social Sciences, Chiang Rai Rajabhat University. เปิดสอนหลักสูตรปริญญาตรี และบัณฑิตศึกษา วิจัย นวัตกรรม และบริการวิชาการเพื่อพัฒนาท้องถิ่น",
  keywords: ["สังคมศาสตร์", "มหาวิทยาลัยราชภัฏเชียงราย", "CRRU", "Social Sciences", "เชียงราย", "งานวิจัย", "บริการวิชาการ"],
  authors: [{ name: "Faculty of Social Sciences, CRRU", url: "https://soc.crru.ac.th" }],
  creator: "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
  publisher: "มหาวิทยาลัยราชภัฏเชียงราย",
  openGraph: {
    title: "คณะสังคมศาสตร์ | มหาวิทยาลัยราชภัฏเชียงราย",
    description: "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย (Faculty of Social Sciences, CRRU)",
    url: "https://soc.crru.ac.th",
    siteName: "Faculty of Social Sciences, CRRU",
    locale: "th_TH",
    type: "website",
  },
  alternates: {
    canonical: "https://soc.crru.ac.th",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "คณะสังคมศาสตร์ มหาวิทยาลัยราชภัฏเชียงราย",
  "alternateName": [
    "Faculty of Social Sciences, Chiang Rai Rajabhat University",
    "SOC CRRU"
  ],
  "url": "https://soc.crru.ac.th",
  "logo": "https://soc.crru.ac.th/images/logo.png",
  "parentOrganization": {
    "@type": "CollegeOrUniversity",
    "name": "มหาวิทยาลัยราชภัฏเชียงราย",
    "alternateName": "Chiang Rai Rajabhat University",
    "url": "https://www.crru.ac.th"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "80 หมู่ 9 ถนนพหลโยธิน ตำบลบ้านดู่",
    "addressLocality": "อำเภอเมืองเชียงราย",
    "addressRegion": "จังหวัดเชียงราย",
    "postalCode": "57100",
    "addressCountry": "TH"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+66-53-776-000",
    "contactType": "general",
    "email": "socialscience@crru.ac.th",
    "availableLanguage": ["Thai", "English"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" data-theme="socTheme" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body
        className={`${inter.variable} ${kanit.variable} font-sans antialiased bg-white text-scholar-text flex flex-col min-h-screen`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
