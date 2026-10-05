import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readdirSync, readFileSync, statSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing env vars. Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)
const BUCKET = 'photos'
const PHOTOS_DIR = resolve(__dirname, '../../docs/photos')
const FORCE = process.argv.includes('--force')

const CATEGORIES = ['attraction', 'restaurant', 'cafe', 'bakery', 'souvenir', 'accommodation']

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === BUCKET)

  if (!exists) {
    console.log(`Creating bucket "${BUCKET}"...`)
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (error) {
      console.error('Failed to create bucket:', error)
      process.exit(1)
    }
    console.log('Bucket created (public).')
  } else {
    console.log(`Bucket "${BUCKET}" already exists.`)
  }
}

async function getExistingFiles(): Promise<Set<string>> {
  const files = new Set<string>()
  for (const category of CATEGORIES) {
    const { data, error } = await supabase.storage.from(BUCKET).list(category, { limit: 1000 })
    if (error) {
      console.warn(`Warning: could not list ${category}/:`, error.message)
      continue
    }
    if (data) {
      for (const file of data) {
        files.add(`${category}/${file.name}`)
      }
    }
  }
  return files
}

function collectLocalFiles(): { localPath: string; storagePath: string }[] {
  const result: { localPath: string; storagePath: string }[] = []

  for (const category of CATEGORIES) {
    const categoryDir = resolve(PHOTOS_DIR, category)
    try {
      const entries = readdirSync(categoryDir)
      for (const entry of entries) {
        const fullPath = resolve(categoryDir, entry)
        const stat = statSync(fullPath)
        if (!stat.isFile() || !entry.endsWith('.jpg')) continue
        result.push({
          localPath: fullPath,
          storagePath: `${category}/${entry}`,
        })
      }
    } catch {
      console.warn(`Warning: could not read ${categoryDir}`)
    }
  }

  return result
}

async function uploadFile(localPath: string, storagePath: string): Promise<boolean> {
  const fileBuffer = readFileSync(localPath)
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, fileBuffer, {
    contentType: 'image/jpeg',
    upsert: FORCE,
  })

  if (error) {
    if (!FORCE && error.message.includes('already exists')) {
      return false
    }
    console.error(`  Failed: ${storagePath} — ${error.message}`)
    return false
  }
  return true
}

async function main() {
  console.log('Uploading photos to Supabase Storage...')
  console.log(`  Bucket: ${BUCKET}`)
  console.log(`  Source: ${PHOTOS_DIR}`)
  console.log(`  Force overwrite: ${FORCE}`)
  console.log()

  await ensureBucket()

  const localFiles = collectLocalFiles()
  console.log(`\nFound ${localFiles.length} local photos.`)

  if (localFiles.length === 0) {
    console.log('Nothing to upload.')
    return
  }

  let existing: Set<string>
  if (!FORCE) {
    existing = await getExistingFiles()
    console.log(`Found ${existing.size} photos already in bucket.`)
  } else {
    existing = new Set()
  }

  const toUpload = localFiles.filter(f => FORCE || !existing.has(f.storagePath))
  const skipped = localFiles.length - toUpload.length

  if (skipped > 0) {
    console.log(`Skipping ${skipped} photos (already uploaded).`)
  }

  if (toUpload.length === 0) {
    console.log('\nAll photos already uploaded. Use --force to re-upload.')
    return
  }

  console.log(`\nUploading ${toUpload.length} photos...`)
  let uploaded = 0
  let failed = 0

  for (let i = 0; i < toUpload.length; i++) {
    const file = toUpload[i]
    const ok = await uploadFile(file.localPath, file.storagePath)
    if (ok) {
      uploaded++
      if (uploaded % 10 === 0 || uploaded === toUpload.length) {
        process.stdout.write(`\r  Progress: ${uploaded}/${toUpload.length}`)
      }
    } else {
      failed++
    }
  }

  console.log(`\n\nDone! Uploaded: ${uploaded}, Failed: ${failed}, Skipped: ${skipped}`)

  if (uploaded > 0) {
    const samplePath = toUpload[0].storagePath
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(samplePath)
    console.log(`\nSample public URL:\n  ${data.publicUrl}`)
  }
}

main().catch(err => {
  console.error('Upload failed:', err)
  process.exit(1)
})
