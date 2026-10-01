interface FilterBarProps {
  filters: string[]
  active: string
  onChange: (filter: string) => void
}

function FilterBar({ filters, active, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-2 flex-wrap mt-3">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`px-3.5 py-1.5 border rounded-pill text-[13px] cursor-pointer transition-colors ${
            active === filter
              ? 'bg-ink text-white border-ink'
              : 'bg-card text-ink border-border hover:border-ink/30'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

export default FilterBar
