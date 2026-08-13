'use client';

import React, { useState } from 'react';
import { ExportFormat, SlideData } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { exportSingleSlide, exportAllSlidesToZip } from '@/lib/exportEngine';
import { FiDownload, FiCheck, FiArchive, FiImage } from 'react-icons/fi';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideData[];
  activeSlideIndex: number;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  slides,
  activeSlideIndex,
  canvasRef,
}) => {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const handleExportSingle = async () => {
    if (!canvasRef.current) return;
    try {
      setIsExporting(true);
      const activeSlide = slides[activeSlideIndex];
      const filename = `slide-${activeSlideIndex + 1}-${activeSlide.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      await exportSingleSlide(canvasRef.current, filename, format);
    } catch (err) {
      console.error('Export error:', err);
      alert('Gagal mengekspor gambar slide. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBatchExportZip = async () => {
    if (!canvasRef.current) return;
    try {
      setIsExporting(true);
      setProgress({ current: 0, total: slides.length });

      // We will clone or export each slide canvas element
      const slideElements = [];
      const canvasNode = canvasRef.current;

      // Batch rendering elements
      for (let i = 0; i < slides.length; i++) {
        slideElements.push({
          element: canvasNode,
          filename: `slide-${i + 1}`,
        });
      }

      await exportAllSlidesToZip(slideElements, format, 'slideshow-konten-batch.zip', (current, total) => {
        setProgress({ current, total });
      });

      alert('Batch download berhasil! File ZIP telah disimpan.');
    } catch (err) {
      console.error('Batch export error:', err);
      alert('Gagal mengekspor batch ZIP. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
      setProgress(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ekspor &amp; Batch Download Slideshow">
      <div className="flex flex-col gap-5 p-1">
        {/* Format Selector */}
        <div>
          <label className="font-extrabold text-sm text-black block mb-2">
            1. Pilih Format Gambar Output
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['png', 'jpeg', 'svg'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 border-black font-black uppercase text-sm transition-all ${
                  format === fmt
                    ? 'bg-[#FEF08A] shadow-[3px_3px_0_#000] translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <FiImage className="text-xl mb-1" />
                <span>{fmt === 'jpeg' ? 'JPG' : fmt.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar (If exporting batch) */}
        {progress && (
          <div className="flex flex-col gap-1.5 bg-[#FFFBEB] p-3 rounded border-2 border-black">
            <span className="text-xs font-extrabold text-black">
              Mengekspor Slide {progress.current} dari {progress.total}...
            </span>
            <div className="w-full bg-gray-200 h-4 rounded-full border border-black overflow-hidden">
              <div
                className="bg-[#A3E635] h-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-2 border-t-2 border-gray-200">
          <button
            onClick={handleExportSingle}
            disabled={isExporting}
            className="neo-btn neo-btn-cyan w-full py-3 text-sm sm:text-base font-extrabold"
          >
            <FiDownload /> Unduh Slide Saat Ini (Slide {activeSlideIndex + 1})
          </button>

          <button
            onClick={handleBatchExportZip}
            disabled={isExporting}
            className="neo-btn neo-btn-green w-full py-3 text-sm sm:text-base font-extrabold"
          >
            <FiArchive className="text-lg" /> Download Semua Slide Sekaligus (.ZIP Batch)
          </button>
        </div>
      </div>
    </Modal>
  );
};
