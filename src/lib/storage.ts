import { SlideshowProject, WatermarkConfig, ThemeId, AspectRatioId } from '@/types';

const STORAGE_KEYS = {
  PREFERENCES: 'content_generator_prefs_v1',
  HISTORY: 'content_generator_history_v1',
};

export interface UserPreferences {
  defaultTheme: ThemeId;
  defaultAspectRatio: AspectRatioId;
  watermark: WatermarkConfig;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  defaultTheme: 'neobrutalism',
  defaultAspectRatio: '1:1',
  watermark: {
    enabled: true,
    text: 'kawan.toefl',
    x: 50, // center horizontal %
    y: 92, // bottom vertical %
    fontSize: 18,
    opacity: 0.85,
    color: '#000000',
  },
};

export function getStoredPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to load preferences from localStorage', err);
    return DEFAULT_PREFERENCES;
  }
}

export function saveStoredPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const current = getStoredPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save preferences to localStorage', err);
    return DEFAULT_PREFERENCES;
  }
}

export function getProjectHistory(): SlideshowProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load project history', err);
    return [];
  }
}

export function saveProjectToHistory(project: SlideshowProject): SlideshowProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = getProjectHistory();
    const existingIndex = history.findIndex((p) => p.id === project.id);

    let updatedHistory: SlideshowProject[];
    if (existingIndex >= 0) {
      updatedHistory = [...history];
      updatedHistory[existingIndex] = { ...project, updatedAt: Date.now() };
    } else {
      updatedHistory = [{ ...project, updatedAt: Date.now() }, ...history];
    }

    // Keep max 10 projects
    if (updatedHistory.length > 10) {
      updatedHistory = updatedHistory.slice(0, 10);
    }

    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (err) {
    console.error('Failed to save project history', err);
    return [];
  }
}

export function deleteProjectFromHistory(id: string): SlideshowProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = getProjectHistory().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    return history;
  } catch (err) {
    console.error('Failed to delete project from history', err);
    return [];
  }
}

export function clearAllHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (err) {
    console.error('Failed to clear project history', err);
  }
}
