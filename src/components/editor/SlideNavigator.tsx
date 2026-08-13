'use client';

import React from 'react';
import { SlideData } from '@/types';
import { FiPlus, FiTrash2, FiCopy } from 'react-icons/fi';

interface SlideNavigatorProps {
  slides: SlideData[];
  activeSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onAddSlide: () => void;
  onDuplicateSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
}

export const SlideNavigator: React.FC<SlideNavigatorProps> = ({
  slides,
  activeSlideIndex,
  onSelectSlide,
  onAddSlide,
  onDuplicateSlide,
  onDeleteSlide,
}) => {
  return (
    <div className="neo-card p-4 bg-white flex flex-col gap-3 w-full max-h-[620px]">
      <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2">
        <span className="font-extrabold text-xs text-black uppercase tracking-wider">
          Daftar Slide ({slides.length})
        </span>
        <button
          type="button"
          onClick={onAddSlide}
          className="neo-btn neo-btn-green text-xs py-1.5 px-3"
          title="Tambah Slide Baru"
        >
          <FiPlus size={14} /> Slide
        </button>
      </div>

      <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlideIndex;
          return (
            <div
              key={slide.id}
              onClick={() => onSelectSlide(idx)}
              className={`group relative flex items-center gap-2.5 p-3 rounded-lg border-2 border-black cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#FEF08A] shadow-[3px_3px_0_#000] font-black'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-black text-white font-extrabold text-xs flex-shrink-0">
                {idx + 1}
              </div>

              <div className="flex flex-col flex-grow overflow-hidden">
                <span className="font-extrabold text-xs text-black truncate">
                  {slide.title || `Slide ${idx + 1}`}
                </span>
                <span className="text-[10px] text-gray-500 font-semibold truncate">
                  {slide.elements.length} Elemen
                </span>
              </div>

              {/* Action buttons on thumbnail */}
              <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateSlide(idx);
                  }}
                  className="p-1.5 rounded border border-black bg-white hover:bg-yellow-200 text-black text-xs cursor-pointer"
                  title="Duplikat Slide"
                >
                  <FiCopy size={13} />
                </button>
                {slides.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSlide(idx);
                    }}
                    className="p-1.5 rounded border border-black bg-[#FF71CE] hover:bg-pink-400 text-black text-xs cursor-pointer"
                    title="Hapus Slide"
                  >
                    <FiTrash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
