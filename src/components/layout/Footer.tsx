'use client';

import React from 'react';
import { FiHeart, FiShield, FiCpu, FiGithub } from 'react-icons/fi';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-black text-white border-t-4 border-black py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="bg-[#FEF08A] text-black px-2 py-0.5 rounded font-black border border-black">
            SLIDE MAKER
          </span>
          <span>— Pembuat Slideshow Gambar Media Sosial dari File Markdown</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-300">
          <span className="flex items-center gap-1">
            <FiShield className="text-[#A3E635]" /> 100% Simpan di Lokal (Tanpa Database)
          </span>
          <span className="flex items-center gap-1">
            <FiCpu className="text-[#01CDFE]" /> Powering TikTok, IG & FB Content
          </span>
        </div>
      </div>
    </footer>
  );
};
