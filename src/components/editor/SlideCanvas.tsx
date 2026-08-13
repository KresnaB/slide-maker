'use client';

import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import {
  SlideData,
  SlideElement,
  WatermarkConfig,
  ThemeConfig,
  AspectRatioPreset,
  TextElement,
  ShapeElement,
  IconElement,
  ImageElement,
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

interface SlideCanvasProps {
  slide: SlideData;
  theme: ThemeConfig;
  aspectRatio: AspectRatioPreset;
  watermark: WatermarkConfig;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElementPosition: (id: string, x: number, y: number) => void;
  onUpdateWatermarkPosition: (x: number, y: number) => void;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
}

const ICON_MAP: Record<string, React.ElementType> = {
  FiStar,
  FiHeart,
  FiCheckCircle,
  FiArrowRight,
  FiZap,
  FiBookmark,
  FiShield,
  FiHelpCircle,
};

export const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slide,
  theme,
  aspectRatio,
  watermark,
  selectedElementId,
  onSelectElement,
  onUpdateElementPosition,
  onUpdateWatermarkPosition,
  canvasRef,
}) => {
  // Compute preview canvas dimensions dynamically
  // Target preview width: 480px (fits nicely in desktop editor screen)
  const canvasWidth = 480;
  const canvasHeight = Math.round(canvasWidth / aspectRatio.ratio);

  // Scale factor relative to standard 1080px export canvas
  const scale = canvasWidth / 540;

  return (
    <div className="flex flex-col items-center justify-center w-full my-2">
      {/* Slide Canvas Outer Box */}
      <div
        ref={canvasRef}
        id="slide-canvas-render"
        onClick={() => onSelectElement(null)}
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          background: theme.bgStyle,
          fontFamily: theme.fontFamilyBody,
          color: theme.textColor,
          border: theme.borderStyle,
          boxShadow: theme.shadowStyle,
          borderRadius: theme.id === 'bento' ? '20px' : theme.id === 'glassmorphism' ? '16px' : '6px',
          position: 'relative',
          overflow: 'hidden',
          userSelect: 'none',
          boxSizing: 'border-box',
        }}
        className="transition-all duration-200 flex-shrink-0"
      >
        {/* Glassmorphism / Bento Decorative Overlays */}
        {theme.id === 'glassmorphism' && (
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md pointer-events-none border border-white/20 rounded-xl" />
        )}
        {theme.id === 'bento' && (
          <div className="absolute inset-2 border border-white/10 rounded-xl pointer-events-none" />
        )}

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
                const newXPercent = Math.max(5, Math.min(95, (data.x / canvasWidth) * 100));
                const newYPercent = Math.max(5, Math.min(95, (data.y / canvasHeight) * 100));
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
                  // Origin offset so element center aligns to (posX, posY)
                  margin: 0,
                  padding: '4px',
                  maxWidth: `${canvasWidth - 40}px`,
                  boxSizing: 'border-box',
                }}
                className={`transition-shadow ${
                  isSelected
                    ? 'outline-2 outline-dashed outline-black bg-yellow-300/30 rounded shadow-[2px_2px_0_#000]'
                    : 'hover:outline-1 hover:outline-dashed hover:outline-black/40'
                }`}
              >
                {/* TEXT ELEMENT */}
                {elem.type === 'text' && (
                  <div
                    style={{
                      fontSize: `${Math.max(12, Math.round((elem as TextElement).fontSize * scale))}px`,
                      fontFamily: (elem as TextElement).isHeading
                        ? theme.fontFamilyHeading
                        : theme.fontFamilyBody,
                      fontWeight: (elem as TextElement).fontWeight || 'normal',
                      color:
                        (elem as TextElement).color === 'inherit'
                          ? (elem as TextElement).isHeading
                            ? theme.headingColor
                            : theme.textColor
                          : (elem as TextElement).color,
                      textAlign: (elem as TextElement).textAlign || 'center',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      lineHeight: '1.3',
                      width: '100%',
                    }}
                  >
                    {(elem as TextElement).content}
                  </div>
                )}

                {/* SHAPE ELEMENT */}
                {elem.type === 'shape' && (
                  <div
                    style={{
                      width: `${Math.round((elem as ShapeElement).width * scale)}px`,
                      height: `${Math.round((elem as ShapeElement).height * scale)}px`,
                      backgroundColor: (elem as ShapeElement).fillColor,
                      border: `${(elem as ShapeElement).strokeWidth || 2}px solid ${
                        (elem as ShapeElement).strokeColor || '#000'
                      }`,
                      borderRadius:
                        (elem as ShapeElement).shapeType === 'circle'
                          ? '9999px'
                          : (elem as ShapeElement).shapeType === 'rounded-square'
                          ? '12px'
                          : '2px',
                      boxShadow: theme.shadowStyle !== 'none' ? '2px 2px 0px #000' : 'none',
                    }}
                  />
                )}

                {/* ICON ELEMENT */}
                {elem.type === 'icon' && (
                  <div style={{ color: (elem as IconElement).color || theme.accentColor }}>
                    {React.createElement(
                      ICON_MAP[(elem as IconElement).iconName] || FiStar,
                      {
                        size: Math.round((elem as IconElement).size * scale),
                      }
                    )}
                  </div>
                )}

                {/* IMAGE ELEMENT */}
                {elem.type === 'image' && (
                  <img
                    src={(elem as ImageElement).src}
                    alt={(elem as ImageElement).alt || 'Slide image'}
                    style={{
                      width: `${Math.round((elem as ImageElement).width * scale)}px`,
                      height: `${Math.round((elem as ImageElement).height * scale)}px`,
                      objectFit: 'cover',
                      borderRadius: '6px',
                      border: '2px solid #000',
                    }}
                  />
                )}
              </div>
            </Draggable>
          );
        })}

        {/* WATERMARK ELEMENT (DRAGGABLE) */}
        {watermark.enabled && watermark.text && (
          <Draggable
            position={{
              x: (watermark.x / 100) * canvasWidth - 60,
              y: (watermark.y / 100) * canvasHeight - 14,
            }}
            onStop={(e, data) => {
              const newX = Math.max(5, Math.min(95, ((data.x + 60) / canvasWidth) * 100));
              const newY = Math.max(5, Math.min(95, ((data.y + 14) / canvasHeight) * 100));
              onUpdateWatermarkPosition(newX, newY);
            }}
            bounds="parent"
          >
            <div
              style={{
                position: 'absolute',
                zIndex: 99,
                cursor: 'grab',
                opacity: watermark.opacity,
                color: watermark.color || theme.textColor,
                fontSize: `${Math.max(10, Math.round(watermark.fontSize * scale))}px`,
                fontFamily: watermark.fontFamily || theme.fontFamilyBody,
                fontWeight: '800',
                background: 'rgba(255, 255, 255, 0.85)',
                padding: '3px 10px',
                borderRadius: '6px',
                border: '2px solid #000',
                boxShadow: '2px 2px 0px #000',
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
              className="hover:bg-yellow-200 transition-colors"
              title="Geser Watermark untuk memindahkan posisinya!"
            >
              {watermark.text}
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
