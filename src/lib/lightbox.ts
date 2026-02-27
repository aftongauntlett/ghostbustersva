export function ensureElementId(element: HTMLElement, prefix: string): string {
  if (!element.id) {
    element.id = `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }
  return element.id;
}

export function setLightboxPreviousFocus(
  lightbox: HTMLElement,
  opener: HTMLElement,
  prefix: string,
): void {
  lightbox.dataset.previousFocus = ensureElementId(opener, prefix);
}
