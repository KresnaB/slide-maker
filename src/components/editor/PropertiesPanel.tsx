'use client';

import React from 'react';
import { SlideElement, TextElement, ShapeElement, IconElement } from '@/types';
import { ColorPicker } from '@/components/ui/ColorPicker';
import {
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiEdit2,
} from 'react-icons/fi';

interface PropertiesPanelProps {
  selectedElement: SlideElement | null;
  onUpdateElement: (updated: SlideElement) => void;
  onDeleteElement: (id: string) => void;
  onMoveZIndex: (id: string, direction: 'up' | 'down') => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onMoveZIndex,
}) => {
  if (!selectedElement) {
    return (
      <div className="neo-card p-4 bg-white mb-4 text-center text-gray-600 text-xs font-semibold leading-relaxed">
        💡 Klik salah satu elemen (Teks, Icon, Shape) pada canvas slide untuk mengubah ukurannya, warna, atau posisinya.
      </div>
    );
  }

  return (
    <div className="neo-card p-4 bg-white flex flex-col gap-3 mb-4">
      <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2">
        <span className="font-extrabold text-xs text-black uppercase tracking-wider flex items-center gap-1">
          <FiEdit2 size={13} /> Pengaturan Elemen ({selectedElement.type})
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMoveZIndex(selectedElement.id, 'up')}
            className="p-1.5 rounded border border-black bg-gray-100 hover:bg-gray-200 text-xs cursor-pointer"
            title="Bawa ke Depan"
          >
            <FiArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => onMoveZIndex(selectedElement.id, 'down')}
            className="p-1.5 rounded border border-black bg-gray-100 hover:bg-gray-200 text-xs cursor-pointer"
            title="Kirim ke Belakang"
          >
            <FiArrowDown size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteElement(selectedElement.id)}
            className="p-1.5 rounded border border-black bg-[#FF71CE] text-black hover:bg-pink-400 text-xs ml-1 cursor-pointer"
            title="Hapus Elemen"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* TEXT PROPERTIES */}
      {selectedElement.type === 'text' && (
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">Isi Teks</label>
            <textarea
              value={(selectedElement as TextElement).content}
              onChange={(e) =>
                onUpdateElement({ ...selectedElement, content: e.target.value } as TextElement)
              }
              rows={3}
              className="neo-textarea py-1.5 text-xs font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              Ukuran Font ({(selectedElement as TextElement).fontSize || 24}px)
            </label>
            <input
              type="range"
              min={12}
              max={96}
              value={(selectedElement as TextElement).fontSize || 24}
              onChange={(e) =>
                onUpdateElement({
                  ...selectedElement,
                  fontSize: Number(e.target.value),
                } as TextElement)
              }
              className="w-full accent-black cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">Rataan Teks</label>
            <div className="flex items-center gap-1">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  type="button"
                  onClick={() =>
                    onUpdateElement({ ...selectedElement, textAlign: align } as TextElement)
                  }
                  className={`flex-1 py-1 flex items-center justify-center rounded border-2 border-black text-xs font-bold cursor-pointer ${
                    (selectedElement as TextElement).textAlign === align
                      ? 'bg-[#FEF08A] shadow-[1px_1px_0_#000]'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {align === 'left' && <FiAlignLeft />}
                  {align === 'center' && <FiAlignCenter />}
                  {align === 'right' && <FiAlignRight />}
                </button>
              ))}
            </div>
          </div>

          <ColorPicker
            label="Warna Teks"
            value={(selectedElement as TextElement).color || '#000000'}
            onChange={(color) =>
              onUpdateElement({ ...selectedElement, color } as TextElement)
            }
          />
        </div>
      )}

      {/* SHAPE PROPERTIES */}
      {selectedElement.type === 'shape' && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Lebar ({(selectedElement as ShapeElement).width}px)
              </label>
              <input
                type="range"
                min={20}
                max={400}
                value={(selectedElement as ShapeElement).width}
                onChange={(e) =>
                  onUpdateElement({
                    ...selectedElement,
                    width: Number(e.target.value),
                  } as ShapeElement)
                }
                className="w-full accent-black cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Tinggi ({(selectedElement as ShapeElement).height}px)
              </label>
              <input
                type="range"
                min={20}
                max={400}
                value={(selectedElement as ShapeElement).height}
                onChange={(e) =>
                  onUpdateElement({
                    ...selectedElement,
                    height: Number(e.target.value),
                  } as ShapeElement)
                }
                className="w-full accent-black cursor-pointer"
              />
            </div>
          </div>

          <ColorPicker
            label="Warna Isi (Fill)"
            value={(selectedElement as ShapeElement).fillColor || '#FF71CE'}
            onChange={(fillColor) =>
              onUpdateElement({ ...selectedElement, fillColor } as ShapeElement)
            }
          />

          <ColorPicker
            label="Warna Garis (Border)"
            value={(selectedElement as ShapeElement).strokeColor || '#000000'}
            onChange={(strokeColor) =>
              onUpdateElement({ ...selectedElement, strokeColor } as ShapeElement)
            }
          />
        </div>
      )}

      {/* ICON PROPERTIES */}
      {selectedElement.type === 'icon' && (
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              Ukuran Icon ({(selectedElement as IconElement).size}px)
            </label>
            <input
              type="range"
              min={20}
              max={200}
              value={(selectedElement as IconElement).size}
              onChange={(e) =>
                onUpdateElement({
                  ...selectedElement,
                  size: Number(e.target.value),
                } as IconElement)
              }
              className="w-full accent-black cursor-pointer"
            />
          </div>

          <ColorPicker
            label="Warna Icon"
            value={(selectedElement as IconElement).color || '#000000'}
            onChange={(color) =>
              onUpdateElement({ ...selectedElement, color } as IconElement)
            }
          />
        </div>
      )}
    </div>
  );
};
