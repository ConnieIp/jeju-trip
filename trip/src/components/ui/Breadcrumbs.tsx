import { Link } from 'react-router-dom'

interface BreadcrumbsProps {
  items: { label: string; to?: string }[]
}

function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="flex gap-3 text-[11px] text-muted mb-6 items-center">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-3">
          {idx > 0 && <span>/</span>}
          {item.to ? (
            <Link to={item.to} className="text-teal font-semibold hover:underline no-underline">
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
