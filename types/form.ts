export interface SongInfo {
  artistReference: string;
  overallTone: string;
  speed: string;
  videoLength: number;
  ageAudience: string;
  additionalNotes: string;
}

export interface AdvancedOptions {
  genres: string[];
  vocalStyles: string[];
  moods: string[];
  instruments: string[];
  effects: string[];
}

export interface MediaInfo {
  uploadType: 'images' | 'ai' | 'random';
  imageDuration: number;
  numImages: number;
  keywords: string;
  uploadedUrls: string[];
}

export interface ErrorsMap {
  [key: string]: string;
}