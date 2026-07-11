import Link from 'next/link'
import { Home, ChevronRight } from 'lucide-react'

export interface Crumb {
  label: string
  href?: string
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <div className="bg-bg-alt border-b border-gray-100">
      <nav aria-label="Breadcrumb" className="max-w-[1200px] mx-auto px-4 py-3.5">
        <ol className="flex items-center flex-wrap gap-1.5 text-sm">
          <li>
            <Link
              href="/"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white text-primary shadow-sm hover:bg-primary hover:text-white transition-colors"
              aria-label="Início"
            >
              <Home className="w-4 h-4" />
            </Link>
          </li>
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            return (
              <li key={i} className="flex items-center gap-1.5">
                <ChevronRight className="w-4 h-4 text-gray-300" />
                {isLast || !item.href ? (
                  <span className="font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg line-clamp-1 max-w-[60vw] md:max-w-md">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="font-medium text-gray-500 hover:text-primary px-2 py-1.5 rounded-lg hover:bg-white transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
