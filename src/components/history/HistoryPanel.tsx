'use client';

import React from 'react';
import { SlideshowProject } from '@/types';
import { FiFolder, FiTrash2, FiPlay, FiCalendar, FiLayers } from 'react-icons/fi';

interface HistoryPanelProps {
  history: SlideshowProject[];
  onLoadProject: (project: SlideshowProject) => void;
  onDeleteProject: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onLoadProject,
  onDeleteProject,
  onClearHistory,
}) => {
  if (history.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto neo-card bg-white p-8 text-center flex flex-col items-center gap-3">
        <FiFolder className="text-5xl text-gray-400" />
        <h3 className="text-xl font-extrabold text-black">Belum Ada Riwayat Project</h3>
        <p className="text-sm text-gray-600">
          Project slideshow yang Anda buat akan otomatis disimpan di browser (localStorage) secara aman tanpa database.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 p-2 sm:p-4">
      <div className="flex items-center justify-between bg-[#FEF08A] p-4 rounded-xl border-[3px] border-black shadow-[4px_4px_0_#000]">
        <div>
          <h2 className="font-black text-xl text-black flex items-center gap-2">
            <FiFolder /> Riwayat Project Terakhir
          </h2>
          <p className="text-xs text-gray-700 font-medium">
            Tersimpan di browser Anda ({history.length} dari maks 10 project)
          </p>
        </div>

        <button
          onClick={onClearHistory}
          className="neo-btn neo-btn-pink text-xs py-1.5 px-3"
        >
          <FiTrash2 /> Hapus Semua
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((project) => {
          const dateStr = new Date(project.updatedAt || project.createdAt).toLocaleDateString(
            'id-ID',
            {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }
          );

          return (
            <div
              key={project.id}
              className="neo-card p-4 bg-white flex flex-col justify-between gap-3 neo-card-interactive"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="neo-badge text-[10px] uppercase">
                    {project.theme} • {project.aspectRatio}
                  </span>
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    <FiCalendar size={12} /> {dateStr}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-black mt-1 line-clamp-1">
                  {project.title || 'Project Slideshow'}
                </h3>
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <FiLayers size={13} /> {project.slides.length} Slide
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                <button
                  onClick={() => onLoadProject(project)}
                  className="neo-btn neo-btn-green text-xs py-1.5 px-3"
                >
                  <FiPlay /> Buka Editor
                </button>
                <button
                  onClick={() => onDeleteProject(project.id)}
                  className="p-1.5 rounded border-2 border-black bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-600 transition-colors"
                  title="Hapus Project"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
