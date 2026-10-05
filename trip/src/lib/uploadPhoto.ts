import { supabase } from './supabaseClient'

const BUCKET = 'photos'

export async function uploadPhoto(file: File, category: string): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `${category}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    })

  if (error) throw error
  return filename
}

export async function deletePhoto(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}
