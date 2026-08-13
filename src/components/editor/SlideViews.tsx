'use client';

import React from 'react';
import {
  SlideElement,
  TextElement,
  ShapeElement,
  IconElement,
  ImageElement,
  WatermarkConfig,
  ThemeConfig,
} from '@/types';
import {
  FiStar,
  FiHeart,
  FiCheckCircle,
  FiArrowRight,
  FiZap,
  FiBookmark,
  FiShield,
  FiHelpCircle,
} from 'react-icons/fi';

export const ICON_MAP: Record<string, React.ElementType> = {
  FiStar,
  FiHeart,
  FiCheckCircle,
  FiArrowRight,
  FiZap,
  FiBookmark,
  FiShield,
  FiHelpCircle,
};

const SHAPE_CLIP_PATHS: Record<string, string> = {
  triangle: 'polygon(50% 0, 0 100%, 100% 100%)',
  star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  arrow: 'polygon(0 22%, 55% 22%, 55% 0, 100% 50%, 55% 100%, 55% 78%, 0 78%)',
};

// Ikon buku (lucide book-open) untuk watermark, sama seperti konten Kawan TOEFL
const BOOK_ICON_PATH =
  '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>';

export function shapeStyle(shape: ShapeElement): React.CSSProperties {
  const base: React.CSSProperties = {
    width: `${shape.width}px`,
    height: `${shape.height}px`,
    backgroundColor: shape.fillColor,
    border: `${shape.strokeWidth || 2}px solid ${shape.strokeColor || '#000'}`,
    boxShadow: '2px 2px 0px #000',
  };

  switch (shape.shapeType) {
    case 'circle':
      base.borderRadius = '9999px';
      break;
    case 'rounded-square':
      base.borderRadius = '24px';
      break;
    case 'badge':
      base.borderRadius = '9999px';
      break;
    case 'triangle':
    case 'star':
    case 'arrow':
      base.border = 'none';
      base.boxShadow = 'none';
      base.clipPath = SHAPE_CLIP_PATHS[shape.shapeType] || undefined;
      break;
    default:
      base.borderRadius = '2px';
  }

  return base;
}

export const ElementView: React.FC<{
  element: SlideElement;
  theme: ThemeConfig;
}> = ({ element, theme }) => {
  if (element.type === 'text') {
    const text = element as TextElement;
    return (
      <div
        style={{
          fontSize: `${Math.max(14, text.fontSize)}px`,
          fontFamily: text.isHeading ? theme.fontFamilyHeading : theme.fontFamilyBody,
          fontWeight: text.fontWeight || 'normal',
          color:
            text.color === 'inherit'
              ? text.isHeading
                ? theme.headingColor
                : theme.textColor
              : text.color,
          textAlign: text.textAlign || 'center',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          lineHeight: '1.3',
          width: '100%',
        }}
      >
        {text.content}
      </div>
    );
  }

  if (element.type === 'shape') {
    const shape = element as ShapeElement;
    return <div style={shapeStyle(shape)} />;
  }

  if (element.type === 'icon') {
    const icon = element as IconElement;
    const IconComp = ICON_MAP[icon.iconName] || FiStar;
    return (
      <div style={{ color: icon.color || theme.accentColor, display: 'flex' }}>
        <IconComp size={Math.round(icon.size)} />
      </div>
    );
  }

  if (element.type === 'image') {
    const img = element as ImageElement;
    return (
      <img
        src={img.src}
        alt={img.alt || 'Slide image'}
        style={{
          width: `${img.width}px`,
          height: `${img.height}px`,
          objectFit: 'cover',
          borderRadius: '12px',
          border: '2px solid #000',
          display: 'block',
        }}
      />
    );
  }

  return null;
};

const DARK_BG_THEMES = ['brutalism', 'retro', 'bento', 'gradient', 'glassmorphism'];

export const WatermarkView: React.FC<{
  watermark: WatermarkConfig;
  theme: ThemeConfig;
}> = ({ watermark, theme }) => {
  const isDark = DARK_BG_THEMES.includes(theme.id);
  // Warna default sesuai konten: #1A1A2E di slide terang, kuning di slide gelap
  let fg = watermark.color;
  if (!fg || fg === '#000000' || fg === '#1A1A2E') {
    fg = isDark ? '#FFD93D' : '#1A1A2E';
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: `${watermark.fontSize}px`,
        fontFamily: watermark.fontFamily || theme.fontFamilyHeading,
        fontWeight: 700,
        color: fg,
        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)',
        border: `3px solid ${fg}`,
        borderRadius: '10px',
        padding: '8px 20px',
        opacity: watermark.opacity,
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        lineHeight: 1,
        boxSizing: 'border-box',
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{ __html: BOOK_ICON_PATH }}
      />
      {watermark.text}
    </div>
  );
};
