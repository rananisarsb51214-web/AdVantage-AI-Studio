
export type Platform = 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'website';

export interface AdProject {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  headline: string;
  bodyText: string;
  callToAction: string;
  platform: Platform;
  status: 'draft' | 'published';
  createdAt: number;
}

export interface Asset {
  id: string;
  url: string;
  type: 'character' | 'element' | 'background';
  name: string;
}

export interface AdSuggestion {
  headline: string;
  caption: string;
  cta: string;
  colorPalette: string[];
}

export interface BrandSettings {
  name: string;
  mission: string;
  values: string[];
  usp: string;
  colors: string[];
  fonts: {
    primary: string;
    secondary: string;
  };
  voice: string;
}
