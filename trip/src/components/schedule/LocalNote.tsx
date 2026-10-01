function LocalNote() {
  return (
    <div className="p-5 bg-amber-light rounded-card text-[12px]">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-[14px] h-[14px] text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        <b className="text-[13px] font-bold">Local rhythm</b>
      </div>
      <p className="text-ink-light text-[12px] leading-[1.55] m-0">
        October is peak autumn in Jeju — clear skies, mild temperatures, and the famous pampas grass swaying on the hills.
      </p>
    </div>
  )
}

export default LocalNote
