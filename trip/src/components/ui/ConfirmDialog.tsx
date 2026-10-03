interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onCancel}>
      <div className="absolute inset-0 bg-ink/30" />
      <div
        className="relative bg-card border border-border rounded-card p-6 w-[min(420px,calc(100%-28px))] shadow-[0_8px_24px_#15323a14]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[18px] font-bold text-ink mb-2">{title}</h3>
        <p className="text-[13px] text-muted leading-[1.55] mb-5">{message}</p>
        <div className="flex gap-2.5 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 bg-card text-muted border border-border rounded-[13px] text-[12px] font-semibold cursor-pointer hover:border-ink/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 bg-red-600 text-white border-none rounded-[13px] text-[12px] font-semibold cursor-pointer hover:opacity-90 transition-opacity"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
