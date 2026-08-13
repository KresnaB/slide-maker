'use client';

import React from 'react';
import { WatermarkConfig } from '@/types';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { FiCheckSquare, FiSquare, FiMove } from 'react-icons/fi';

interface WatermarkEditorProps {
  watermark: WatermarkConfig;
  onChange: (watermark: WatermarkConfig) => void;
}

export const WatermarkEditor: React.FC<WatermarkEditorProps> = ({ watermark, onChange }) => {
  return (
    <div className="neo-card p-4 bg-white flex flex-col gap-3 mb-4">
      <div className="flex items-center justify-between">
        <label className="font-extrabold text-sm text-black flex items-center gap-2 cursor-pointer">
          <button
            type="button"
            onClick={() => onChange({ ...watermark, enabled: !watermark.enabled })}
            className="text-black text-lg focus:outline-none cursor-pointer"
          >
            {watermark.enabled ? (
              <FiCheckSquare className="text-[#A3E635] bg-black rounded" />
            ) : (
              <FiSquare />
            )}
          </button>
          <span>Tampilkan Watermark</span>
        </label>
        <span className="neo-badge bg-[#FEF08A] text-[10px] px-2 py-0.5 flex items-center gap-1">
          <FiMove size={12} /> Draggable
        </span>
      </div>

      {watermark.enabled && (
        <div className="flex flex-col gap-3 pt-2 border-t-2 border-gray-200">
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">Text Watermark (Nama Akun)</label>
            <input
              type="text"
              value={watermark.text}
              onChange={(e) => onChange({ ...watermark, text: e.target.value })}
              placeholder="Misal: @kawan.toefl"
              className="neo-input py-1.5 text-xs font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Ukuran Font ({watermark.fontSize}px)
              </label>
              <input
                type="range"
                min={12}
                max={48}
                value={watermark.fontSize}
                onChange={(e) => onChange({ ...watermark, fontSize: Number(e.target.value) })}
                className="w-full accent-black cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Transparansi ({Math.round(watermark.opacity * 100)}%)
              </label>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={watermark.opacity}
                onChange={(e) => onChange({ ...watermark, opacity: Number(e.target.value) })}
                className="w-full accent-black cursor-pointer"
              />
            </div>
          </div>

          <ColorPicker
            label="Warna Watermark"
            value={watermark.color}
            onChange={(color) => onChange({ ...watermark, color })}
          />

          <div className="text-[11px] text-gray-700 bg-[#FFFBEB] p-2.5 rounded-lg border border-black shadow-[1px_1px_0_#000]">
            💡 <strong>Petunjuk:</strong> Watermark posisi default di <em>bawah-tengah</em>. Anda dapat <strong>menggeser posisi watermark</strong> secara langsung di atas canvas slide!
          </div>
        </div>
      )}
    </div>
  );
};
