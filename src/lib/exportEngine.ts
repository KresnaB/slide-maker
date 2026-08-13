import { toPng, toJpeg, toSvg } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ExportFormat } from '@/types';

export interface ExportOptions {
  quality?: number;
  pixelRatio?: number;
}

export async function exportSlideElementToDataUrl(
  element: HTMLElement,
  format: ExportFormat,
  options: ExportOptions = {}
): Promise<string> {
  const { quality = 0.95, pixelRatio = 2 } = options;

  const base = {
    quality,
    cacheBust: true,
    pixelRatio,
  };

  switch (format) {
    case 'svg':
      return await toSvg(element, { ...base, pixelRatio: undefined });
    case 'jpeg':
      return await toJpeg(element, base);
    case 'png':
    default:
      return await toPng(element, base);
  }
}

export async function exportSingleSlide(
  element: HTMLElement,
  filename: string,
  format: ExportFormat,
  pixelRatio = 2
) {
  const dataUrl = await exportSlideElementToDataUrl(element, format, { pixelRatio });
  const link = document.createElement('a');
  link.download = `${filename}.${format === 'jpeg' ? 'jpg' : format}`;
  link.href = dataUrl;
  link.click();
}

export interface SlideExportItem {
  element: HTMLElement;
  filename: string;
}

export interface BatchExportOptions {
  zipName?: string;
  pixelRatio?: number;
  onProgress?: (current: number, total: number) => void;
}

export async function exportAllSlidesToZip(
  slideElements: SlideExportItem[],
  format: ExportFormat,
  options: BatchExportOptions = {}
) {
  const { zipName = 'slideshow-konten.zip', pixelRatio = 2, onProgress } = options;
  const zip = new JSZip();
  const folder = zip.folder('slides') || zip;

  const total = slideElements.length;

  for (let i = 0; i < total; i++) {
    const { element, filename } = slideElements[i];
    if (onProgress) onProgress(i + 1, total);

    const dataUrl = await exportSlideElementToDataUrl(element, format, { pixelRatio });

    // Convert dataUrl to blob/arrayBuffer for JSZip
    const base64Data = dataUrl.split(',')[1];
    const fileExt = format === 'jpeg' ? 'jpg' : format;
    const cleanFilename = `${filename || `slide-${i + 1}`}.${fileExt}`;

    folder.file(cleanFilename, base64Data, { base64: true });
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, zipName);
}
