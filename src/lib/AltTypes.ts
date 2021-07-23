import { WKFetchItem, WKKanji, WKRadical, WKSubject, WKVocab } from './WKAPI';

export type Meaning = { t: string; a: number };
// a: 0 = not accepted; 1 = auxiliary; 2 = extra meaning; 3 = primary
export type KReading = { r: string; a: number; t: 'k' | 'o' | 'n' };
export type VReading = { r: string; a: number };
// a: 0 = not accepted; 1 = extra reading; 2 = primary

export interface SSubject {
  data?: WKRadical;
  id: number;
  type: 'r' | 'k' | 'v';
  char: string;
  meanings: Meaning[];
  mnemonics: string[];
  level: number;
  pos: number;
  srs: number;
}

export interface SRadical extends SSubject {
  name: string;
}

export interface SKanji extends SSubject {
  readings: KReading[];
  comp: number[];
}

export interface SVocab extends SSubject {
  readings: VReading[];
  comp: number[];
}

function SimplifyRadical (item: WKFetchItem<WKRadical>) {
  const o = {
    id: item.id,
    type: item.object.charAt(0),
    name: item.data.slug,
    char:
      item.data.characters ||
      '@' +
        item.data.character_images.find(
          i => i.content_type === 'image/svg+xml' && !i.metadata.inline_styles
        )?.url,
    meanings: [
      ...item.data.meanings.map(i => ({
        t: i.meaning,
        a: i.accepted_answer ? (i.primary ? 3 : 2) : 0
      })),
      ...item.data.auxiliary_meanings.map(i => ({
        t: i.meaning,
        a: i.type === 'whitelist' ? 1 : 0
      }))
    ] as Meaning[],
    mnemonics: [item.data.meaning_mnemonic],
    level: item.data.level,
    pos: item.data.lesson_position,
    srs: item.data.spaced_repetition_system_id
  };
  return o as SRadical;
}

function SimplifyKanji (item: WKFetchItem<WKKanji>) {
  const o = {
    id: item.id,
    type: item.object.charAt(0),
    char: item.data.characters,
    meanings: [
      ...item.data.meanings.map(i => ({
        t: i.meaning,
        a: i.accepted_answer ? (i.primary ? 3 : 2) : 0
      })),
      ...item.data.auxiliary_meanings.map(i => ({
        t: i.meaning,
        a: i.type === 'whitelist' ? 1 : 0
      }))
    ] as Meaning[],
    readings: item.data.readings.map(i => ({
      r: i.reading,
      a: i.accepted_answer ? (i.primary ? 2 : 1) : 0,
      t: i.type.charAt(0)
    })) as KReading[],
    comp: item.data.component_subject_ids,
    mnemonics: [
      item.data.meaning_mnemonic,
      item.data.reading_mnemonic,
      item.data.meaning_hint,
      item.data.reading_hint
    ],
    level: item.data.level,
    pos: item.data.lesson_position,
    srs: item.data.spaced_repetition_system_id
  };
  return o as SKanji;
}

function SimplifyVocab (item: WKFetchItem<WKVocab>) {
  const o = {
    id: item.id,
    type: item.object.charAt(0),
    char: item.data.characters,
    meanings: [
      ...item.data.meanings.map(i => ({
        t: i.meaning,
        a: i.accepted_answer ? (i.primary ? 3 : 2) : 0
      })),
      ...item.data.auxiliary_meanings.map(i => ({
        t: i.meaning,
        a: i.type === 'whitelist' ? 1 : 0
      }))
    ] as Meaning[],
    readings: item.data.readings.map(i => ({
      r: i.reading,
      a: i.accepted_answer ? (i.primary ? 2 : 1) : 0
    })) as VReading[],
    comp: item.data.component_subject_ids,
    mnemonics: [item.data.meaning_mnemonic, item.data.reading_mnemonic],
    level: item.data.level,
    pos: item.data.lesson_position,
    srs: item.data.spaced_repetition_system_id
  };
  return o as SVocab;
}

export function SimplifySubject (
  item: WKFetchItem<WKSubject>
): SSubject {
  // simplify means its just enough data to generate questions / subject level pages
  if (item.object === 'vocabulary') {
    return SimplifyVocab(item as WKFetchItem<WKVocab>);
  }
  if (item.object === 'kanji') {
    return SimplifyKanji(item as WKFetchItem<WKKanji>);
  }
  if (item.object === 'radical') {
    return SimplifyRadical(item as WKFetchItem<WKRadical>);
  }
  throw Error('Passed non-subject into SimplifySubject');
}
