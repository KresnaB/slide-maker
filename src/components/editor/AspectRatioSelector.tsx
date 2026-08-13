'use client';

import React from 'react';
import { AspectRatioId } from '@/types';
import { ASPECT_RATIOS } from '@/lib/presets';

interface AspectRatioSelectorProps {
  currentRatio: AspectRatioId;
  customWidth?: number;
  customHeight?: number;
  onChange: (ratio: AspectRatioId, customWidth?: number, customHeight?: number) => void;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({
  currentRatio,
  customWidth = 1080,
  customHeight = 1080,
  onChange,
}) => {
  return (
    <div className="neo-card p-4 bg-white flex flex-col gap-3 mb-4">
      <label className="font-extrabold text-sm text-black block">Preset Rasio Ukuran Slide</label>
      <div className="grid grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
        {ASPECT_RATIOS.map((preset) => {
          const isSelected = currentRatio === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChange(preset.id, customWidth, customHeight)}
              className={`flex flex-col text-left p-2 rounded-lg border-2 border-black transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#FEF08A] font-extrabold shadow-[2px_2px_0_#000]'
                  : 'bg-white hover:bg-gray-50 text-gray-800'
              }`}
            >
              <span className="text-xs font-bold truncate">{preset.name}</span>
              <span className="text-[10px] text-gray-600 font-mono">{preset.label}</span>
            </button>
          );
        })}
      </div>

      {currentRatio === 'custom' && (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t-2 border-gray-200 mt-1">
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Lebar (px)</label>
            <input
              type="number"
              value={customWidth}
              onChange={(e) => onChange('custom', Number(e.target.value), customHeight)}
              className="neo-input py-1 text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">Tinggi (px)</label>
            <input
              type="number"
              value={customHeight}
              onChange={(e) => onChange('custom', customWidth, Number(e.target.value))}
              className="neo-input py-1 text-xs font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
};
