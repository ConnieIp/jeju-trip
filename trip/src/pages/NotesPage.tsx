import { useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from '../auth/AuthContext'
import NoteCard from '../components/ui/NoteCard'
import NoteForm from '../components/ui/NoteForm'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { listNotes, createNote, updateNote, deleteNote, type Note } from '../data/notesStore'

function NotesPage() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [deletingNote, setDeletingNote] = useState<Note | null>(null)

  const loadNotes = useCallback(async () => {
    if (!user) return
    try {
      const data = await listNotes()
      setNotes(data)
    } catch (err) {
      console.error('Failed to load notes:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadNotes()
    } else {
      setLoading(false)
    }
  }, [user, loadNotes])

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes
    const q = search.toLowerCase()
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q),
    )
  }, [notes, search])

  const handleSave = async (title: string, content: string) => {
    if (!user) return
    try {
      if (editingNote) {
        const updated = await updateNote(editingNote.id, title, content)
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
      } else {
        const created = await createNote(title, content, user.id)
        setNotes((prev) => [created, ...prev])
      }
      setShowForm(false)
      setEditingNote(null)
    } catch (err) {
      console.error('Failed to save note:', err)
    }
  }

  const handleDelete = async () => {
    if (!deletingNote) return
    try {
      await deleteNote(deletingNote.id)
      setNotes((prev) => prev.filter((n) => n.id !== deletingNote.id))
      setDeletingNote(null)
    } catch (err) {
      console.error('Failed to delete note:', err)
    }
  }

  const openEdit = (note: Note) => {
    setEditingNote(note)
    setShowForm(true)
  }

  const openCreate = () => {
    setEditingNote(null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingNote(null)
  }

  if (!user) {
    return (
      <div className="mx-auto w-[min(1310px,100%-80px)] max-[980px]:w-[min(100%-36px,760px)] max-[640px]:w-[calc(100%-28px)]">
        <div className="px-8 pt-12 pb-[34px] max-[980px]:px-[18px] max-[640px]:px-[14px] max-[640px]:pt-[30px]">
          <div className="flex items-center gap-2 text-amber text-[12px] font-bold uppercase mb-3">
            <span className="w-[7px] h-[7px] bg-amber rounded-full inline-block" />
            ISLAND NOTES
          </div>
          <h1 className="text-[46px] font-extrabold tracking-[-1.5px] leading-[1.08] mb-3.5 max-[640px]:text-[34px]">
            Your travel notebook.
          </h1>
          <p className="text-muted text-[15px] leading-[1.55] max-w-[580px] mt-3.5">
            Sign in to create and manage your personal notes for the trip.
          </p>
          <div className="mt-10 bg-card border border-border rounded-card p-8 text-center shadow-[0_8px_24px_#15323a14] max-w-[480px]">
            <p className="text-[14px] text-muted leading-[1.6]">
              Please sign in using the button in the top-right corner to access your notes.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-[min(1310px,100%-80px)] max-[980px]:w-[min(100%-36px,760px)] max-[640px]:w-[calc(100%-28px)]">
      <div className="px-8 pt-12 pb-[34px] max-[980px]:px-[18px] max-[640px]:px-[14px] max-[640px]:pt-[30px]">
        <div className="flex justify-between items-end gap-10 mb-6 max-[640px]:flex-col max-[640px]:items-start">
          <div>
            <div className="flex items-center gap-2 text-amber text-[12px] font-bold uppercase mb-3">
              <span className="w-[7px] h-[7px] bg-amber rounded-full inline-block" />
              ISLAND NOTES
            </div>
            <h1 className="text-[46px] font-extrabold tracking-[-1.5px] leading-[1.08] mb-3.5 max-w-[650px] max-[640px]:text-[34px]">
              Your travel notebook.
            </h1>
            <p className="text-muted text-[15px] leading-[1.55] max-w-[580px] mt-3.5">
              Jot down tips, links, and reminders for your Jeju trip.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-3 bg-teal-dark text-white rounded-[13px] text-[13px] font-semibold border-none cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New note
          </button>
        </div>
      </div>

      <div className="px-8 pb-[72px] max-[980px]:px-[18px] max-[640px]:px-[14px]">
        <div className="mb-5">
          <div className="relative w-full max-w-[400px]">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-[14px] text-[14px] text-ink placeholder:text-muted-light focus:outline-none focus:border-teal-mid transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-[13px] text-muted">Loading notes...</p>
        ) : filteredNotes.length === 0 ? (
          <div className="bg-card border border-border rounded-card p-10 text-center shadow-[0_8px_24px_#15323a14]">
            <p className="text-[14px] text-muted m-0">
              {search ? 'No notes match your search.' : 'No notes yet. Create your first note!'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-[18px] text-[13px]">
              <span className="text-muted text-[12px]">
                <b className="text-ink">{filteredNotes.length}</b> {filteredNotes.length === 1 ? 'note' : 'notes'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-[24px_18px] max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isOwner={note.created_by === user.id}
                  onEdit={openEdit}
                  onDelete={setDeletingNote}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showForm && (
        <NoteForm
          note={editingNote}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {deletingNote && (
        <ConfirmDialog
          title="Delete note"
          message={`Are you sure you want to delete "${deletingNote.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingNote(null)}
        />
      )}
    </div>
  )
}

export default NotesPage
