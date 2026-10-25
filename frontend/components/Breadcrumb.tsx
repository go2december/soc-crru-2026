import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'หน้าแรก',
        item: 'https://soc.crru.ac.th',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: item.href
          ? item.href.startsWith('http')
            ? item.href
            : `https://soc.crru.ac.th${item.href}`
          : undefined,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className={`text-xs text-slate-500 py-1 ${className}`}>
        <ol className="flex items-center flex-wrap gap-1.5">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-slate-600 hover:text-scholar-accent transition-colors font-medium"
            >
              <Home className="size-3.5 text-slate-400" aria-hidden="true" />
              <span>หน้าแรก</span>
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="inline-flex items-center gap-1.5">
                <ChevronRight className="size-3 text-slate-400 shrink-0" aria-hidden="true" />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-slate-600 hover:text-scholar-accent transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={`font-semibold text-scholar-deep ${
                      isLast ? 'truncate max-w-[280px] sm:max-w-md' : ''
                    }`}
                    aria-current={isLast ? 'page' : undefined}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
