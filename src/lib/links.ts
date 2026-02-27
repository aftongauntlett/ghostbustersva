const SAFE_PROTOCOLS = new Set(["https:", "http:"]);

export function isSafeExternalUrl(url: string | undefined | null): url is string {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return SAFE_PROTOCOLS.has(parsed.protocol);
  } catch {
    return false;
  }
}
