interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
}

function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="flex items-center gap-2.5 p-3 bg-card border border-border rounded-[10px]">
      <svg className="w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search places..."
        className="flex-1 border-none outline-none text-sm bg-transparent"
      />
      <kbd className="px-1.5 py-0.5 bg-bg rounded text-[11px]">⌘K</kbd>
    </div>
  )
}

export default SearchBox
