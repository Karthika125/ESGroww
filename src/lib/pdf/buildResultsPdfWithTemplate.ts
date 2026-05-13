import { toCanvas } from "html-to-image";
import { PDFDocument } from "pdf-lib";

/** Tried in order; place your branded A4 PDF under `public/pdf_template/`. */
const TEMPLATE_URL_CANDIDATES = [
  "/pdf_template/template.pdf",
  "/pdf_template/report.pdf",
  "/pdf_template/esg-report-template.pdf",
];

/** Content inset in PDF points (space reserved for template header/footer/frames). */
const CONTENT_INSETS_PT = { left: 36, right: 36, top: 108, bottom: 48 };

function sliceCanvas(source: HTMLCanvasElement, srcY: number, srcH: number): HTMLCanvasElement {
  const w = source.width;
  const h = Math.max(1, Math.round(srcH));
  const slice = document.createElement("canvas");
  slice.width = w;
  slice.height = h;
  const ctx = slice.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");
  ctx.drawImage(source, 0, Math.round(srcY), w, h, 0, 0, w, h);
  return slice;
}

async function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob failed"));
          return;
        }
        void blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)));
      },
      "image/png",
      1.0
    );
  });
}

async function fetchTemplateBytes(): Promise<Uint8Array | null> {
  for (const url of TEMPLATE_URL_CANDIDATES) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return new Uint8Array(await res.arrayBuffer());
    } catch {
      /* try next */
    }
  }
  return null;
}

/**
 * Renders `captureRoot` to PNG slices scaled to fit the template content width,
 * repeats the template first page behind each slice so nothing is cropped mid-widget;
 * uses multiple A4-sized pages when the dashboard is taller than one frame.
 */
export async function buildResultsPdfWithTemplate(captureRoot: HTMLElement): Promise<Uint8Array> {
  /** Rasterize via SVG+canvas so modern CSS colors (oklch/lab) work; html2canvas cannot parse them. */
  const pixelRatio = Math.min(2, Math.max(1, 1680 / Math.max(captureRoot.scrollWidth, 1)));

  const canvas = await toCanvas(captureRoot, {
    pixelRatio,
    backgroundColor: "#f8fafc",
    width: captureRoot.scrollWidth,
    height: captureRoot.scrollHeight,
    filter: (node) => {
      if (!(node instanceof HTMLElement)) return true;
      return !node.hasAttribute("data-html2canvas-ignore");
    },
    style: {
      overflow: "visible",
      maxHeight: "none",
      height: "auto",
    },
  });

  const imgW = canvas.width;
  const imgH = canvas.height;
  if (imgW < 2 || imgH < 2) {
    throw new Error("Could not capture the report area (empty canvas).");
  }

  const templateBytes = await fetchTemplateBytes();
  let templateDoc: PDFDocument | null = null;
  if (templateBytes) {
    try {
      templateDoc = await PDFDocument.load(templateBytes, { ignoreEncryption: true });
    } catch {
      templateDoc = null;
    }
  }

  const outPdf = await PDFDocument.create();
  const tplPage0 = templateDoc?.getPage(0);
  const pageW = tplPage0?.getWidth() ?? 595.28;
  const pageH = tplPage0?.getHeight() ?? 841.89;

  const contentX = CONTENT_INSETS_PT.left;
  const contentW = pageW - CONTENT_INSETS_PT.left - CONTENT_INSETS_PT.right;
  const contentH = pageH - CONTENT_INSETS_PT.top - CONTENT_INSETS_PT.bottom;

  const pxToPt = contentW / imgW;
  const slicePx = contentH / pxToPt;

  let yPx = 0;
  while (yPx < imgH - 0.5) {
    const hPx = Math.min(slicePx, imgH - yPx);
    const slice = sliceCanvas(canvas, yPx, hPx);
    const pngBytes = await canvasToPngBytes(slice);
    const embedded = await outPdf.embedPng(pngBytes);

    if (templateDoc) {
      const [copied] = await outPdf.copyPages(templateDoc, [0]);
      outPdf.addPage(copied);
    } else {
      outPdf.addPage([pageW, pageH]);
    }

    const page = outPdf.getPage(outPdf.getPageCount() - 1);
    const drawW = contentW;
    const drawH = hPx * pxToPt;
    const topFromBottom = pageH - CONTENT_INSETS_PT.top;
    page.drawImage(embedded, {
      x: contentX,
      y: topFromBottom - drawH,
      width: drawW,
      height: drawH,
    });

    yPx += hPx;
  }

  return outPdf.save();
}

export function triggerPdfDownload(bytes: Uint8Array, fileName: string) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
