'use client';

import React, { useState } from 'react';
import { SlideElement, ShapeType } from '@/types';
import {
  FiSquare,
  FiCircle,
  FiStar,
  FiArrowRight,
  FiType,
  FiSmile,
  FiHeart,
  FiCheckCircle,
  FiHelpCircle,
  FiBookmark,
  FiShield,
  FiZap,
} from 'react-icons/fi';
import { Modal } from '@/components/ui/Modal';

interface ElementToolbarProps {
  onAddElement: (element: SlideElement) => void;
}

const AVAILABLE_ICONS = [
  { name: 'FiStar', icon: FiStar, label: 'Star' },
  { name: 'FiHeart', icon: FiHeart, label: 'Heart' },
  { name: 'FiCheckCircle', icon: FiCheckCircle, label: 'Check' },
  { name: 'FiArrowRight', icon: FiArrowRight, label: 'Arrow' },
  { name: 'FiZap', icon: FiZap, label: 'Lightning' },
  { name: 'FiBookmark', icon: FiBookmark, label: 'Bookmark' },
  { name: 'FiShield', icon: FiShield, label: 'Shield' },
  { name: 'FiHelpCircle', icon: FiHelpCircle, label: 'Question' },
];

export const ElementToolbar: React.FC<ElementToolbarProps> = ({ onAddElement }) => {
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);

  const addTextElement = () => {
    const newText: SlideElement = {
      id: `elem-text-${Date.now()}`,
      type: 'text',
      content: 'Teks Baru (Klik untuk Ubah)',
      x: 50,
      y: 50,
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000000',
      textAlign: 'center',
      zIndex: 20,
    };
    onAddElement(newText);
  };

  const addShapeElement = (shapeType: ShapeType) => {
    const newShape: SlideElement = {
      id: `elem-shape-${Date.now()}`,
      type: 'shape',
      shapeType,
      x: 50,
      y: 50,
      width: 120,
      height: 120,
      fillColor: '#FF71CE',
      strokeColor: '#000000',
      strokeWidth: 3,
      zIndex: 5,
    };
    onAddElement(newShape);
  };

  const addIconElement = (iconName: string) => {
    const newIcon: SlideElement = {
      id: `elem-icon-${Date.now()}`,
      type: 'icon',
      iconName,
      iconSet: 'fi',
      size: 60,
      color: '#000000',
      x: 50,
      y: 50,
      zIndex: 15,
    };
    onAddElement(newIcon);
    setIsIconModalOpen(false);
  };

  return (
    <div className="neo-card p-4 bg-white flex flex-col gap-3 mb-4">
      <label className="font-extrabold text-sm text-black block">Tambah Elemen Ke Slide</label>
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={addTextElement}
          className="neo-btn neo-btn-cyan text-xs py-2 px-2"
        >
          <FiType size={14} /> Teks
        </button>

        <button
          type="button"
          onClick={() => addShapeElement('square')}
          className="neo-btn neo-btn-pink text-xs py-2 px-2"
          title="Kotak"
        >
          <FiSquare size={14} /> Kotak
        </button>

        <button
          type="button"
          onClick={() => addShapeElement('circle')}
          className="neo-btn neo-btn-green text-xs py-2 px-2"
          title="Lingkaran"
        >
          <FiCircle size={14} /> Lingkaran
        </button>

        <button
          type="button"
          onClick={() => addShapeElement('star')}
          className="neo-btn neo-btn-purple text-xs py-2 px-2"
          title="Bintang"
        >
          <FiStar size={14} /> Bintang
        </button>

        <button
          type="button"
          onClick={() => setIsIconModalOpen(true)}
          className="neo-btn neo-btn-white text-xs py-2 px-2 col-span-2"
        >
          <FiSmile size={14} /> Icon...
        </button>
      </div>

      {/* Icon Selector Modal */}
      <Modal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        title="Pilih Icon Elemen"
      >
        <div className="grid grid-cols-4 gap-3 p-2">
          {AVAILABLE_ICONS.map((item) => {
            const IconComp = item.icon;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => addIconElement(item.name)}
                className="flex flex-col items-center justify-center p-3 rounded-lg border-2 border-black bg-[#FFFBEB] hover:bg-[#FEF08A] hover:shadow-[3px_3px_0_#000] transition-all cursor-pointer"
              >
                <IconComp size={30} className="text-black mb-1" />
                <span className="text-xs font-bold text-black">{item.label}</span>
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};
