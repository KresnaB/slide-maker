'use client';

import React from 'react';

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
}

const QUICK_PRESETS = [
  '#000000',
  '#FFFFFF',
  '#FF71CE',
  '#01CDFE',
  '#FEF08A',
  '#A3E635',
  '#C084FC',
  '#FB923C',
  '#EF4444',
  '#3B82F6',
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-bold text-gray-800">{label}</label>}
      <div className="flex items-center gap-2">
        <div className="relative flex-shrink-0">
          <input
            type="color"
            value={value.startsWith('#') ? value : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="w-9 h-9 p-0 border-2 border-black rounded cursor-pointer shadow-[2px_2px_0_#000]"
          />
        </div>
        <div className="flex flex-wrap gap-1 items-center">
          {QUICK_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`w-6 h-6 rounded border-2 border-black transition-transform hover:scale-110 ${
                value.toLowerCase() === color.toLowerCase()
                  ? 'ring-2 ring-black scale-110 shadow-[1px_1px_0_#000]'
                  : ''
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
