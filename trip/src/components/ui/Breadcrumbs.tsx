import { Link } from 'react-router-dom'

interface BreadcrumbsProps {
  items: { label: string; to?: string }[]
}

function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="flex gap-2 text-[13px] text-muted mb-4">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-2">
          {idx > 0 && <span>/</span>}
          {item.to ? (
            <Link to={item.to} className="text-muted hover:text-ink no-underline">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}

export default Breadcrumbs
