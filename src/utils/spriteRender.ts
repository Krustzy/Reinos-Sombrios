const FRAME_SIZE = 16;
const COLS = 12;
const SHEET_URL = `${import.meta.env.BASE_URL}assets/sprites/tiny-dungeon.png`;

let sheetPromise: Promise<HTMLImageElement> | null = null;

function loadSheet(): Promise<HTMLImageElement> {
  if (!sheetPromise) {
    sheetPromise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = SHEET_URL;
    });
  }
  return sheetPromise;
}

const cache = new Map<string, string>();

/** Renders a single 16x16 sprite frame (optionally tinted) from the shared tileset as a data URL, for use in <img> tags in DOM UI. */
export async function getFrameDataUrl(frame: number, tint = 0xffffff): Promise<string> {
  const key = `${frame}-${tint}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const img = await loadSheet();
  const col = frame % COLS;
  const row = Math.floor(frame / COLS);
  const sx = col * FRAME_SIZE;
  const sy = row * FRAME_SIZE;

  const canvas = document.createElement('canvas');
  canvas.width = FRAME_SIZE;
  canvas.height = FRAME_SIZE;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, sx, sy, FRAME_SIZE, FRAME_SIZE, 0, 0, FRAME_SIZE, FRAME_SIZE);

  if (tint !== 0xffffff) {
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = `#${tint.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, FRAME_SIZE, FRAME_SIZE);
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(img, sx, sy, FRAME_SIZE, FRAME_SIZE, 0, 0, FRAME_SIZE, FRAME_SIZE);
  }

  const url = canvas.toDataURL();
  cache.set(key, url);
  return url;
}

/** Sets an <img>'s src once the tinted frame is ready, without blocking the caller. */
export function applyFrameToImg(imgEl: HTMLImageElement, frame: number, tint = 0xffffff): void {
  getFrameDataUrl(frame, tint).then((url) => {
    imgEl.src = url;
  });
}
