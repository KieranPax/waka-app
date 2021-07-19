/* eslint-disable camelcase */

export interface WaniKaniKReading {
  reading: string;
  type: string;
  primary: boolean;
  accepted_answer: boolean;
}
export interface WaniKaniVReading {
  reading: string;
  primary: boolean;
  accepted_answer: boolean;
}
export interface WaniKaniMeaning {
  meaning: string;
  primary: boolean;
  accepted_answer: boolean;
}
export interface WaniKaniAuxMeaning {
  type: string;
  meaning: string;
}
export interface WaniKaniCharacterImage {
  url: string;
  metadata: {
    inline_styles?: boolean;
    color?: string;
    dimensions?: string;
    style_name?: string;
  };
  content_type: string;
}
export interface WaniKaniPronunciationAudio {
  url: string;
  content_type: 'audio/ogg' | 'audio/mpeg';
  metadata: {
    gender: 'male' | 'female';
    source_id: number;
    voice_actor_id: number;
    voice_actor_name: string;
    voice_description: string;
  };
}

export interface WaniKaniRadical {
  created_at: string;
  level: number;
  slug: string;
  hidden_at: number | null;
  document_url: string;
  characters: string;
  character_images: WaniKaniCharacterImage[];
  meanings: WaniKaniMeaning[];
  auxiliary_meanings: WaniKaniAuxMeaning[];
  amalgamation_subject_ids: number[];
  meaning_mnemonic: string;
  lesson_position: number;
  spaced_repetition_system_id: number;
}

export interface WaniKaniKanji {
  created_at: string;
  level: number;
  slug: string;
  hidden_at: number | null;
  document_url: string;
  characters: string;
  meanings: WaniKaniMeaning[];
  auxiliary_meanings: WaniKaniAuxMeaning[];
  readings: WaniKaniKReading[];
  component_subject_ids: number[];
  amalgamation_subject_ids: number[];
  visually_similar_subject_ids: number[];
  meaning_mnemonic: string;
  meaning_hint: string;
  reading_mnemonic: string;
  reading_hint: string;
  lesson_position: number;
  spaced_repetition_system_id: number;
}

export interface WaniKaniVocab {
  created_at: string;
  level: number;
  slug: string;
  hidden_at: number | null;
  document_url: string;
  characters: string;
  meanings: WaniKaniMeaning[];
  auxiliary_meanings: WaniKaniAuxMeaning[];
  readings: WaniKaniVReading[];
  parts_of_speech: string[];
  component_subject_ids: number[];
  meaning_mnemonic: string;
  reading_mnemonic: string;
  context_sentences: { en: string; ja: string }[];
  pronunciation_audios: WaniKaniPronunciationAudio[];
  lesson_position: number;
  spaced_repetition_system_id: number;
}

export interface WaniKaniImport<T> {
  id: number;
  object: string;
  url: string;
  data_updated_at: string;
  data: T;
}

export type WaniKaniImportRadical = WaniKaniImport<WaniKaniRadical>;
export type WaniKaniImportKanji = WaniKaniImport<WaniKaniKanji>;
export type WaniKaniImportVocab = WaniKaniImport<WaniKaniVocab>;
export type WaniKaniImportAny = WaniKaniImport<
  WaniKaniRadical | WaniKaniKanji | WaniKaniVocab
>;

export interface WaniKaniFetch<T> {
  url: string;
  object: string;
  total_count: number;
  pages: {
    next_url: string | null;
    previous_url: string | null;
    per_page: number;
  };
  data_updated_at: string;
  data: T[];
}
