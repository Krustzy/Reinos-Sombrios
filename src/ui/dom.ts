export function uiRoot(): HTMLElement {
  const el = document.getElementById('ui-root');
  if (!el) throw new Error('#ui-root não encontrado.');
  return el;
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  html?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

export function clearScreens(): void {
  uiRoot().querySelectorAll('.screen, .modal-backdrop').forEach((n) => n.remove());
}
