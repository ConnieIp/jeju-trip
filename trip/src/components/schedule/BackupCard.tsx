function BackupCard() {
  return (
    <div className="p-5 bg-card border border-border rounded-card flex flex-col gap-[7px]">
      <small className="text-[10px] text-muted tracking-wide">NEARBY BACKUP</small>
      <div className="flex items-center gap-1.5">
        <b className="text-[15px] text-teal font-bold">Bunker de Lumières</b>
        <svg className="w-[13px] h-[13px] text-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
      <p className="text-[11px] text-muted-light m-0">
        Immersive art · 12 min from Seongsan
      </p>
    </div>
  )
}

export default BackupCard
