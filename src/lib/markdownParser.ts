import { marked } from 'marked';
import {
  SlideData,
  SlideElement,
  TextElement,
  ImageElement,
  ShapeElement,
  AspectRatioPreset,
} from '@/types';
import { PASTEL_BG_COLORS, NEO_DARK, ASPECT_RATIOS } from '@/lib/presets';

/**
 * Parser markdown -> slide dengan layout FLOW berbasis font-metrics.
 * Posisi Y dihitung dari estimasi tinggi teks (jumlah baris x line-height),
 * jadi elemen teks TIDAK pernah saling tumpang tindih, apa pun isi kontennya.
 */

// Estimasi lebar teks di Space Grotesk (rata-rata ~0.55em/karakter, over-estimate biar aman)
function estTextWidth(text: string, fontSize: number): number {
  return text.length * fontSize * 0.58;
}

function estLines(text: string, fontSize: number, maxWidth: number): number {
  return Math.max(1, Math.ceil(estTextWidth(text, fontSize) / maxWidth));
}

function estHeight(text: string, fontSize: number, maxWidth: number): number {
  return estLines(text, fontSize, maxWidth) * fontSize * 1.3;
}

// Kecilkan font sampai muat di lebar konten (auto-fit)
function fitFontSize(text: string, startSize: number, minSize: number, maxWidth: number): number {
  let size = startSize;
  while (size > minSize && estTextWidth(text, size) > maxWidth) {
    size -= 2;
  }
  return size;
}

