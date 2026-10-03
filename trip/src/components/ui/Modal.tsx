import type { ReactNode } from 'react'

interface ModalProps {
  title: string
  children: ReactNode
  onClose: () => void
}

function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/30" />
      <div
        className="relative bg-card border border-border rounded-card p-6 w-[min(520px,calc(100%-28px))] max-h-[calc(100vh-56px)] overflow-y-auto shadow-[0_8px_24px_#15323a14]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[18px] font-bold text-ink m-0">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-border bg-card text-muted text-[16px] cursor-pointer hover:border-ink/30 transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
