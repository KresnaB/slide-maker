'use client';

import React from 'react';
import Draggable from 'react-draggable';
import {
  SlideData,
  SlideElement,
  WatermarkConfig,
  ThemeConfig,
  AspectRatioPreset,
} from '@/types';
import { ElementView, WatermarkView } from '@/components/editor/SlideViews';

interface SlideCanvasProps {
  slide: SlideData;
  theme: ThemeConfig;
  aspectRatio: AspectRatioPreset;
  watermark: WatermarkConfig;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElementPosition: (id: string, x: number, y: number) => void;
  onUpdateWatermarkPosition: (x: number, y: number) => void;
}

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slide,
  theme,
  aspectRatio,
  watermark,
  selectedElementId,
  onSelectElement,
  onUpdateElementPosition,
  onUpdateWatermarkPosition,
}) => {
  // Ukuran preview di layar editor
  const canvasWidth = 480;
  const canvasHeight = Math.round(canvasWidth / aspectRatio.ratio);

  // Skala dari resolusi desain (1080-based) ke preview
  const scale = canvasWidth / aspectRatio.width;

  const borderRadius =
    theme.id === 'neobrutalism'
      ? '24px'
      : theme.id === 'bento'
      ? '20px'
      : theme.id === 'glassmorphism'
      ? '16px'
      : '6px';

  return (
    <div className="flex flex-col items-center justify-center w-full my-2">
      {/* Slide Canvas Outer Box */}
      <div
        id="slide-canvas-render"
        onClick={() => onSelectElement(null)}
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
        }}
        className="transition-all duration-200 flex-shrink-0"
      >
        {/* SLIDE ELEMENTS */}
        {slide.elements.map((elem) => {
          const isSelected = selectedElementId === elem.id;

          // Convert percentage coordinates (0-100%) to pixels inside preview canvas
          const posX = (elem.x / 100) * canvasWidth;
          const posY = (elem.y / 100) * canvasHeight;

          return (
            <Draggable
              key={elem.id}
              position={{ x: posX, y: posY }}
              onStop={(e, data) => {
                const newXPercent = Math.max(3, Math.min(97, (data.x / canvasWidth) * 100));
                const newYPercent = Math.max(3, Math.min(97, (data.y / canvasHeight) * 100));
                onUpdateElementPosition(elem.id, newXPercent, newYPercent);
              }}
              bounds="parent"
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectElement(elem.id);
                }}
                style={{
                  position: 'absolute',
                  zIndex: elem.zIndex || 10,
                  cursor: 'grab',
                  margin: 0,
                  padding: '4px',
                  maxWidth: `${canvasWidth - 40}px`,
                  boxSizing: 'border-box',
                  // Skala elemen (font/shape/icon) mengikuti preview
                  zoom: scale,
                }}
                className={`transition-shadow ${
                  isSelected
                    ? 'outline-2 outline-dashed outline-black bg-yellow-300/30 rounded shadow-[2px_2px_0_#000]'
                    : 'hover:outline-1 hover:outline-dashed hover:outline-black/40'
                }`}
              >
                <div
                  style={{
                    transform: elem.rotation
                      ? `rotate(${elem.rotation}deg)`
                      : undefined,
                    transformOrigin: 'center',
                  }}
                >
                  <ElementView element={elem} theme={theme} />
                </div>
              </div>
            </Draggable>
          );
        })}

        {/* WATERMARK ELEMENT (DRAGGABLE) */}
        {watermark.enabled && watermark.text && (
          <Draggable
            position={{
              x: (watermark.x / 100) * canvasWidth - 90,
              y: (watermark.y / 100) * canvasHeight - 16,
            }}
            onStop={(e, data) => {
              const newX = Math.max(5, Math.min(95, ((data.x + 90) / canvasWidth) * 100));
              const newY = Math.max(5, Math.min(95, ((data.y + 16) / canvasHeight) * 100));
              onUpdateWatermarkPosition(newX, newY);
            }}
            bounds="parent"
          >
            <div
              style={{
                position: 'absolute',
                zIndex: 99,
                cursor: 'grab',
                // Skala watermark mengikuti preview
                zoom: scale,
                transformOrigin: 'top left',
              }}
              title="Geser Watermark untuk memindahkan posisinya!"
            >
              <WatermarkView watermark={watermark} theme={theme} />
            </div>
          </Draggable>
        )}
      </div>

      {/* Resolution & Ratio Indicator */}
      <div className="mt-4 text-xs font-extrabold text-black bg-[#FEF08A] px-3.5 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0_#000] text-center">
        Resolusi Ekspor Target: {aspectRatio.width} × {aspectRatio.height} px ({aspectRatio.name})
      </div>
    </div>
  );
};
