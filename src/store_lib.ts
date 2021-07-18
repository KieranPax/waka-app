import zlib from 'zlib';
import token from '@/api_token';
import {
  WaniKaniImportRadical,
  WaniKaniImportKanji,
  WaniKaniImportVocab,
  WaniKaniSubjectFetch
} from '@/wk_types';
import {
  ConvRadical,
  ConvKanji,
  ConvVocab,
  Radical,
  Kanji,
  Vocab
} from '@/ja_types';

const Storage = new (class StorageHandler {
  async get (key: string): Promise<string | undefined> {
    const val = window.localStorage.getItem(key);
    if (!val) return;
    return val;
  }

  async getJSON<T> (key: string): Promise<T | undefined> {
    const val = window.localStorage.getItem(key);
    if (!val) return;
    return JSON.parse(val);
  }

  async set (key: string, value: string): Promise<string> {
    window.localStorage.setItem(key, value);
    return value;
  }

  async setJSON (key: string, value: unknown): Promise<string> {
    const storeVal = JSON.stringify(value);
    window.localStorage.setItem(key, storeVal);
    return storeVal;
  }

  async remove (key: string): Promise<void> {
    return window.localStorage.removeItem(key);
  }
})();

const deflate = (buffer: string): Promise<string> =>
  new Promise((resolve, reject) =>
    zlib.deflate(buffer, (e, b) => {
      e ? reject(e) : resolve(b.toString('base64'));
    })
  );

const inflate = (buffer: string): Promise<string> =>
  new Promise((resolve, reject) =>
    zlib.inflate(
      new Uint8Array(
        atob(buffer)
          .split('')
          .map(c => c.charCodeAt(0))
      ),
      (e, b: Buffer) => {
        e ? reject(e) : resolve(b.toString('utf-8'));
      }
    )
  );

const ffetch = (a: string, b?: RequestInit) => {
  console.log('FETCH : ', a, b);
  return fetch(a, b);
};

const baseURL = 'https://api.wanikani.com/v2/';
function GenerateUrl (rel: string, params: { [index: string]: string }) {
  const parsedParams = Object.entries(params)
    .map(([a, b]) => a + '=' + b)
    .join('&');
  return `${baseURL}${rel}${parsedParams ? '?' + parsedParams : ''}`;
}

async function FetchOnlineWKRadicals (): Promise<WaniKaniImportRadical[]> {
  const l: WaniKaniImportRadical[][] = [];
  let url: string | null = GenerateUrl('subjects', { types: 'radical' });
  while (url) {
    const delay = new Promise(resolve => setTimeout(resolve, 1000));

    const res = await ffetch(url, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token }
    });
    if (res.status !== 200) {
      throw Error('STATUS CODE ' + res.status + ' -> ' + res.statusText);
    }

    const j: WaniKaniSubjectFetch = await res.json();
    url = j.pages.next_url;
    l.push(j.data as WaniKaniImportRadical[]);

    if (url) await delay;
  }
  return l.flat();
}

async function FetchOnlineWKKanji (): Promise<WaniKaniImportKanji[]> {
  const l: WaniKaniImportKanji[][] = [];
  let url: string | null = GenerateUrl('subjects', { types: 'kanji' });
  while (url) {
    const delay = new Promise(resolve => setTimeout(resolve, 1000));

    const res = await ffetch(url, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token }
    });
    if (res.status !== 200) {
      throw Error('STATUS CODE ' + res.status + ' -> ' + res.statusText);
    }

    const j: WaniKaniSubjectFetch = await res.json();
    url = j.pages.next_url;
    l.push(j.data as WaniKaniImportKanji[]);

    if (url) await delay;
  }
  return l.flat();
}

