import { supabase } from '../lib/supabaseClient'

export interface Note {
  id: string
  title: string
  content: string
  created_by: string
  created_at: string
  updated_at: string
}

export async function listNotes(userId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('created_by', userId)
    .order('updated_at', { ascending: false })
  if (error) throw error
  return data as Note[]
}

export async function createNote(
  title: string,
  content: string,
  userId: string,
): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .insert({ title, content, created_by: userId })
    .select()
    .single()
  if (error) throw error
  return data as Note
}

export async function updateNote(
  id: string,
  title: string,
  content: string,
): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Note
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) throw error
}
