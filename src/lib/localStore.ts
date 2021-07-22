import {
  FetchSubjects,
  GetAPIToken,
  SetAPIToken,
  WKKanji,
  WKVocab,
  FetchUser,
  WKUser,
  WKSubject
} from './WKAPI';
import zlib from 'zlib';
import { SimplifySubject } from './AltTypes';
export { GetAPIToken, SetAPIToken };

const deflate = (buffer: string): Promise<string> =>
  new Promise((resolve, reject) =>
    zlib.deflate(buffer, (e, b) => {
      e ? reject(e) : resolve(b.toString('base64'));
    })
  );

const inflate = (buffer: string): Promise<string> =>
  new Promise((resolve, reject) =>
    zlib.inflate(
      new Uint8Array(Buffer.from(buffer, 'base64')),
      (e, b: Buffer) => (e ? reject(e) : resolve(b.toString('utf-8')))
    )
  );

export async function CreateSubjectCache (maxLevel: number) {
  const data = await FetchSubjects({
    levels: [...new Array(maxLevel).keys()].map(i => i + 1)
  });
  const pp = [];

  /* ---------- level_comp ---------- */
  pp.push(
    (async () => {
      const final: Map<number, string> = new Map();
      for (let i = 1; i <= maxLevel; i++) {
        const level = data.data.filter(s => s.data.level === i);
        const levelComp = new Array(5).fill(0).map(i => new Set());
        for (const s of level) {
          if (s.object === 'vocabulary') {
            levelComp[2].add(s.id);
            for (const c of (s.data as WKVocab).component_subject_ids) {
              levelComp[4].add(c);
            }
          } else if (s.object === 'kanji') {
            levelComp[1].add(s.id);
            for (const c of (s.data as WKKanji).component_subject_ids) {
              levelComp[3].add(c);
            }
          } else if (s.object === 'radical') {
            levelComp[0].add(s.id);
          }
        }
        final.set(i, await deflate(JSON.stringify(levelComp.map(i => [...i]))));
      }
      const finalBuf = JSON.stringify([...final.entries()]);
      localStorage.setItem('level_comp', finalBuf);
      return finalBuf;
    })()
  );
  pp.push(
    (async () => {
      const parts: [number[], string][] = [];
      for (let i = 0; i < data.data.length;) {
        const a: number[] = [];
        const b: unknown[] = [];
        for (let j = 0; j < 20; j++) {
          if (i >= data.data.length) break;
          a.push(data.data[i].id);
          b.push(SimplifySubject(data.data[i++], true));
        }
        parts.push([a, await deflate(JSON.stringify(b))]);
      }
      const finalBuf = JSON.stringify(parts);
      localStorage.setItem('subj_min', finalBuf);
      return finalBuf;
    })()
  );

  return Promise.all(pp);
}

const MemCache = {} as {
  user?: WKUser;
  levelComp?: Map<number, string>;
  levels: Map<number, WKSubject[]>
};

export async function GetUser () {
  if (!MemCache.user) MemCache.user = (await FetchUser()).data;
  return MemCache.user as WKUser;
}

export async function GetLevelComp (levelId: number) {
  if (!MemCache.levelComp) {
    MemCache.levelComp = new Map(
      JSON.parse(localStorage.getItem('level_comp') as string)
    );
  }
  const clevel = await (MemCache.levelComp as Map<number, string>).get(levelId) as string;
  if(!clevel) throw Error('Level has not been cached');
  const level = await inflate(clevel);
}
