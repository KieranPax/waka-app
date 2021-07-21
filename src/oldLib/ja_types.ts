import {
  WaniKaniRadical,
  WaniKaniKanji,
  WaniKaniVocab,
  WaniKaniImportRadical,
  WaniKaniImportKanji,
  WaniKaniImportVocab,
  WaniKaniPronunciationAudio
} from './wk_types';

/* types */

type WKReadingType = 'o' | 'k' | 'n';

export type KReading = [string, WKReadingType, number]; // reading (hirigana); type; { 0 -> primary; 1 -> accepted }
export type VReading = [string, number]; // reading (hirigana); { 0 -> primary; 1 -> accepted }
export type Meaning = [string, number]; // meaning; { 0 -> primary; 1 -> accepted; 2 -> display }

type CharacterImage = undefined | string; // .svg file path rel to https://cdn.wanikani.com [24 -> ]

export interface Radical {
  id: number;
  lvl: number;
  name: string; // slug
  char: string; // Unicode kanji equiv. (where possible)
  img: CharacterImage; //  : character_images[ svg w/ inline_styles ]
  m: Meaning[];
  mM: string; //  : meaning_mnemonic
  pos: number; //  : lesson_position
  amal: number[]; //  : amalgamation_subject_ids
}

export interface Kanji {
  id: number;
  lvl: number;
  name: string; // slug
  char: string;
  m: Meaning[];
  mM: string; //  : meaning_mnemonic
  r: KReading[];
  rM: string; //  : reading_mnemonic
  pos: number; //  : lesson_position
  comp: number[]; //  : component_subject_ids
  amal: number[]; //  : amalgamation_subject_ids
}

export interface Vocab {
  id: number;
  lvl: number;
  name: string; // slug
  char: string;
  m: Meaning[];
  mM: string; //  : meaning_mnemonic
  r: VReading[];
  rM: string; //  : reading_mnemonic
  pos: number; //  : lesson_position
  comp: number[]; //  : component_subject_ids
  lang: string; //  : parts_of_speech
  audio: [string, string][]; //  : pronunciation_audios [ '(gender)(id)(type)', https://cdn.wanikani.com/audios/{ ## } ]
}

/* --- util funcs --- */

function PrimaryRadicalImage (data: WaniKaniRadical): string {
  for (const i of data.character_images) {
    if (i.content_type.startsWith('image/svg') && !i.metadata.inline_styles) {
      return i.url;
    }
  }
  return '';
}

function PrimaryKanjiName (data: WaniKaniKanji): string {
  const s = data.meanings.find(i => i.primary);
  return s ? s.meaning : data.characters;
}

function PrimaryVocabName (data: WaniKaniVocab): string {
  const s = data.meanings.find(i => i.primary);
  return s ? s.meaning : data.characters;
}

function ConvRMeanings (data: WaniKaniRadical): Meaning[] {
  const l = [];
  for (const m of data.meanings) {
    l.push([
      m.meaning,
      0b100 + (m.accepted_answer ? 2 : 0) + (m.primary ? 1 : 0)
    ] as Meaning);
  }
  for (const m of data.auxiliary_meanings) {
    l.push([m.meaning, m.type === 'whitelist' ? 2 : 0] as Meaning);
  }
  return l;
}

function ConvKMeanings (data: WaniKaniKanji): Meaning[] {
  const l = [];
  for (const m of data.meanings) {
    l.push([
      m.meaning,
      0b100 + (m.accepted_answer ? 2 : 0) + (m.primary ? 1 : 0)
    ] as Meaning);
  }
  for (const m of data.auxiliary_meanings) {
    l.push([m.meaning, m.type === 'whitelist' ? 2 : 0] as Meaning);
  }
  return l;
}

function ConvKReadings (data: WaniKaniKanji): KReading[] {
  const l = [];
  for (const i of data.readings) {
    l.push([
      i.reading,
      i.type.charAt(0) as WKReadingType,
      (i.accepted_answer ? 2 : 0) + (i.primary ? 1 : 0)
    ] as KReading);
  }
  return l;
}

function ConvVReadings (data: WaniKaniVocab): VReading[] {
  const l = [];
  for (const i of data.readings) {
    l.push([
      i.reading,
      (i.accepted_answer ? 2 : 0) + (i.primary ? 1 : 0)
    ] as VReading);
  }
  return l;
}

function ConvVMeanings (data: WaniKaniVocab): Meaning[] {
  const l = [];
  for (const m of data.meanings) {
    l.push([
      m.meaning,
      0b100 + (m.accepted_answer ? 2 : 0) + (m.primary ? 1 : 0)
    ] as Meaning);
  }
  for (const m of data.auxiliary_meanings) {
    l.push([m.meaning, m.type === 'whitelist' ? 2 : 0] as Meaning);
  }
  return l;
}

function ConvAmal (l: number[]) {
  return l.map((e, i) => e - (l[i - 1] | 0));
}

function ConvAudio (l: WaniKaniPronunciationAudio[]): [string, string][] {
  return l.map(i => [
    i.metadata.gender.charAt(0) +
      i.metadata.voice_actor_id +
      i.content_type.substring(6),
    i.url.substring(32)
  ]);
}

/* --- convert from imports --- */

export function ConvRadical (src: WaniKaniImportRadical): Radical {
  return {
    id: src.id,
    lvl: src.data.level,
    name: src.data.slug,
    char: src.data.characters,
    img: PrimaryRadicalImage(src.data),
    m: ConvRMeanings(src.data),
    mM: src.data.meaning_mnemonic,
    pos: src.data.lesson_position,
    amal: ConvAmal(src.data.amalgamation_subject_ids)
  };
}

export function ConvKanji (src: WaniKaniImportKanji): Kanji {
  return {
    id: src.id,
    lvl: src.data.level,
    name: PrimaryKanjiName(src.data),
    char: src.data.characters,
    m: ConvKMeanings(src.data),
    mM: src.data.meaning_mnemonic,
    r: ConvKReadings(src.data),
    rM: src.data.reading_mnemonic,
    pos: src.data.lesson_position,
    comp: src.data.component_subject_ids,
    amal: ConvAmal(src.data.amalgamation_subject_ids)
  };
}

export function ConvVocab (src: WaniKaniImportVocab): Vocab {
  return {
    id: src.id,
    lvl: src.data.level,
    name: PrimaryVocabName(src.data),
    char: src.data.characters,
    m: ConvVMeanings(src.data),
    mM: src.data.meaning_mnemonic,
    r: ConvVReadings(src.data),
    rM: src.data.reading_mnemonic,
    pos: src.data.lesson_position,
    comp: src.data.component_subject_ids,
    lang: src.data.parts_of_speech.join(','),
    audio: ConvAudio(src.data.pronunciation_audios)
  };
}