async function FetchOnlineWKVocab (): Promise<WaniKaniImportVocab[]> {
  const l: WaniKaniImportVocab[][] = [];
  let url: string | null = GenerateUrl('subjects', { types: 'vocabulary' });
  while (url) {
    const delay = new Promise(resolve => setTimeout(resolve, 1000));

    const res = await ffetch(url, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token }
    });
    if (res.status !== 200) {
      throw Error('STATUS CODE ' + res.status + ' -> ' + res.statusText);
    }

    const j: WaniKaniSubjectFetch = await res.json();
    url = j.pages.next_url;
    l.push(j.data as WaniKaniImportVocab[]);

    if (url) await delay;
  }
  return l.flat();
}

const CollectOnlineWKRadicals = async () =>
  (await FetchOnlineWKRadicals()).map(ConvRadical);
const CollectOnlineWKKanji = async () =>
  (await FetchOnlineWKKanji()).map(ConvKanji);
const CollectOnlineWKVocab = async () =>
  (await FetchOnlineWKVocab()).map(ConvVocab);

export enum LocalStoreNames {
  radical = 'radicalStore',
  kanji = 'kanjiStore',
  vocab = 'vocabStore'
}

export async function ResetLocalStore (v: LocalStoreNames[]): Promise<void> {
  for (const key of v) await Storage.remove(key);
}

class EXStore<T> {
  vals: Map<number, T[]> = new Map();
  order: number[] = [];

  clear (): void {
    this.order.splice(0);
    return this.vals.clear();
  }

  delete (key: number): boolean {
    this.order.splice(this.order.indexOf(key), 1);
    return this.vals.delete(key);
  }

  get (key: number): T[] | undefined {
    return this.vals.get(key);
  }

  has (key: number): boolean {
    return this.vals.has(key);
  }

  pushForward (key: number) {
    const i = this.order.indexOf(key);
    if (i < 0) return;
    this.order.splice(i, 1);
    this.order.push(key);
  }

  set (key: number, value: T[]): this {
    this.vals.set(key, value);
    const i = this.order.indexOf(key);
    if (i >= 0) this.order.splice(i, 1);
    this.order.push(key);
    return this;
  }

  get size () {
    return this.vals.size;
  }

  entries (): IterableIterator<[number, T[]]> {
    const order = this.order;
    const vals = this.vals;
    let i = 0;
    return {
      [Symbol.iterator] () {
        return this;
      },
      next () {
        if (i >= order.length) {
          return { done: true };
        } else {
          return { done: false, value: [order[i], vals.get(order[i++])] };
        }
      }
    } as IterableIterator<[number, T[]]>;
  }

  keys (): IterableIterator<number> {
    return this.order.values();
  }

  values (): IterableIterator<T[]> {
    const order = this.order;
    const vals = this.vals;
    let i = 0;
    return {
      [Symbol.iterator] () {
        return this;
      },
      next () {
        if (i >= order.length) {
          return { done: true };
        } else {
          return { done: false, value: vals.get(order[i++]) };
        }
      }
    } as IterableIterator<T[]>;
  }

  clean (): void {
    if (this.order.length <= 5) return;
    const l = this.order.splice(0, this.order.length - 5);
    for (const i of l) this.vals.delete(i);
  }
}

interface RadicalStoreOutline {
  store: [[number, number][], string][];
  lastUpdate: string;
  ready: boolean;
  readyPromise?: Promise<void>;

  byID: (fetch: number[]) => Promise<Radical[]>;
  byLevel: (fetch: number[]) => Promise<Radical[]>;
}

class RadicalStore implements RadicalStoreOutline {
  store: [[number, number][], string][] = [];
  exStore = new EXStore<Radical>();
  lastUpdate = '';
  ready = false;
  readyPromise: Promise<void>;

  constructor (generate?: Radical[]) {
    if (generate) {
      this.readyPromise = (async () => {
        const s0: [number, number][] = [];
        const s1 = [];
        for (const i of generate) {
          s0.push([i.id, i.lvl]);
          s1.push(i);
          if (s0.length >= 200) {
            this.store.push([
              s0.splice(0),
              await deflate(JSON.stringify(s1.splice(0)))
            ]);
          }
        }
        if (s0.length) {
          this.store.push([
            s0.splice(0),
            await deflate(JSON.stringify(s1.splice(0)))
          ]);
        }
        this.ready = true;
        this.save();
      })();
    } else {
      this.readyPromise = (async () => {
        const value = await Storage.getJSON<[[number, number][], string][]>(
          LocalStoreNames.radical
        );
        if (!value) return;
        this.store = value;
        this.ready = true;
      })();
    }
  }

