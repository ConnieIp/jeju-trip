import type { Note } from '../../data/notesStore'

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (note: Note) => void
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g

function renderContentWithLinks(content: string) {
  const parts = content.split(URL_REGEX)
  return parts.map((part, i) => {
    if (URL_REGEX.test(part)) {
      URL_REGEX.lastIndex = 0
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-mid underline decoration-teal-mid/40 hover:decoration-teal-mid transition-colors"
        >
          {part}
        </a>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <div className="bg-card border border-border rounded-card p-5 shadow-[0_8px_24px_#15323a14] flex flex-col gap-3 hover:border-ink/20 transition-colors">
      <div className="flex justify-between items-start gap-3">
        <h3 className="text-[16px] font-bold text-ink leading-[1.3] m-0">
          {note.title}
        </h3>
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={() => onEdit(note)}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-border bg-card text-muted text-[12px] cursor-pointer hover:border-ink/30 hover:text-ink transition-colors"
            title="Edit"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(note)}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-border bg-card text-muted text-[12px] cursor-pointer hover:border-red-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
      <p className="text-[13px] text-ink-light leading-[1.6] m-0 whitespace-pre-wrap break-words">
        {renderContentWithLinks(note.content)}
      </p>
      <div className="text-[11px] text-muted-light mt-auto pt-1">
        {formatDate(note.updated_at)}
      </div>
    </div>
  )
}

export default NoteCard
