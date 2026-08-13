'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MarkdownUploader } from '@/components/upload/MarkdownUploader';
import { SlideNavigator } from '@/components/editor/SlideNavigator';
import { SlideCanvas } from '@/components/editor/SlideCanvas';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import { WatermarkEditor } from '@/components/editor/WatermarkEditor';
import { AspectRatioSelector } from '@/components/editor/AspectRatioSelector';
import { StylePanel } from '@/components/editor/StylePanel';
import { ElementToolbar } from '@/components/editor/ElementToolbar';
import { ExportModal } from '@/components/export/ExportModal';
import { HistoryPanel } from '@/components/history/HistoryPanel';

import { parseMarkdownToSlides } from '@/lib/markdownParser';
import { THEMES, ASPECT_RATIOS } from '@/lib/presets';
import {
  getStoredPreferences,
  saveStoredPreferences,
  getProjectHistory,
  saveProjectToHistory,
  deleteProjectFromHistory,
  clearAllHistory,
} from '@/lib/storage';
import {
  SlideshowProject,
  SlideData,
  SlideElement,
  ThemeId,
  AspectRatioId,
  AspectRatioPreset,
  WatermarkConfig,
} from '@/types';

import { FiDownload, FiMaximize2, FiLayers, FiSettings, FiSmile } from 'react-icons/fi';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'editor' | 'history'>('upload');

  // Application state
  const [projectTitle, setProjectTitle] = useState<string>('Konten Slideshow Baru');
  const [rawMarkdown, setRawMarkdown] = useState<string>('');
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Styling & Preferences State
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('neobrutalism');
  const [currentAspectRatioId, setCurrentAspectRatioId] = useState<AspectRatioId>('3:4-tiktok');
  const [customWidth, setCustomWidth] = useState<number>(1080);
  const [customHeight, setCustomHeight] = useState<number>(1440);
  const [watermark, setWatermark] = useState<WatermarkConfig>({
    enabled: true,
    text: 'Kawan TOEFL',
    x: 50,
    y: 92,
    fontSize: 22,
    opacity: 0.9,
    color: '#1A1A2E',
  });

  // Modal & History state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [history, setHistory] = useState<SlideshowProject[]>([]);

  // Load preferences & history on mount
  useEffect(() => {
    const prefs = getStoredPreferences();
    if (prefs) {
      setCurrentThemeId(prefs.defaultTheme || 'neobrutalism');
      setCurrentAspectRatioId(prefs.defaultAspectRatio || '1:1');
      if (prefs.watermark) setWatermark(prefs.watermark);
    }
    setHistory(getProjectHistory());
  }, []);

  // Save preferences when watermark or theme changes
  const updateWatermark = (newWm: WatermarkConfig) => {
    setWatermark(newWm);
    saveStoredPreferences({ watermark: newWm });
  };

  const updateTheme = (newTheme: ThemeId) => {
    setCurrentThemeId(newTheme);
    saveStoredPreferences({ defaultTheme: newTheme });
  };

  const updateAspectRatio = (ratio: AspectRatioId, w?: number, h?: number) => {
    setCurrentAspectRatioId(ratio);
    if (w) setCustomWidth(w);
    if (h) setCustomHeight(h);
    saveStoredPreferences({ defaultAspectRatio: ratio });
  };

  // Generate slideshow from markdown text
  const handleGenerateFromMarkdown = (md: string) => {
    const ratio: AspectRatioPreset =
      currentAspectRatioId === 'custom'
        ? {
            ...(ASPECT_RATIOS.find((r) => r.id === 'custom') || ASPECT_RATIOS[0]),
            ratio: customWidth / customHeight,
            width: customWidth,
            height: customHeight,
          }
        : ASPECT_RATIOS.find((r) => r.id === currentAspectRatioId) || ASPECT_RATIOS[0];

    const parsedSlides = parseMarkdownToSlides(md, ratio);
    if (parsedSlides.length === 0) {
      alert('Markdown tidak valid atau kosong. Harap periksa kembali.');
      return;
    }

    setRawMarkdown(md);
    setSlides(parsedSlides);
    setActiveSlideIndex(0);
    setSelectedElementId(null);
    setActiveTab('editor');

    // Extract title from first slide if available
    const firstTitle = parsedSlides[0]?.title || 'Konten Slideshow';
    setProjectTitle(firstTitle);

    // Save to history
    const project: SlideshowProject = {
      id: `proj-${Date.now()}`,
      title: firstTitle,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      rawMarkdown: md,
      slides: parsedSlides,
      theme: currentThemeId,
      aspectRatio: currentAspectRatioId,
      customWidth,
      customHeight,
      watermark,
    };
    const updatedHistory = saveProjectToHistory(project);
    setHistory(updatedHistory);
  };

  // Slide CRUD Actions
  const handleAddSlide = () => {
    const newSlide: SlideData = {
      id: `slide-${Date.now()}`,
      title: `Slide ${slides.length + 1}`,
      elements: [
        {
          id: `elem-heading-${Date.now()}`,
          type: 'text',
          content: `Judul Slide ${slides.length + 1}`,
          x: 50,
          y: 25,
          fontSize: 40,
          fontWeight: 'bold',
          color: 'inherit',
          textAlign: 'center',
          isHeading: true,
          zIndex: 10,
        },
      ],
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    setActiveSlideIndex(updated.length - 1);
  };

  const handleDuplicateSlide = (index: number) => {
    const target = slides[index];
    const duplicated: SlideData = {
      ...target,
      id: `slide-dup-${Date.now()}`,
      title: `${target.title} (Salinan)`,
      elements: target.elements.map((el) => ({ ...el, id: `elem-${Date.now()}-${Math.random()}` })),
    };
    const updated = [...slides];
    updated.splice(index + 1, 0, duplicated);
    setSlides(updated);
    setActiveSlideIndex(index + 1);
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) return;
    const updated = slides.filter((_, i) => i !== index);
    setSlides(updated);
    setActiveSlideIndex(Math.max(0, index - 1));
  };

  // Element Actions
  const handleAddElementToActiveSlide = (newElem: SlideElement) => {
    if (slides.length === 0) return;
    const currentSlide = slides[activeSlideIndex];
    const updatedSlide = {
      ...currentSlide,
      elements: [...currentSlide.elements, newElem],
    };
    const updatedSlides = [...slides];
    updatedSlides[activeSlideIndex] = updatedSlide;
    setSlides(updatedSlides);
    setSelectedElementId(newElem.id);
  };

  const handleUpdateElement = (updatedElem: SlideElement) => {
    if (slides.length === 0) return;
    const currentSlide = slides[activeSlideIndex];
    const updatedElements = currentSlide.elements.map((el) =>
      el.id === updatedElem.id ? updatedElem : el
    );
    const updatedSlides = [...slides];
    updatedSlides[activeSlideIndex] = { ...currentSlide, elements: updatedElements };
    setSlides(updatedSlides);
  };

  const handleUpdateElementPosition = (id: string, x: number, y: number) => {
    if (slides.length === 0) return;
    const currentSlide = slides[activeSlideIndex];
    const updatedElements = currentSlide.elements.map((el) =>
      el.id === id ? { ...el, x, y } : el
    );
    const updatedSlides = [...slides];
    updatedSlides[activeSlideIndex] = { ...currentSlide, elements: updatedElements };
    setSlides(updatedSlides);
  };

  const handleDeleteElement = (id: string) => {
    if (slides.length === 0) return;
    const currentSlide = slides[activeSlideIndex];
    const updatedElements = currentSlide.elements.filter((el) => el.id !== id);
    const updatedSlides = [...slides];
    updatedSlides[activeSlideIndex] = { ...currentSlide, elements: updatedElements };
    setSlides(updatedSlides);
    setSelectedElementId(null);
  };

  const handleMoveZIndex = (id: string, direction: 'up' | 'down') => {
    if (slides.length === 0) return;
    const currentSlide = slides[activeSlideIndex];
    const updatedElements = currentSlide.elements.map((el) => {
      if (el.id === id) {
        const newZ = direction === 'up' ? (el.zIndex || 10) + 1 : Math.max(1, (el.zIndex || 10) - 1);
        return { ...el, zIndex: newZ };
      }
      return el;
    });
    const updatedSlides = [...slides];
    updatedSlides[activeSlideIndex] = { ...currentSlide, elements: updatedElements };
    setSlides(updatedSlides);
  };

  // Load project from history
  const handleLoadProject = (project: SlideshowProject) => {
    setProjectTitle(project.title);
    setRawMarkdown(project.rawMarkdown || '');
    setSlides(project.slides || []);
    setCurrentThemeId(project.theme || 'neobrutalism');
    setCurrentAspectRatioId(project.aspectRatio || '1:1');
    if (project.watermark) setWatermark(project.watermark);
    setActiveSlideIndex(0);
    setActiveTab('editor');
  };

  // Get active theme & ratio configs
  const activeTheme = THEMES[currentThemeId] || THEMES.neobrutalism;
  const activePreset =
    ASPECT_RATIOS.find((r) => r.id === currentAspectRatioId) || ASPECT_RATIOS[0];
  const activeRatio =
    currentAspectRatioId === 'custom'
      ? { ...activePreset, ratio: customWidth / customHeight, width: customWidth, height: customHeight }
      : activePreset;

  const currentSlide = slides[activeSlideIndex] || null;
  const selectedElement =
    currentSlide?.elements.find((e) => e.id === selectedElementId) || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF5]">
      {/* App Header */}
      <Header
        currentTab={activeTab}
        onTabChange={setActiveTab}
        slideCount={slides.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-6 px-2 sm:px-4">
        {/* TAB 1: UPLOAD / MARKDOWN INPUT */}
        {activeTab === 'upload' && (
          <MarkdownUploader
            initialMarkdown={rawMarkdown}
            onGenerate={handleGenerateFromMarkdown}
          />
        )}

        {/* TAB 2: SLIDE EDITOR */}
        {activeTab === 'editor' && slides.length > 0 && (
          <div className="max-w-7xl mx-auto flex flex-col gap-6 py-2 px-2 sm:px-0">
            {/* Editor Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border-[3px] border-black shadow-[5px_5px_0_#000]">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-sm text-gray-700 hidden sm:inline">Project:</span>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="neo-input py-1.5 px-3 text-sm sm:text-base font-black border-2 border-black max-w-[240px] sm:max-w-[360px]"
                  placeholder="Nama Project Slideshow"
                />
                <span className="neo-badge text-xs bg-[#FEF08A] px-3 py-1">
                  {slides.length} Slide
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="neo-btn neo-btn-green text-sm sm:text-base py-2.5 px-5 shadow-[4px_4px_0_#000]"
                >
                  <FiDownload className="text-xl" /> Ekspor &amp; Batch Download
                </button>
              </div>
            </div>

            {/* 3-Column Responsive Editor Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Slide Navigator (3 cols) */}
              <div className="lg:col-span-3">
                <SlideNavigator
                  slides={slides}
                  activeSlideIndex={activeSlideIndex}
                  onSelectSlide={setActiveSlideIndex}
                  onAddSlide={handleAddSlide}
                  onDuplicateSlide={handleDuplicateSlide}
                  onDeleteSlide={handleDeleteSlide}
                />
              </div>

              {/* Middle Column: Interactive Slide Canvas (6 cols) */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center bg-white p-6 sm:p-8 rounded-2xl border-[3px] border-black shadow-[6px_6px_0_#000] min-h-[540px]">
                {currentSlide && (
                  <SlideCanvas
                    slide={currentSlide}
                    theme={activeTheme}
                    aspectRatio={activeRatio}
                    watermark={watermark}
                    selectedElementId={selectedElementId}
                    onSelectElement={setSelectedElementId}
                    onUpdateElementPosition={handleUpdateElementPosition}
                    onUpdateWatermarkPosition={(x, y) => updateWatermark({ ...watermark, x, y })}
                  />
                )}
              </div>

              {/* Right Column: Controls & Inspector (3 cols) */}
              <div className="lg:col-span-3 flex flex-col gap-4 max-h-[82vh] overflow-y-auto pr-2 pb-4">
                {/* Element Toolbar */}
                <ElementToolbar onAddElement={handleAddElementToActiveSlide} />

                {/* Selected Element Inspector */}
                <PropertiesPanel
                  selectedElement={selectedElement}
                  onUpdateElement={handleUpdateElement}
                  onDeleteElement={handleDeleteElement}
                  onMoveZIndex={handleMoveZIndex}
                />

                {/* Aspect Ratio Selector */}
                <AspectRatioSelector
                  currentRatio={currentAspectRatioId}
                  customWidth={customWidth}
                  customHeight={customHeight}
                  onChange={updateAspectRatio}
                />

                {/* Theme Style Selector */}
                <StylePanel
                  currentTheme={currentThemeId}
                  onChangeTheme={updateTheme}
                />

                {/* Watermark Settings */}
                <WatermarkEditor
                  watermark={watermark}
                  onChange={updateWatermark}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === 'history' && (
          <HistoryPanel
            history={history}
            onLoadProject={handleLoadProject}
            onDeleteProject={(id) => setHistory(deleteProjectFromHistory(id))}
            onClearHistory={() => {
              clearAllHistory();
              setHistory([]);
            }}
          />
        )}
      </main>

      {/* Export & Batch Download Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        slides={slides}
        activeSlideIndex={activeSlideIndex}
        theme={activeTheme}
        aspectRatio={activeRatio}
        watermark={watermark}
      />

      {/* App Footer */}
      <Footer />
    </div>
  );
}
