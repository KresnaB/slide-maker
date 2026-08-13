'use client';

import React from 'react';
import { ThemeId } from '@/types';
import { THEMES } from '@/lib/presets';

interface StylePanelProps {
  currentTheme: ThemeId;
  onChangeTheme: (theme: ThemeId) => void;
}

export const StylePanel: React.FC<StylePanelProps> = ({ currentTheme, onChangeTheme }) => {
  return (
    <div className="neo-card p-4 bg-white flex flex-col gap-3 mb-4">
      <div className="flex items-center justify-between">
        <label className="font-extrabold text-sm text-black">Pilihan Model Style Slide</label>
        <span className="neo-badge bg-[#FF71CE] text-[10px] px-2 py-0.5">
          9 Presets
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
        {Object.values(THEMES).map((theme) => {
          const isSelected = currentTheme === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onChangeTheme(theme.id)}
              className={`flex items-center gap-2 p-2 rounded-lg border-2 border-black text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#A3E635] shadow-[2px_2px_0_#000] font-black'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div
                className="w-6 h-6 rounded border-2 border-black shadow-[1px_1px_0_#000] flex-shrink-0"
                style={{ background: theme.bgStyle }}
              />
              <div className="flex flex-col overflow-hidden">
                <span className="font-extrabold text-xs text-black truncate">
                  {theme.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
