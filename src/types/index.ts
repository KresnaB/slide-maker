export type AspectRatioId =
  | '1:1'
  | '9:16-story'
  | '9:16-tiktok'
  | '3:4-tiktok'
  | '4:5'
  | '16:9'
  | '16:9-twitter'
  | '2:3'
  | 'custom';

export interface AspectRatioPreset {
  id: AspectRatioId;
  name: string;
  category: string;
  ratio: number; // width / height
  width: number;
  height: number;
  label: string;
}

export type ThemeId =
  | 'neobrutalism'
  | 'brutalism'
  | 'minimalist'
  | 'hand-drawn'
  | 'retro'
  | 'flat'
  | 'bento'
  | 'glassmorphism'
  | 'gradient';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  fontFamilyHeading: string;
  fontFamilyBody: string;
  bgStyle: string; // background CSS
  cardStyle: string;
  textColor: string;
  headingColor: string;
  accentColor: string;
  borderStyle: string;
  shadowStyle: string;
  previewColor: string;
}

export type ElementType = 'text' | 'shape' | 'icon' | 'image';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number; // percentage 0-100 or px offset
  y: number;
  zIndex: number;
  rotation?: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number; // in px
  fontFamily?: string;
  fontWeight?: string | number;
  color: string;
  textAlign?: 'left' | 'center' | 'right';
  isHeading?: boolean;
}

export type ShapeType =
  | 'square'
  | 'circle'
  | 'rounded-square'
  | 'star'
  | 'triangle'
  | 'arrow'
  | 'badge'
  | 'quote-box';

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  width: number;
  height: number;
  fillColor: string;
  strokeColor?: string;
  strokeWidth?: number;
  borderRadius?: number;
}

export interface IconElement extends BaseElement {
  type: 'icon';
  iconName: string; // icon identifier
  iconSet: string;
  size: number;
  color: string;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  width: number;
  height: number;
  alt?: string;
}

export type SlideElement = TextElement | ShapeElement | IconElement | ImageElement;

export interface SlideData {
  id: string;
  title: string;
  subtitle?: string;
  bullets?: string[];
  elements: SlideElement[];
  bgColor?: string;
  customStyle?: Partial<ThemeConfig>;
}

export interface WatermarkConfig {
  enabled: boolean;
  text: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  fontSize: number;
  opacity: number;
  color: string;
  fontFamily?: string;
}

export interface SlideshowProject {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  rawMarkdown: string;
  slides: SlideData[];
  theme: ThemeId;
  aspectRatio: AspectRatioId;
  customWidth?: number;
  customHeight?: number;
  watermark: WatermarkConfig;
}

export type ExportFormat = 'png' | 'jpeg' | 'svg';