export function parseMarkdownToSlides(
  markdownText: string,
  aspectRatio: AspectRatioPreset = ASPECT_RATIOS[0]
): SlideData[] {
  if (!markdownText || !markdownText.trim()) {
    return [];
  }

  const W = aspectRatio.width;
  const H = aspectRatio.height;
  const MARGIN = Math.round(W * 0.08); // margin kiri-kanan konten
  const contentW = W - MARGIN * 2;

  // Split by horizontal line delimiter `---`
  const rawSections = markdownText
    .split(/\n\s*---\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (rawSections.length === 0) {
    return [];
  }

  return rawSections.map((section, slideIndex) => {
    const slideId = `slide-${slideIndex + 1}-${Date.now()}`;
    const tokens = marked.lexer(section);

    const elements: SlideElement[] = [];
    let title = '';
    let subtitle = '';
    const bullets: string[] = [];

    // Posisi vertikal flow dalam px desain; cover mulai lebih ke tengah
    let currentYPx = slideIndex === 0 ? Math.round(H * 0.34) : Math.round(H * 0.13);

    // Dekorasi sudut khas konten Kawan TOEFL (hanya slide pertama / cover)
    if (slideIndex === 0) {
      const decoSize = Math.round(W * 0.14);
      const decoMarginPx = Math.round(W * 0.03);
      // x/y adalah persen: ubah margin px -> persen
      const decoX = Math.round((decoMarginPx / W) * 100);
      const decoWidthPct = Math.round((decoSize / W) * 100);
      // Posisi vertikal bawah dihitung agar deco selalu di dalam canvas (rasio apa pun)
      const decoYBottom =
        Math.round(((H - decoSize - decoMarginPx) / H) * 1000) / 10;
      const decos: ShapeElement[] = [
        {
          id: `elem-deco-1-${slideIndex}`,
          type: 'shape',
          shapeType: 'square',
          x: decoX,
          y: decoX,
          width: decoSize,
          height: decoSize,
          fillColor: '#FFD93D',
          strokeColor: NEO_DARK,
          strokeWidth: 6,
          rotation: -12,
          zIndex: 1,
        },
        {
          id: `elem-deco-2-${slideIndex}`,
          type: 'shape',
          shapeType: 'circle',
          x: 100 - decoX - decoWidthPct,
          y: decoX,
          width: decoSize,
          height: decoSize,
          fillColor: '#87CEEB',
          strokeColor: NEO_DARK,
          strokeWidth: 6,
          rotation: 10,
          zIndex: 1,
        },
        {
          id: `elem-deco-3-${slideIndex}`,
          type: 'shape',
          shapeType: 'circle',
          x: decoX,
          y: decoYBottom,
          width: decoSize,
          height: decoSize,
          fillColor: '#A8E6CF',
          strokeColor: NEO_DARK,
          strokeWidth: 6,
          rotation: 14,
          zIndex: 1,
        },
        {
          id: `elem-deco-4-${slideIndex}`,
          type: 'shape',
          shapeType: 'square',
          x: 100 - decoX - decoWidthPct,
          y: decoYBottom,
          width: decoSize,
          height: decoSize,
          fillColor: '#DDA0DD',
          strokeColor: NEO_DARK,
          strokeWidth: 6,
          rotation: -8,
          zIndex: 1,
        },
      ];
      elements.push(...decos);
    }

    const pushText = (
      content: string,
      fontSize: number,
      fontWeight: string | number,
      textAlign: 'left' | 'center' | 'right',
      isHeading: boolean,
      gapAfter: number
    ) => {
      const yPx = currentYPx;
      const heightPx = estHeight(content, fontSize, contentW);
      // Posisi x dihitung agar box selebar contentW benar-benar berada di tengah
      // (sistem koordinat tetap top-left anchor biar drag konsisten)
      const centeredX = Math.round((50 - (contentW / 2 / W) * 100) * 10) / 10;
      const textElem: TextElement = {
        id: `elem-${elements.length}-${slideIndex}-${tokenCounter++}`,
        type: 'text',
        content,
        x: centeredX,
        y: Math.round((yPx / H) * 1000) / 10,
        width: contentW,
        fontSize,
        fontWeight,
        color: 'inherit',
        textAlign,
        isHeading,
        zIndex: 10,
      };
      elements.push(textElem);
      currentYPx = yPx + heightPx + gapAfter;
    };

    let tokenCounter = 0;

    tokens.forEach((token, tokenIdx) => {
      if (token.type === 'heading') {
        const textContent = cleanInlineMarkdown(token.text);
        if (token.depth === 1) {
          title = textContent;
          const isCover = slideIndex === 0;
          const fontSize = fitFontSize(textContent, isCover ? 72 : 60, 40, contentW);
          pushText(textContent, fontSize, 'bold', 'center', true, isCover ? 26 : 22);
        } else {
          if (!subtitle) subtitle = textContent;
          const fontSize = fitFontSize(textContent, 32, 24, contentW);
          pushText(textContent, fontSize, '600', 'center', false, 18);
        }
      } else if (token.type === 'paragraph') {
        const imgMatch = token.text.match(/!\[(.*?)\]\((.*?)\)/);
        if (imgMatch) {
          const alt = imgMatch[1];
          const src = imgMatch[2];
          const imgW = Math.min(420, contentW);
          const centeredX = Math.round((50 - (imgW / 2 / W) * 100) * 10) / 10;
          const imgElem: ImageElement = {
            id: `elem-img-${slideIndex}-${tokenIdx}`,
            type: 'image',
            src,
            alt,
            x: centeredX,
            y: Math.round((currentYPx / H) * 1000) / 10,
            width: imgW,
            height: imgW,
            zIndex: 5,
          };
          elements.push(imgElem);
          currentYPx += imgW + 24;
        } else {
          const textContent = cleanInlineMarkdown(token.text);
          const fontSize = fitFontSize(textContent, 27, 20, contentW);
          pushText(textContent, fontSize, 'normal', 'center', false, 16);
        }
      } else if (token.type === 'list') {
        const listItems: string[] = token.items.map((item: { text: string }) =>
          cleanInlineMarkdown(item.text)
        );
        bullets.push(...listItems);

        // Font list disesuaikan dengan item terpanjang
        const longest = listItems.reduce((a, b) => (a.length > b.length ? a : b), '');
        const fontSize = fitFontSize(longest, 26, 18, contentW);

        const listContent = listItems.map((item: string) => `• ${item}`).join('\n');
        const listHeight = listItems.reduce(
          (acc, item) => acc + estHeight(`• ${item}`, fontSize, contentW),
          0
        );
        const yPx = currentYPx;
        const centeredX = Math.round((50 - (contentW / 2 / W) * 100) * 10) / 10;
        const textElem: TextElement = {
          id: `elem-list-${slideIndex}-${tokenIdx}`,
          type: 'text',
          content: listContent,
          x: centeredX,
          y: Math.round((yPx / H) * 1000) / 10,
          width: contentW,
          fontSize,
          fontWeight: '500',
          color: 'inherit',
          textAlign: 'left',
          zIndex: 9,
        };
        elements.push(textElem);
        currentYPx = yPx + listHeight + 18;
      }
    });

    return {
      id: slideId,
      title: title || `Slide ${slideIndex + 1}`,
      subtitle,
      bullets,
      elements,
      bgColor: PASTEL_BG_COLORS[slideIndex % PASTEL_BG_COLORS.length],
    };
  });
}

function cleanInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/`(.*?)`/g, '$1') // Inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/!\[(.*?)\]\(.*?\)/g, '$1'); // Images
}
