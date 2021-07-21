/* eslint-disable camelcase */

export type ISO8601Date = string; // {yyyy}-{mm}-{dd}T{hh}:{mm}:{ss}.{ms?}Z

/* ----------------------  WK Subject  ---------------------- */

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

export interface WaniKaniSubject {
  created_at: ISO8601Date;
  level: number;
  slug: string;
  hidden_at: ISO8601Date | null;
  document_url: string;
  characters: string;
  meanings: WaniKaniMeaning[];
  auxiliary_meanings: WaniKaniAuxMeaning[];
  meaning_mnemonic: string;
  lesson_position: number;
  spaced_repetition_system_id: number;
}

export interface WaniKaniRadical extends WaniKaniSubject {
  character_images: WaniKaniCharacterImage[];
  amalgamation_subject_ids: number[];
}

export interface WaniKaniKanji extends WaniKaniSubject {
  readings: WaniKaniKReading[];
  component_subject_ids: number[];
  amalgamation_subject_ids: number[];
  visually_similar_subject_ids: number[];
  meaning_hint: string;
  reading_mnemonic: string;
  reading_hint: string;
}

export interface WaniKaniVocab extends WaniKaniSubject {
  readings: WaniKaniVReading[];
  parts_of_speech: string[];
  component_subject_ids: number[];
  reading_mnemonic: string;
  context_sentences: { en: string; ja: string }[];
  pronunciation_audios: WaniKaniPronunciationAudio[];
}

/* ----------------------  WK Assignment  ---------------------- */

export interface WaniKaniAssignment {
  created_at: ISO8601Date | null;
  available_at: ISO8601Date | null; // next added to review queue
  unlocked_at: ISO8601Date | null;
  started_at: ISO8601Date | null; // finished lesson
  passed_at: ISO8601Date | null; // SRS = 5
  burned_at: ISO8601Date | null; // SRS = 9
  resurrected_at: ISO8601Date | null; //
  hidden: boolean;
  srs_stage: number;
  subject_id: number;
  subject_type: string;
}

/* ----------------------  WK Imports  ---------------------- */

export interface WaniKaniImport<T> {
  id: number;
  object: string;
  url: string;
  data_updated_at: ISO8601Date;
  data: T;
}

export type WaniKaniImportRadical = WaniKaniImport<WaniKaniRadical>;
export type WaniKaniImportKanji = WaniKaniImport<WaniKaniKanji>;
export type WaniKaniImportVocab = WaniKaniImport<WaniKaniVocab>;
export type WaniKaniImportSubject = WaniKaniImport<
  WaniKaniRadical | WaniKaniKanji | WaniKaniVocab
>;

export type WaniKaniImportAssignment = WaniKaniImport<WaniKaniAssignment>;

export interface WaniKaniFetch<T> {
  url: string;
  object: string;
  total_count: number;
  pages: {
    next_url: string | null;
    previous_url: string | null;
    per_page: number;
  };
  data_updated_at: ISO8601Date;
  data: T[];
}

/* ----------------------  WK Fetch Filters  ---------------------- */

export interface AssignmentFilters {
  available_after?: string;
  available_before?: string;
  burned?: string;
  hidden?: string;
  ids?: string;
  immediately_available_for_lessons?: string;
  immediately_available_for_review?: string;
  in_review?: string;
  levels?: string;
  srs_stages?: string;
  started?: string;
  subject_ids?: string;
  subject_types?: string;
  unlocked?: string;
  updated_after?: string;
}

export interface SubjectFilters {
  ids?: string;
  types?: string;
  slugs?: string;
  levels?: string;
  hidden?: string;
  updated_after?: string;
}
