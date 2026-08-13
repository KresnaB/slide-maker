'use client';

import React from 'react';
import Link from 'next/link';
import { FiSliders, FiDownload, FiFolder, FiFileText } from 'react-icons/fi';
import { downloadMarkdownTemplate } from '@/lib/templates';

interface HeaderProps {
  currentTab?: 'upload' | 'editor' | 'history';
  onTabChange?: (tab: 'upload' | 'editor' | 'history') => void;
  slideCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab = 'upload', onTabChange, slideCount }) => {
  return (
    <header className="w-full bg-[#FEF08A] border-b-4 border-black px-4 py-3 shadow-[0_4px_0_#000]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-black text-xl sm:text-2xl tracking-tight text-black no-underline hover:opacity-90 transition-opacity"
        >
          <span className="bg-black text-white px-2.5 py-1 rounded border-2 border-black shadow-[2px_2px_0_#FF71CE]">
            SLIDE
          </span>
          <span className="bg-[#FF71CE] text-black px-2.5 py-1 rounded border-2 border-black shadow-[2px_2px_0_#000]">
            MAKER
          </span>
        </Link>

        {/* Navigation Tabs (if in app) */}
        {onTabChange && (
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border-[3px] border-black shadow-[3px_3px_0_#000]">
            <button
              onClick={() => onTabChange('upload')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-extrabold text-sm transition-all cursor-pointer ${
                currentTab === 'upload'
                  ? 'bg-[#01CDFE] text-black border-2 border-black shadow-[2px_2px_0_#000]'
                  : 'text-gray-700 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <FiFileText className="text-base" />
              <span>Input .MD</span>
            </button>

            <button
              onClick={() => onTabChange('editor')}
              disabled={!slideCount}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-extrabold text-sm transition-all ${
                currentTab === 'editor'
                  ? 'bg-[#A3E635] text-black border-2 border-black shadow-[2px_2px_0_#000] cursor-pointer'
                  : slideCount
                  ? 'text-gray-700 hover:bg-gray-100 border-2 border-transparent cursor-pointer'
                  : 'text-gray-400 opacity-60 cursor-not-allowed border-2 border-transparent'
              }`}
            >
              <FiSliders className="text-base" />
              <span>Slide Editor</span>
              {slideCount ? (
                <span className="ml-1 px-2 py-0.5 bg-black text-white text-xs rounded-full font-mono">
                  {slideCount}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => onTabChange('history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-extrabold text-sm transition-all cursor-pointer ${
                currentTab === 'history'
                  ? 'bg-[#C084FC] text-black border-2 border-black shadow-[2px_2px_0_#000]'
                  : 'text-gray-700 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <FiFolder className="text-base" />
              <span>Riwayat</span>
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadMarkdownTemplate()}
            className="neo-btn neo-btn-white text-sm py-2 px-4 shadow-[3px_3px_0_#000]"
            title="Download Template File .md"
          >
            <FiDownload className="text-base" />
            <span>Download Template .md</span>
          </button>
        </div>
      </div>
    </header>
  );
};
