interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
}

function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <div className="flex items-center gap-3 bg-card border border-border rounded-[14px] h-[54px] px-[18px]">
      <svg className="w-[19px] h-[19px] text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search a place, neighborhood, or craving..."
        className="flex-1 border-none outline-none text-[14px] bg-transparent text-ink-light placeholder:text-muted-light"
      />
      <kbd className="px-[9px] py-[5px] bg-bg rounded-[8px] text-[10px] text-muted">{`⌘K`}</kbd>
    </div>
  )
}

export default SearchBox
