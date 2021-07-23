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
import { SimplifySubject, SSubject } from './AltTypes';
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

  const subjects = data.data.filter(i=>!i.data.hidden_at);

  /* ---------- level_comp ---------- */
  pp.push(
    (async () => {
      const final: Map<number, string> = new Map();
      for (let i = 1; i <= maxLevel; i++) {
        const level = subjects.filter(s => s.data.level === i);
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

  /* ---------- subj_min ---------- */
  pp.push(
    (async () => {
      const parts: [number[], string][] = [];
      for (let i = 0; i < subjects.length;) {
        const a: number[] = [];
        const b: unknown[] = [];
        for (let j = 0; j < 20; j++) {
          if (i >= subjects.length) break;
          a.push(subjects[i].id);
          b.push(SimplifySubject(subjects[i++], true));
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
  subjectMin?: [number[], string][];
  levels: Map<number, WKSubject[]>;
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
  const clevel = (await (MemCache.levelComp as Map<number, string>).get(
    levelId
  )) as string;
  if (!clevel) throw Error('Level has not been cached');
  return JSON.parse(await inflate(clevel));
}

export async function GetSubjectMin () {
  if (!MemCache.subjectMin) {
    MemCache.subjectMin = JSON.parse(
      localStorage.getItem('subj_min') as string
    );
  }
  return MemCache.subjectMin as [number[], string][];
}

export async function GetSubjects (ids: number[]): Promise<SSubject[]> {
  const subjects = await GetSubjectMin();
  const toInflate: [number[], string][] = [];
  for (const i of subjects) {
    const part = ids.filter(j => i[0].includes(j));
    if (part.length) {
      toInflate.push([part, i[1]]);
    }
  }
  const pp = [];
  for (const i of toInflate) {
    pp.push(
      (async () => {
        const l: SSubject[] = [];
        const data = JSON.parse(await inflate(i[1])) as SSubject[];
        for (const j of i[0]) l.push(data.find(a => a.id === j) as SSubject);
        return l;
      })()
    );
  }
  return (await Promise.all(pp)).flat();
}

export async function GetFullSubjects (ids: number[]): Promise<SSubject[]> {
  // Fetch from online
  const res = (await FetchSubjects({ ids })).data;
  return res.map(i => SimplifySubject(i));
}
