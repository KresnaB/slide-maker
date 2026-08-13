import { marked } from 'marked';
import { SlideData, SlideElement, TextElement, ImageElement } from '@/types';

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

    tokens.forEach((token, tokenIdx) => {
      if (token.type === 'heading') {
        const textContent = cleanInlineMarkdown(token.text);
        if (token.depth === 1) {
          title = textContent;
          const textElem: TextElement = {
            id: `elem-title-${slideIndex}-${tokenIdx}`,
            type: 'text',
            content: textContent,
            x: 50,
            y: currentY,
            fontSize: 42,
            fontWeight: 'bold',
            color: 'inherit',
            textAlign: 'center',
            isHeading: true,
            zIndex: 10,
          };
          elements.push(textElem);
          currentY += 22;
        } else {
          if (!subtitle) subtitle = textContent;
          const textElem: TextElement = {
            id: `elem-subtitle-${slideIndex}-${tokenIdx}`,
            type: 'text',
            content: textContent,
            x: 50,
            y: currentY,
            fontSize: 28,
            fontWeight: '600',
            color: 'inherit',
            textAlign: 'center',
            zIndex: 9,
          };
          elements.push(textElem);
          currentY += 16;
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
            width: 250,
            height: 250,
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
            fontSize: 22,
            fontWeight: 'normal',
            color: 'inherit',
            textAlign: 'center',
            zIndex: 8,
          };
          elements.push(textElem);
          currentY += 15;
        }
      } else if (token.type === 'list') {
        const listItems = token.items.map((item: { text: string }) => cleanInlineMarkdown(item.text));
        bullets.push(...listItems);

        const listContent = listItems.map((item: string) => `• ${item}`).join('\n');
        const textElem: TextElement = {
          id: `elem-list-${slideIndex}-${tokenIdx}`,
          type: 'text',
          content: listContent,
          x: 50,
          y: currentY,
          fontSize: 22,
          fontWeight: '500',
          color: 'inherit',
          textAlign: 'left',
          zIndex: 8,
        };
        elements.push(textElem);
        currentY += Math.max(20, listItems.length * 8);
      }
    });

    return {
      id: slideId,
      title: title || `Slide ${slideIndex + 1}`,
      subtitle,
      bullets,
      elements,
    };
  });
}

function cleanInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/`(.*?)`/g, '$1') // Inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Links
}
