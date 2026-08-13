'use client';

import React, { useRef } from 'react';
import {
  ExportFormat,
  SlideData,
  ThemeConfig,
  AspectRatioPreset,
  WatermarkConfig,
} from '@/types';
import { Modal } from '@/components/ui/Modal';
import { StaticSlide } from '@/components/editor/StaticSlide';
import { exportSingleSlide, exportAllSlidesToZip, SlideExportItem } from '@/lib/exportEngine';
import { FiDownload, FiArchive, FiImage } from 'react-icons/fi';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideData[];
  activeSlideIndex: number;
  theme: ThemeConfig;
  aspectRatio: AspectRatioPreset;
  watermark: WatermarkConfig;
}

/**
 * Modal ekspor. Semua slide dirender secara tersembunyi (offscreen) pada
 * resolusi target asli, lalu di-capture satu per satu:
 * - Unduh satu slide  -> capture slide aktif
 * - Batch ZIP         -> capture SEMUA slide (bukan slide yang sama berulang)
 */
export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  slides,
  activeSlideIndex,
  theme,
  aspectRatio,
  watermark,
}) => {
  const [format, setFormat] = React.useState<ExportFormat>('png');
  const [isExporting, setIsExporting] = React.useState(false);
  const [progress, setProgress] = React.useState<{ current: number; total: number } | null>(null);
  const staticRefs = useRef<Array<HTMLDivElement | null>>([]);

  // pixelRatio 1 karena StaticSlide sudah dirender di resolusi target asli
  const pixelRatio = 1;

  const handleExportSingle = async () => {
    const target = staticRefs.current[activeSlideIndex];
    if (!target) return;
    try {
      setIsExporting(true);
      const activeSlide = slides[activeSlideIndex];
      const filename = `slide-${activeSlideIndex + 1}-${activeSlide.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')}`;
      await exportSingleSlide(target, filename, format, pixelRatio);
    } catch (err) {
      console.error('Export error:', err);
      alert('Gagal mengekspor gambar slide. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleBatchExportZip = async () => {
    try {
      setIsExporting(true);
      setProgress({ current: 0, total: slides.length });

      const slideElements: SlideExportItem[] = [];
      slides.forEach((slide, i) => {
        const el = staticRefs.current[i];
        if (el) {
          slideElements.push({
            element: el,
            filename: `slide-${i + 1}-${slide.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          });
        }
      });

      await exportAllSlidesToZip(slideElements, format, {
        zipName: 'slideshow-konten-batch.zip',
        pixelRatio,
        onProgress: (current, total) => setProgress({ current, total }),
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
    <>
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
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 border-black font-black uppercase text-sm transition-all cursor-pointer ${
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
            <p className="text-[11px] text-gray-600 font-semibold mt-2">
              Resolusi output: {aspectRatio.width} × {aspectRatio.height} px ({aspectRatio.name})
            </p>
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
              className="neo-btn neo-btn-cyan w-full py-3 text-sm sm:text-base font-extrabold cursor-pointer disabled:opacity-50"
            >
              <FiDownload /> Unduh Slide Saat Ini (Slide {activeSlideIndex + 1})
            </button>

            <button
              onClick={handleBatchExportZip}
              disabled={isExporting}
              className="neo-btn neo-btn-green w-full py-3 text-sm sm:text-base font-extrabold cursor-pointer disabled:opacity-50"
            >
              <FiArchive className="text-lg" /> Download Semua Slide Sekaligus (.ZIP Batch)
            </button>
          </div>
        </div>
      </Modal>

      {/* Hidden render layer untuk ekspor: semua slide dirender di resolusi target */}
      {isOpen && (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            left: -10000,
            top: 0,
            zIndex: -1,
            pointerEvents: 'none',
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              ref={(el) => {
                staticRefs.current[i] = el;
              }}
            >
              <StaticSlide
                slide={slide}
                theme={theme}
                aspectRatio={aspectRatio}
                watermark={watermark}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
