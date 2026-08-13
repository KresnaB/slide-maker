'use client';

import React from 'react';
import {
  SlideData,
  WatermarkConfig,
  ThemeConfig,
  AspectRatioPreset,
} from '@/types';
import { ElementView, WatermarkView } from '@/components/editor/SlideViews';

interface StaticSlideProps {
  slide: SlideData;
  theme: ThemeConfig;
  aspectRatio: AspectRatioPreset;
  watermark: WatermarkConfig;
  width?: number; // default: resolusi target (aspectRatio.width) agar ekspor presisi
}

/**
 * Render statis satu slide pada ukuran asli (native) resolusi target.
 * Dipakai untuk ekspor PNG/JPG/SVG supaya hasilnya presisi WYSIWYG
 * (border 6px, shadow 12px, font sesuai ukuran desain di 1080px).
 */
export const StaticSlide: React.FC<StaticSlideProps> = ({
  slide,
  theme,
  aspectRatio,
  watermark,
  width,
}) => {
  const canvasWidth = width ?? aspectRatio.width;
  const canvasHeight = Math.round(canvasWidth / aspectRatio.ratio);

  const borderRadius =
    theme.id === 'neobrutalism'
      ? '24px'
      : theme.id === 'bento'
      ? '20px'
      : theme.id === 'glassmorphism'
      ? '16px'
      : '6px';

  return (
    <div
      style={{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        background: slide.bgColor || theme.bgStyle,
        fontFamily: theme.fontFamilyBody,
        color: theme.textColor,
        border: theme.borderStyle,
        boxShadow: theme.shadowStyle,
        borderRadius,
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      {slide.elements.map((elem) => (
        <div
          key={elem.id}
          style={{
            position: 'absolute',
            left: `${(elem.x / 100) * canvasWidth}px`,
            top: `${(elem.y / 100) * canvasHeight}px`,
            zIndex: elem.zIndex || 10,
            transform: elem.rotation ? `rotate(${elem.rotation}deg)` : undefined,
            transformOrigin: 'center',
            maxWidth: `${canvasWidth - 40}px`,
            boxSizing: 'border-box',
            padding: '4px',
          }}
        >
          <ElementView element={elem} theme={theme} />
        </div>
      ))}

      {watermark.enabled && watermark.text && (
        <div
          style={{
            position: 'absolute',
            left: `${(watermark.x / 100) * canvasWidth}px`,
            top: `${(watermark.y / 100) * canvasHeight}px`,
            zIndex: 99,
            transform: 'translate(-50%, -50%)',
            cursor: 'default',
          }}
        >
          <WatermarkView watermark={watermark} theme={theme} />
        </div>
      )}
    </div>
  );
};
