import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { setBreadcrumbStructuredData } from '../lib/seo.js';

export default function Breadcrumbs({ items = [], className = '' }) {
  const key = items.map((item) => `${item.name}:${item.path}`).join('|');

  useEffect(() => {
    if (items.length) setBreadcrumbStructuredData(items);
  }, [key]);

  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={`text-sm text-stone-500 ${className}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {isLast ? (
                <span className="font-semibold text-stone-700" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link to={item.path} className="transition hover:text-amber-700">
                    {item.name}
                  </Link>
                  <ChevronRight size={14} className="text-stone-400" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
