import { useState, useEffect } from 'react'
import Modal from './Modal'
import type { Note } from '../../data/notesStore'

interface NoteFormProps {
  note?: Note | null
  onSave: (title: string, content: string) => void
  onClose: () => void
}

function NoteForm({ note, onSave, onClose }: NoteFormProps) {
  const [title, setTitle] = useState(note?.title ?? '')
  const [content, setContent] = useState(note?.content ?? '')

  useEffect(() => {
    setTitle(note?.title ?? '')
    setContent(note?.content ?? '')
  }, [note])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    onSave(title.trim(), content.trim())
  }

  return (
    <Modal title={note ? 'Edit note' : 'New note'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-muted uppercase tracking-wide">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your note a title"
            className="px-4 py-3 bg-bg border border-border rounded-[14px] text-[14px] text-ink placeholder:text-muted-light focus:outline-none focus:border-teal-mid transition-colors"
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold text-muted uppercase tracking-wide">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here..."
            rows={6}
            className="px-4 py-3 bg-bg border border-border rounded-[14px] text-[14px] text-ink placeholder:text-muted-light focus:outline-none focus:border-teal-mid transition-colors resize-y min-h-[120px]"
          />
        </div>
        <div className="flex gap-2.5 justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-card text-muted border border-border rounded-[13px] text-[12px] font-semibold cursor-pointer hover:border-ink/30 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || !content.trim()}
            className="px-5 py-2.5 bg-teal-dark text-white border-none rounded-[13px] text-[12px] font-semibold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {note ? 'Save changes' : 'Create note'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default NoteForm
