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
          className={`px-3 py-[7px] border rounded-pill text-[12px] font-semibold cursor-pointer transition-colors ${
            active === filter
              ? 'bg-teal-dark text-white border-teal-dark'
              : 'bg-bg text-muted border-border hover:border-ink/30'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

export default FilterBar
