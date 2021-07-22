import {
  FetchSubjects,
  GetAPIToken,
  SetAPIToken,
  WKKanji,
  WKVocab,
  FetchUser,
  WKUser
} from './WKAPI';
import zlib from 'zlib';
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

export async function CreateLevelStructureCache (maxLevel: number) {
  const data = await FetchSubjects({
    levels: [...new Array(maxLevel).keys()].map(i => i + 1)
  });
  const final: Map<number, string> = new Map();
  for (let i = 1; i <= maxLevel; i++) {
    const level = data.data.filter(s => s.data.level === i);
    const levelComp: Set<number>[] = new Array(5).fill(0).map(i => new Set());
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
}

const MemCache = { user: null as WKUser | null };
export async function GetUser () {
  if (MemCache.user) return MemCache.user as WKUser;
  return MemCache.user = (await FetchUser()).data;
}