  async byID (fetch: number[]): Promise<Radical[]> {
    const l: Radical[] = [];
    for (const [part, [contents, cData]] of this.store.entries()) {
      const indices = [];
      for (const [a, b] of contents.entries()) {
        if (fetch.includes(b[0])) indices.push(a);
      }
      if (indices.length) {
        let data = this.exStore.get(part);
        if (!data) {
          data = JSON.parse(await inflate(cData)) as Radical[];
          this.exStore.set(part, data);
        } else this.exStore.pushForward(part);
        for (const i of indices) l.push(data[i]);
      }
    }
    this.exStore.clean();
    return l;
  }

  async byLevel (fetch: number[]): Promise<Radical[]> {
    const l: Radical[] = [];
    for (const [part, [contents, cData]] of this.store.entries()) {
      const indices = [];
      for (const [a, b] of contents.entries()) {
        if (fetch.includes(b[1])) indices.push(a);
      }
      if (indices.length) {
        let data = this.exStore.get(part);
        if (!data) {
          data = JSON.parse(await inflate(cData)) as Radical[];
          this.exStore.set(part, data);
        } else this.exStore.pushForward(part);
        for (const i of indices) l.push(data[i]);
      }
    }
    this.exStore.clean();
    return l;
  }

  save () {
    console.log(
      'SAVE RADICAL : ' +
        (JSON.stringify(this.store).length / 1000).toFixed() +
        'k'
    );
    Storage.set(LocalStoreNames.radical, JSON.stringify(this.store));
  }
}

const radicalStore = new (class RadicalStoreController
implements RadicalStoreOutline {
  _kStore?: RadicalStore;
  readyPromise?: Promise<void>;

  get store () {
    return this._kStore ? this._kStore.store : [];
  }

  get lastUpdate () {
    return this._kStore ? this._kStore.lastUpdate : '';
  }

  byID = async (fetch: number[]) =>
    this._kStore ? await this._kStore.byID(fetch) : [];

  byLevel = async (fetch: number[]) =>
    this._kStore ? await this._kStore.byLevel(fetch) : [];

  get ready () {
    return this._kStore !== undefined && this._kStore.ready;
  }

  update (v: Radical[]) {
    this._kStore = new RadicalStore(v);
    this.readyPromise = this._kStore.readyPromise;
  }

  local () {
    this._kStore = new RadicalStore();
    this.readyPromise = this._kStore.readyPromise;
  }
})();

export async function GetRadicalStore (): Promise<RadicalStoreOutline> {
  if (radicalStore.ready) {
    console.log('Radical Store : @@@');
    return radicalStore;
  } else {
    radicalStore.local();
    await radicalStore.readyPromise;
    if (radicalStore.ready) {
      console.log('Radical Store : local');
      return radicalStore;
    }
    radicalStore.update(await CollectOnlineWKRadicals());
    await radicalStore.readyPromise;
    console.log('Radical Store : online');
    return radicalStore;
  }
}

interface KanjiStoreOutline {
  store: [[number, number][], string][];
  lastUpdate: string;
  ready: boolean;
  readyPromise?: Promise<void>;

  byID: (fetch: number[]) => Promise<Kanji[]>;
  byLevel: (fetch: number[]) => Promise<Kanji[]>;
}

class KanjiStore implements KanjiStoreOutline {
  store: [[number, number][], string][] = [];
  exStore = new EXStore<Kanji>();
  lastUpdate = '';
  ready = false;
  readyPromise: Promise<void>;

