import { toPng, toJpeg, toSvg } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ExportFormat } from '@/types';

export async function exportSlideElementToDataUrl(
  element: HTMLElement,
  format: ExportFormat,
  quality = 0.95
): Promise<string> {
  const options = {
    quality,
    cacheBust: true,
    pixelRatio: 2, // High resolution rendering for sharp social media graphics
  };

  switch (format) {
    case 'svg':
      return await toSvg(element, options);
    case 'jpeg':
      return await toJpeg(element, options);
    case 'png':
    default:
      return await toPng(element, options);
  }
}

export async function exportSingleSlide(
  element: HTMLElement,
  filename: string,
  format: ExportFormat
) {
  const dataUrl = await exportSlideElementToDataUrl(element, format);
  const link = document.createElement('a');
  link.download = `${filename}.${format === 'jpeg' ? 'jpg' : format}`;
  link.href = dataUrl;
  link.click();
}

export async function exportAllSlidesToZip(
  slideElements: { element: HTMLElement; filename: string }[],
  format: ExportFormat,
  zipName = 'slideshow-konten.zip',
  onProgress?: (current: number, total: number) => void
) {
  const zip = new JSZip();
  const folder = zip.folder('slides') || zip;

  const total = slideElements.length;

  for (let i = 0; i < total; i++) {
    const { element, filename } = slideElements[i];
    if (onProgress) onProgress(i + 1, total);

    const dataUrl = await exportSlideElementToDataUrl(element, format);

    // Convert dataUrl to blob/arrayBuffer for JSZip
    const base64Data = dataUrl.split(',')[1];
    const fileExt = format === 'jpeg' ? 'jpg' : format;
    const cleanFilename = `${filename || `slide-${i + 1}`}.${fileExt}`;

    folder.file(cleanFilename, base64Data, { base64: true });
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, zipName);
}
