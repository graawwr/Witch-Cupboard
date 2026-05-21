import { toCanvas } from 'html-to-image';
import plantTemplateUrl from '../assets/planttemplate.jpg';

const PARCHMENT_BG = '#ebe3cf';
const EXPORT_WIDTH = 960;
const EXPORT_HEIGHT = Math.round(EXPORT_WIDTH * (1738 / 3201));

let plantTemplateReady;

function preloadPlantTemplate() {
  if (!plantTemplateReady) {
    plantTemplateReady = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = plantTemplateUrl;
    });
  }
  return plantTemplateReady;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

async function waitForImages(root) {
  const imgs = root.querySelectorAll('img');
  await Promise.all(
    [...imgs].map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        }),
    ),
  );
}

async function canvasToPngBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not encode PNG'))),
      'image/png',
      1,
    );
  });
}

async function validatePngBlob(blob) {
  if (!blob || blob.size < 512) {
    throw new Error('Export produced an empty image');
  }
  const header = new Uint8Array(await blob.slice(0, 8).arrayBuffer());
  const isPng =
    header[0] === 0x89
    && header[1] === 0x50
    && header[2] === 0x4e
    && header[3] === 0x47;
  if (!isPng) {
    throw new Error('Export did not produce a valid PNG');
  }
}

async function renderToBlob(node, { skipFonts }) {
  const canvas = await toCanvas(node, {
    backgroundColor: PARCHMENT_BG,
    width: EXPORT_WIDTH,
    height: EXPORT_HEIGHT,
    canvasWidth: EXPORT_WIDTH,
    canvasHeight: EXPORT_HEIGHT,
    pixelRatio: 1,
    skipFonts,
  });
  const blob = await canvasToPngBlob(canvas);
  await validatePngBlob(blob);
  return blob;
}

/**
 * Render a DOM node to a downloadable PNG.
 * Uses the live node at a fixed export size so layout and images stay intact.
 */
export async function exportNodeAsPng(node, filename = 'recipe.png') {
  if (!node) throw new Error('No node to export');

  const host = node.closest('.recipe-export-host');
  host?.classList.add('is-exporting');

  try {
    await document.fonts?.ready;
    await preloadPlantTemplate();
    await waitForImages(node);
    await new Promise((r) => window.setTimeout(r, 150));

    let blob;
    try {
      blob = await renderToBlob(node, { skipFonts: false });
    } catch {
      blob = await renderToBlob(node, { skipFonts: true });
    }

    downloadBlob(blob, filename);
    return blob;
  } finally {
    host?.classList.remove('is-exporting');
  }
}
