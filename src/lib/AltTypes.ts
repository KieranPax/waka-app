import { WKFetchItem, WKKanji, WKRadical, WKSubject, WKVocab } from './WKAPI';

type Meaning = { t: string; a: number };
// a: 0 = not accepted; 1 = auxiliary; 2 = extra meaning; 3 = primary
type KReading = { r: string; a: number; t: 'k' | 'o' | 'n' };
type VReading = { r: string; a: number };
// a: 0 = not accepted; 1 = extra meaning; 2 = primary


export interface SSubject {
  data?: WKRadical;
  id: number;
  type: 'r' | 'k' | 'v';
  char: string;
  meanings: Meaning[];
}

export interface SRadical extends SSubject {
  name: string;
}

export interface SKanji extends SSubject {
  readings: KReading[];
  comp: number[]
}

export interface SVocab extends SSubject {
  readings: VReading[];
  comp: number[]
}

function SimplifyRadical (item: WKFetchItem<WKRadical>, min = false) {
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
    ] as Meaning[]
  };
  if (!min) Object.assign(o, { data: item.data });
  return o as SRadical;
}

function SimplifyKanji (item: WKFetchItem<WKKanji>, min = false) {
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
    comp: item.data.component_subject_ids
  };
  if (!min) Object.assign(o, { data: item.data });
  return o as SKanji;
}

function SimplifyVocab (item: WKFetchItem<WKVocab>, min = false) {
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
    comp: item.data.component_subject_ids
  };
  if (!min) Object.assign(o, { data: item.data });
  return o as SVocab;
}

export function SimplifySubject (item: WKFetchItem<WKSubject>, min = false) : SSubject {
  // simplify means its just enough data to generate questions / subject level pages
  if (item.object === 'vocabulary') {
    return SimplifyVocab(item as WKFetchItem<WKVocab>, min);
  }
  if (item.object === 'kanji') {
    return SimplifyKanji(item as WKFetchItem<WKKanji>, min);
  }
  if (item.object === 'radical') {
    return SimplifyRadical(item as WKFetchItem<WKRadical>, min);
  }
  throw Error('Passed non-subject into SimplifySubject');
}