  constructor (generate?: Kanji[]) {
    if (generate) {
      this.readyPromise = (async () => {
        const s0: [number, number][] = [];
        const s1 = [];
        for (const i of generate) {
          s0.push([i.id, i.lvl]);
          s1.push(i);
          if (s0.length >= 200) {
            this.store.push([
              s0.splice(0),
              await deflate(JSON.stringify(s1.splice(0)))
            ]);
          }
        }
        if (s0.length) {
          this.store.push([
            s0.splice(0),
            await deflate(JSON.stringify(s1.splice(0)))
          ]);
        }
        this.ready = true;
        this.save();
      })();
    } else {
      this.readyPromise = (async () => {
        const value = await Storage.getJSON<[[number, number][], string][]>(
          LocalStoreNames.kanji
        );
        if (!value) return;
        this.store = value;
        this.ready = true;
      })();
    }
  }

  async byID (fetch: number[]): Promise<Kanji[]> {
    const l: Kanji[] = [];
    for (const [part, [contents, cData]] of this.store.entries()) {
      const indices = [];
      for (const [a, b] of contents.entries()) {
        if (fetch.includes(b[0])) indices.push(a);
      }
      if (indices.length) {
        let data = this.exStore.get(part);
        if (!data) {
          data = JSON.parse(await inflate(cData)) as Kanji[];
          this.exStore.set(part, data);
        } else this.exStore.pushForward(part);
        for (const i of indices) l.push(data[i]);
      }
    }
    this.exStore.clean();
    return l;
  }

  async byLevel (fetch: number[]): Promise<Kanji[]> {
    const l: Kanji[] = [];
    for (const [part, [contents, cData]] of this.store.entries()) {
      const indices = [];
      for (const [a, b] of contents.entries()) {
        if (fetch.includes(b[1])) indices.push(a);
      }
      if (indices.length) {
        let data = this.exStore.get(part);
        if (!data) {
          data = JSON.parse(await inflate(cData)) as Kanji[];
          this.exStore.set(part, data);
        } else this.exStore.pushForward(part);
        for (const i of indices) l.push(data[i]);
      }
    }
    this.exStore.clean();
    return l;
  }

  save () {
    console.log(
      'SAVE KANJI : ' +
        (JSON.stringify(this.store).length / 1000).toFixed() +
        'k'
    );
    Storage.set(LocalStoreNames.kanji, JSON.stringify(this.store));
  }
}

const kanjiStore = new (class KanjiStoreController
implements KanjiStoreOutline {
  _kStore?: KanjiStore;
  readyPromise?: Promise<void>;

  get store () {
    return this._kStore ? this._kStore.store : [];
  }

  get lastUpdate () {
    return this._kStore ? this._kStore.lastUpdate : '';
  }

  byID = async (fetch: number[]) =>
    this._kStore ? await this._kStore.byID(fetch) : [];

  byLevel = async (fetch: number[]) =>
    this._kStore ? await this._kStore.byLevel(fetch) : [];

  get ready () {
    return this._kStore !== undefined && this._kStore.ready;
  }

  update (v: Kanji[]) {
    this._kStore = new KanjiStore(v);
    this.readyPromise = this._kStore.readyPromise;
  }

  local () {
    this._kStore = new KanjiStore();
    this.readyPromise = this._kStore.readyPromise;
  }
})();

export async function GetKanjiStore (): Promise<KanjiStoreOutline> {
  if (kanjiStore.ready) {
    console.log('Kanji Store : @@@');
    return kanjiStore;
  } else {
    kanjiStore.local();
    await kanjiStore.readyPromise;
    if (kanjiStore.ready) {
      console.log('Kanji Store : local');
      return kanjiStore;
    }
    kanjiStore.update(await CollectOnlineWKKanji());
    await kanjiStore.readyPromise;
    console.log('Kanji Store : online');
    return kanjiStore;
  }
}

interface VocabStoreOutline {
  store: [[number, number][], string][];
  lastUpdate: string;
  ready: boolean;
  readyPromise?: Promise<void>;

  byID: (fetch: number[]) => Promise<Vocab[]>;
  byLevel: (fetch: number[]) => Promise<Vocab[]>;
}

