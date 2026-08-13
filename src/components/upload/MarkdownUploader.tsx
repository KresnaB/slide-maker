'use client';

import React, { useState } from 'react';
import { FiUploadCloud, FiFileText, FiZap, FiDownload } from 'react-icons/fi';
import { DEFAULT_TEMPLATE_MARKDOWN, downloadMarkdownTemplate } from '@/lib/templates';

interface MarkdownUploaderProps {
  initialMarkdown?: string;
  onGenerate: (markdown: string) => void;
}

export const MarkdownUploader: React.FC<MarkdownUploaderProps> = ({
  initialMarkdown = '',
  onGenerate,
}) => {
  const [markdown, setMarkdown] = useState<string>(initialMarkdown || DEFAULT_TEMPLATE_MARKDOWN);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
      alert('Harap upload file bertipe .md atau .txt');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setMarkdown(content);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const slideCount = markdown.split(/\n\s*---\s*\n/).filter(Boolean).length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 py-6 px-3 sm:px-0">
      {/* Hero Banner Card */}
      <div className="bg-[#FEF08A] border-4 border-black p-6 sm:p-9 rounded-2xl shadow-[6px_6px_0_#000] text-center flex flex-col items-center gap-5">
        <div className="flex flex-col items-center gap-3">
          <span className="neo-badge bg-[#A3E635]">Generator Slideshow Serba Praktis</span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight leading-snug my-2">
            Ubah File{' '}
            <span className="inline-badge bg-[#FF71CE] text-black px-3 py-1 rounded-lg border-2 border-black shadow-[3px_3px_0_#000]">
              .MD
            </span>{' '}
            Menjadi Konten Slideshow
          </h1>

          <p className="text-gray-800 max-w-2xl font-medium text-sm sm:text-base leading-relaxed px-2">
            Buat konten visual slideshow modern untuk <strong>TikTok, Instagram Carousel, Facebook, YouTube</strong> dan lainnya dengan mudah. Pilih style seperti Neobrutalism, Minimalis, Bento, Glassmorphism, Retro &amp; lainnya!
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <button
            onClick={() => downloadMarkdownTemplate()}
            className="neo-btn neo-btn-white text-sm py-2.5 px-5"
          >
            <FiDownload className="text-base" /> Download Template .md
          </button>
          <button
            onClick={() => setMarkdown(DEFAULT_TEMPLATE_MARKDOWN)}
            className="neo-btn neo-btn-cyan text-sm py-2.5 px-5"
          >
            <FiFileText className="text-base" /> Isi Contoh Markdown
          </button>
        </div>
      </div>

      {/* Main Input Card */}
      <div className="neo-card p-6 sm:p-8 bg-white flex flex-col gap-6">
        {/* Dropzone Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-[3px] border-dashed border-black p-8 sm:p-10 rounded-2xl text-center cursor-pointer transition-all ${
            dragActive
              ? 'bg-[#A3E635] shadow-[5px_5px_0_#000]'
              : 'bg-[#FFFBEB] hover:bg-[#FEF9C3]'
          }`}
        >
          <input
            type="file"
            accept=".md,.txt"
            id="md-file-input"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
          <label htmlFor="md-file-input" className="cursor-pointer flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-[#FEF08A] border-2 border-black flex items-center justify-center shadow-[2px_2px_0_#000]">
              <FiUploadCloud className="text-2xl text-black" />
            </div>
            <span className="font-extrabold text-base sm:text-lg text-black">
              Tarik &amp; Lepas File .MD di Sini atau <span className="underline text-[#D97706]">Pilih File</span>
            </span>
            <span className="text-xs sm:text-sm text-gray-700 font-semibold bg-white px-3 py-1.5 rounded-lg border border-black shadow-[1px_1px_0_#000] mt-1">
              Aplikasi akan memisah slide otomatis berdasarkan separator <code>---</code>
            </span>
          </label>
        </div>

        {/* Textarea Editor Area */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <label className="font-extrabold text-base text-black flex items-center gap-2">
              <FiFileText className="text-lg text-[#01CDFE]" /> Editor Konten Markdown
            </label>
            <span className="neo-badge bg-[#FEF08A] text-xs px-3 py-1">
              {slideCount} Slide Terdeteksi
            </span>
          </div>

          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={12}
            className="neo-textarea font-mono text-sm sm:text-base leading-relaxed p-4 sm:p-5 border-[3px] border-black shadow-[4px_4px_0_#000] rounded-xl"
            placeholder="Tulis atau paste isi file markdown di sini... Gunakan '---' untuk memisah antar slide."
          />
        </div>

        {/* Action Button */}
        <button
          onClick={() => onGenerate(markdown)}
          disabled={!markdown.trim()}
          className="neo-btn neo-btn-green w-full py-4 px-6 text-base sm:text-lg font-black tracking-wide shadow-[5px_5px_0_#000] hover:shadow-[7px_7px_0_#000] cursor-pointer mt-2"
        >
          <FiZap className="text-xl" /> Buat Slideshow Konten Sekarang
        </button>
      </div>
    </div>
  );
};
