const STORAGE_BASE_URL = import.meta.env.VITE_STORAGE_URL as string | undefined

export function resolveAssetUrl(url?: string | null) {
  if (!url) return ''

  if (STORAGE_BASE_URL) {
    try {
      const parsed = new URL(url)
      return new URL(parsed.pathname, ensureTrailingSlash(STORAGE_BASE_URL)).toString()
    } catch {
      return new URL(url.replace(/^\/+/, ''), ensureTrailingSlash(STORAGE_BASE_URL)).toString()
    }
  }

  try {
    const parsed = new URL(url)

    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      parsed.hostname = window.location.hostname
      return parsed.toString()
    }

    return parsed.toString()
  } catch {
    return url
  }
}

function ensureTrailingSlash(value: string) {
  return value.endsWith('/') ? value : `${value}/`
}