class VocabStore implements VocabStoreOutline {
  store: [[number, number][], string][] = [];
  exStore = new EXStore<Vocab>();
  lastUpdate = '';
  ready = false;
  readyPromise: Promise<void>;

  constructor (generate?: Vocab[]) {
    if (generate) {
      this.readyPromise = (async () => {
        const s0: [number, number][] = [];
        const s1 = [];
        for (const i of generate) {
          s0.push([i.id, i.lvl]);
          s1.push(i);
          if (s0.length >= 200) {
            this.store.push([
              s0.splice(0),
              await deflate(JSON.stringify(s1.splice(0)))
            ]);
          }
        }
        if (s0.length) {
          this.store.push([
            s0.splice(0),
            await deflate(JSON.stringify(s1.splice(0)))
          ]);
        }
        this.ready = true;
        this.save();
      })();
    } else {
      this.readyPromise = (async () => {
        const value = await Storage.getJSON<[[number, number][], string][]>(
          LocalStoreNames.vocab
        );
        if (!value) return;
        this.store = value;
        this.ready = true;
      })();
    }
  }

  async byID (fetch: number[]): Promise<Vocab[]> {
    const l: Vocab[] = [];
    for (const [part, [contents, cData]] of this.store.entries()) {
      const indices = [];
      for (const [a, b] of contents.entries()) {
        if (fetch.includes(b[0])) indices.push(a);
      }
      if (indices.length) {
        let data = this.exStore.get(part);
        if (!data) {
          data = JSON.parse(await inflate(cData)) as Vocab[];
          this.exStore.set(part, data);
        } else this.exStore.pushForward(part);
        for (const i of indices) l.push(data[i]);
      }
    }
    this.exStore.clean();
    return l;
  }

  async byLevel (fetch: number[]): Promise<Vocab[]> {
    const l: Vocab[] = [];
    for (const [part, [contents, cData]] of this.store.entries()) {
      const indices = [];
      for (const [a, b] of contents.entries()) {
        if (fetch.includes(b[1])) indices.push(a);
      }
      if (indices.length) {
        let data = this.exStore.get(part);
        if (!data) {
          data = JSON.parse(await inflate(cData)) as Vocab[];
          this.exStore.set(part, data);
        } else this.exStore.pushForward(part);
        for (const i of indices) l.push(data[i]);
      }
    }
    this.exStore.clean();
    return l;
  }

  save () {
    console.log(
      'SAVE VOCAB : ' +
        (JSON.stringify(this.store).length / 1000).toFixed() +
        'k'
    );
    Storage.set(LocalStoreNames.vocab, JSON.stringify(this.store));
  }
}

const vocabStore = new (class VocabStoreController
implements VocabStoreOutline {
  _kStore?: VocabStore;
  readyPromise?: Promise<void>;

  get store () {
    return this._kStore ? this._kStore.store : [];
  }

  get lastUpdate () {
    return this._kStore ? this._kStore.lastUpdate : '';
  }

  byID = async (fetch: number[]) =>
    this._kStore ? await this._kStore.byID(fetch) : [];

  byLevel = async (fetch: number[]) =>
    this._kStore ? await this._kStore.byLevel(fetch) : [];

  get ready () {
    return this._kStore !== undefined && this._kStore.ready;
  }

  update (v: Vocab[]) {
    this._kStore = new VocabStore(v);
    this.readyPromise = this._kStore.readyPromise;
  }

  local () {
    this._kStore = new VocabStore();
    this.readyPromise = this._kStore.readyPromise;
  }
})();

export async function GetVocabStore (): Promise<VocabStoreOutline> {
  if (vocabStore.ready) {
    console.log('Vocab Store : @@@');
    return vocabStore;
  } else {
    vocabStore.local();
    await vocabStore.readyPromise;
    if (vocabStore.ready) {
      console.log('Vocab Store : local');
      return vocabStore;
    }
    vocabStore.update(await CollectOnlineWKVocab());
    await vocabStore.readyPromise;
    console.log('Vocab Store : online');
    return vocabStore;
  }
}
