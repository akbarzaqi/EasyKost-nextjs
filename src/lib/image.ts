const STORAGE_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '')

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null

  if (path.startsWith('storage/')) {
    return `${STORAGE_BASE_URL}/${path}`
  }

  if (/^https?:\/\/(localhost|127\.0\.0\.1)/.test(path)) {
    return path.replace(/^https?:\/\/[^\/]+/, STORAGE_BASE_URL)
  }

  return path
}
