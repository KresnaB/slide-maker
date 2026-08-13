'use client';

import React, { useRef } from 'react';
import {
  SlideData,
  SlideElement,
  TextElement,
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

interface DragState {
  kind: 'element' | 'watermark';
  id?: string;
  startClientX: number;
  startClientY: number;
  startX: number; // persen
  startY: number; // persen
}

const clampPct = (v: number, min = 3, max = 97) => Math.max(min, Math.min(max, v));

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

  const dragRef = useRef<DragState | null>(null);

  const borderRadius =
    theme.id === 'neobrutalism'
      ? '24px'
      : theme.id === 'bento'
      ? '20px'
      : theme.id === 'glassmorphism'
      ? '16px'
      : '6px';

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dxPct = ((e.clientX - d.startClientX) / canvasWidth) * 100;
    const dyPct = ((e.clientY - d.startClientY) / canvasHeight) * 100;
    const newX = clampPct(d.startX + dxPct);
    const newY = clampPct(d.startY + dyPct);
    if (d.kind === 'element' && d.id) {
      onUpdateElementPosition(d.id, newX, newY);
    } else if (d.kind === 'watermark') {
      onUpdateWatermarkPosition(newX, newY);
    }
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const startElementDrag = (e: React.PointerEvent, elem: SlideElement) => {
    e.stopPropagation();
    onSelectElement(elem.id);
    dragRef.current = {
      kind: 'element',
      id: elem.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: elem.x,
      startY: elem.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const startWatermarkDrag = (e: React.PointerEvent) => {
    e.stopPropagation();
    dragRef.current = {
      kind: 'watermark',
      startClientX: e.clientX,
      startClientY: e.clientY,
      startX: watermark.x,
      startY: watermark.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  // Estimasi ukuran kartu watermark (design px) untuk centering presisi
  const wmDesignW = Math.round(watermark.text.length * watermark.fontSize * 0.62 + 68);
  const wmDesignH = Math.round(watermark.fontSize + 22);
  const wmScaledW = wmDesignW * scale;
  const wmScaledH = wmDesignH * scale;

  return (
    <div className="flex flex-col items-center justify-center w-full my-2">
      {/* Slide Canvas Outer Box */}
      <div
        id="slide-canvas-render"
        onClick={() => {
          if (!dragRef.current) onSelectElement(null);
        }}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
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
          touchAction: 'none',
        }}
        className="transition-all duration-200 flex-shrink-0"
      >
        {/* SLIDE ELEMENTS */}
        {slide.elements.map((elem) => {
          const isSelected = selectedElementId === elem.id;
          const posX = (elem.x / 100) * canvasWidth;
          const posY = (elem.y / 100) * canvasHeight;

          return (
            <div
              key={elem.id}
              onPointerDown={(e) => startElementDrag(e, elem)}
              style={{
                position: 'absolute',
                left: `${posX}px`,
                top: `${posY}px`,
                zIndex: elem.zIndex || 10,
                cursor: 'grab',
                margin: 0,
                padding: '4px',
                maxWidth: `${canvasWidth - 40}px`,
                width:
                  elem.type === 'text' && (elem as TextElement).width
                    ? `${(elem as TextElement).width}px`
                    : undefined,
                boxSizing: 'border-box',
              }}
              className={`transition-shadow ${
                isSelected
                  ? 'outline-2 outline-dashed outline-black bg-yellow-300/30 rounded shadow-[2px_2px_0_#000]'
                  : 'hover:outline-1 hover:outline-dashed hover:outline-black/40'
              }`}
            >
              {/* Skala elemen dengan transform (bukan zoom) supaya drag 1:1 dengan kursor */}
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                }}
              >
                <div
                  style={{
                    transform: elem.rotation ? `rotate(${elem.rotation}deg)` : undefined,
                    transformOrigin: 'center',
                  }}
                >
                  <ElementView element={elem} theme={theme} />
                </div>
              </div>
            </div>
          );
        })}

        {/* WATERMARK ELEMENT (DRAGGABLE) */}
        {watermark.enabled && watermark.text && (
          <div
            onPointerDown={startWatermarkDrag}
            style={{
              position: 'absolute',
              left: `${(watermark.x / 100) * canvasWidth - wmScaledW / 2}px`,
              top: `${(watermark.y / 100) * canvasHeight - wmScaledH / 2}px`,
              zIndex: 99,
              cursor: 'grab',
            }}
            title="Geser Watermark untuk memindahkan posisinya!"
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <WatermarkView watermark={watermark} theme={theme} />
            </div>
          </div>
        )}
      </div>

      {/* Resolution & Ratio Indicator */}
      <div className="mt-4 text-xs font-extrabold text-black bg-[#FEF08A] px-3.5 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0_#000] text-center">
        Resolusi Ekspor Target: {aspectRatio.width} × {aspectRatio.height} px ({aspectRatio.name})
      </div>
    </div>
  );
};
