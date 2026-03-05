
export type MediaType = 'image' | 'audio' | 'video';

export interface MediaFile {
  id: string;
  name: string;
  type: MediaType;
  data: string; // Base64 data URL
}

export interface JournalEntry {
  text?: string;
  media?: MediaFile[];
}

export type Mood = 'triste' | 'neutral' | 'feliz' | 'muy-feliz' | 'excelente';

export interface PersonalDiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  text: string;
  symptoms: string[];
  mood: Mood;
  weight?: string;
  bloodPressure?: string;
  media?: MediaFile[];
}

export interface FullJournalData {
  pageEntries: {
    [key: string]: JournalEntry;
  };
  personalDiaryEntries: PersonalDiaryEntry[];
}

export interface Journal {
    id: string;
    name: string;
    isEncrypted: boolean;
    data: string | FullJournalData; // string for encrypted, object for decrypted or legacy
}

export type AllJournals = {
    [id: string]: Journal;
};

export interface PageField {
  key: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'textarea' | 'media';
  mediaTypes?: MediaType[];
}

export interface PageDefinition {
  key: string;
  title: string;
  description?: string;
  fields: PageField[];
}

export interface Chapter {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  pages: PageDefinition[];
}
