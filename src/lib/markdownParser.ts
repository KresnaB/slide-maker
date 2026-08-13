import { marked } from 'marked';
import {
  SlideData,
  SlideElement,
  TextElement,
  ImageElement,
  ShapeElement,
} from '@/types';
import { PASTEL_BG_COLORS, NEO_DARK } from '@/lib/presets';

export function parseMarkdownToSlides(markdownText: string): SlideData[] {
  if (!markdownText || !markdownText.trim()) {
    return [];
  }

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

    let currentY = 15; // starting Y percentage

    // Dekorasi sudut khas konten Kawan TOEFL (hanya slide pertama / cover)
    if (slideIndex === 0) {
      const decos: ShapeElement[] = [
        {
          id: `elem-deco-1-${slideIndex}`,
          type: 'shape',
          shapeType: 'square',
          x: 5,
          y: 4,
          width: 150,
          height: 150,
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
          x: 83,
          y: 4,
          width: 150,
          height: 150,
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
          x: 5,
          y: 82,
          width: 150,
          height: 150,
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
          x: 83,
          y: 82,
          width: 150,
          height: 150,
          fillColor: '#DDA0DD',
          strokeColor: NEO_DARK,
          strokeWidth: 6,
          rotation: -8,
          zIndex: 1,
        },
      ];
      elements.push(...decos);
    }

    tokens.forEach((token, tokenIdx) => {
      if (token.type === 'heading') {
        const textContent = cleanInlineMarkdown(token.text);
        if (token.depth === 1) {
          title = textContent;
          const isCover = slideIndex === 0;
          const textElem: TextElement = {
            id: `elem-title-${slideIndex}-${tokenIdx}`,
            type: 'text',
            content: textContent,
            x: 50,
            y: isCover ? 42 : currentY,
            fontSize: isCover ? 72 : 60,
            fontWeight: 'bold',
            color: 'inherit',
            textAlign: 'center',
            isHeading: true,
            zIndex: 10,
          };
          elements.push(textElem);
          currentY += isCover ? 24 : 20;
        } else {
          if (!subtitle) subtitle = textContent;
          const textElem: TextElement = {
            id: `elem-subtitle-${slideIndex}-${tokenIdx}`,
            type: 'text',
            content: textContent,
            x: 50,
            y: currentY,
            fontSize: 34,
            fontWeight: '600',
            color: 'inherit',
            textAlign: 'center',
            zIndex: 9,
          };
          elements.push(textElem);
          currentY += 15;
        }
      } else if (token.type === 'paragraph') {
        // Check if paragraph contains image
        const imgMatch = token.text.match(/!\[(.*?)\]\((.*?)\)/);
        if (imgMatch) {
          const alt = imgMatch[1];
          const src = imgMatch[2];
          const imgElem: ImageElement = {
            id: `elem-img-${slideIndex}-${tokenIdx}`,
            type: 'image',
            src: src,
            alt: alt,
            x: 50,
            y: currentY + 15,
            width: 300,
            height: 300,
            zIndex: 5,
          };
          elements.push(imgElem);
          currentY += 35;
        } else {
          const textContent = cleanInlineMarkdown(token.text);
          const textElem: TextElement = {
            id: `elem-text-${slideIndex}-${tokenIdx}`,
            type: 'text',
            content: textContent,
            x: 50,
            y: currentY,
            fontSize: 28,
            fontWeight: 'normal',
            color: 'inherit',
            textAlign: 'center',
            zIndex: 8,
          };
          elements.push(textElem);
          currentY += 13;
        }
      } else if (token.type === 'list') {
        const listItems = token.items.map((item: { text: string }) =>
          cleanInlineMarkdown(item.text)
        );
        bullets.push(...listItems);

        const listContent = listItems.map((item: string) => `• ${item}`).join('\n');
        const textElem: TextElement = {
          id: `elem-list-${slideIndex}-${tokenIdx}`,
          type: 'text',
          content: listContent,
          x: 50,
          y: currentY,
          fontSize: 26,
          fontWeight: '500',
          color: 'inherit',
          textAlign: 'left',
          zIndex: 8,
        };
        elements.push(textElem);
        currentY += Math.max(16, listItems.length * 7);
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
