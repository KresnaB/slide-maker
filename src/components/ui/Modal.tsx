'use client';

import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="neo-modal-overlay" onClick={onClose}>
      <div
        className="neo-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b-3 border-black">
          <h3 className="font-extrabold text-xl text-black flex items-center gap-2">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded bg-[#FF71CE] text-black border-2 border-black shadow-[2px_2px_0_#000] hover:bg-pink-400 transition-colors"
            aria-label="Tutup Modal"
          >
            <FiX size={20} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
