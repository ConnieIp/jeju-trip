const base = import.meta.env.BASE_URL.replace(/\/$/, '')

export function photoUrl(path: string): string {
  if (!path) return ''
  return `${base}${path}`
}
