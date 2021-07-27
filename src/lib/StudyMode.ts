import { h, VNode } from 'vue';
import RImage from '@/components/Radical/Image.vue';
import KImage from '@/components/Kanji/Image.vue';
import VImage from '@/components/Vocab/Image.vue';
import { SKanji, SRadical, SSubject } from './AltTypes';
import { GetLevelComps, GetSubjects } from './Local';

export interface QuestionInfo {
  i: number;
  pos: number;
  type: string;
  title: VNode;
  answered: null | [number, boolean];
  body: (q: QuestionInfo, f: () => void) => VNode;
  focus: SSubject;
}

function RandRange (start: number, stop: number): number {
  return start + Math.floor(Math.random() * (stop - start));
}

function RandSelect<T> (l: T[]): T | undefined {
  if (!l.length) return;
  return l[Math.floor(Math.random() * l.length)];
}

function RandShuffle<T> (l: T[]): T[] {
  for (let i = l.length; i >= 0; i--) {
    l.push(l.splice(Math.floor(Math.random() * i), 1)[0]);
  }
  return l;
}

const BodyGenerators = new (class BodyGen {
  MultiSelect<T> (selection: T[], func: (i: T, index: number) => [any, any[]]) {
    return h(
      'div',
      { class: 'multi-select' },
      selection.map((a, b) => h('button', ...func(a, b)))
    );
  }

  MultiRadicalName (selection: SRadical[]) {
    return (q: QuestionInfo, f: () => void) =>
      this.MultiSelect(selection, (i, index) => [
        {
          onClick (e: Event) {
            e.stopPropagation();
            if (q.answered) return;
            q.answered = [index + 1, q.focus.id === i.id];
            f();
          },
          style: {
            background: q.answered
              ? [
                '',
                'var(--c-color-bad)',
                'var(--c-color-good)',
                'var(--c-color-good)'
              ][
                (i.id === q.focus.id ? 2 : 0) +
                    (index + 1 === q.answered[0] ? 1 : 0)
              ]
              : ''
          }
        },
        [i.name]
      ]);
  }

  MultiRadicalChar (selection: SRadical[]) {
    return (q: QuestionInfo, f: () => void) =>
      this.MultiSelect(selection, (i, index) => [
        {
          onClick (e: Event) {
            e.stopPropagation();
            if (q.answered) return;
            q.answered = [index + 1, q.focus.id === i.id];
            f();
          },
          style: {
            background: q.answered
              ? [
                '',
                'var(--c-color-bad)',
                'var(--c-color-good)',
                'var(--c-color-good)'
              ][
                (i.id === q.focus.id ? 2 : 0) +
                    (index + 1 === q.answered[0] ? 1 : 0)
              ]
              : ''
          }
        },
        [h(RImage, { radical: i })]
      ]);
  }
})();

export class QuestionGenerator {
  i: number;
  levelSelection: [number, number];
  allowInput: boolean;
  subjectTypes: string[];
  questionTypes: string[];
  dataCollectionPromise?: Promise<void>;
  data: SSubject[][];

  constructor (levelSelection: [number, number], flags: number[]) {
    this.i = 0;
    this.levelSelection = levelSelection;
    this.subjectTypes = [];
    this.questionTypes = [];
    for (const i of flags) {
      if (i < 3) this.subjectTypes.push(['radical', 'kanji', 'vocab'][i]);
    }
    for (const i of flags) {
      if (i >= 3 && i < 5) {
        this.questionTypes.push(['reading', 'meaning'][i - 3]);
      }
    }
    this.allowInput = flags.includes(5);
    this.data = [];
    this.dataCollectionPromise = this._CollectData();
    this.dataCollectionPromise?.then(() => {
      this.dataCollectionPromise = undefined;
    });
  }

  async _CollectData () {
    const comp = await GetLevelComps(
      [
        ...new Array(this.levelSelection[1] - this.levelSelection[0] + 1).keys()
      ].map(i => i + this.levelSelection[0])
    );
    const data = [];
    if (this.subjectTypes.includes('radical')) {
      data.push(await GetSubjects(comp.map(i => i[0]).flat()));
    } else data.push([]);
    if (this.subjectTypes.includes('kanji')) {
      data.push(await GetSubjects(comp.map(i => i[1]).flat()));
    } else data.push([]);
    if (this.subjectTypes.includes('vocab')) {
      data.push(await GetSubjects(comp.map(i => i[2]).flat()));
    } else data.push([]);
    this.data = data;
  }

  KanjiCharHead (kanji: SKanji) {
    return h(KImage, { kanji });
  }

  async Generate (): Promise<QuestionInfo | void> {
    if (this.dataCollectionPromise) await this.dataCollectionPromise;
    const i = this.i++;
    const headType = RandSelect(this.subjectTypes);
    const qType = RandSelect(this.questionTypes);

    switch (headType) {
      case 'radical':
        return this.GenerateRadical(i);
      case 'kanji':
        {
        }
        break;
      case 'vocab':
        {
        }
        break;
    }
  }

  pickSubject (typeI: number) {
    return RandSelect(this.data[typeI]) as SSubject;
  }

  pickSubjects (typeI: number, count: number, focus: SSubject) {
    const l = this.data[typeI].filter(i => i.id !== focus.id);
    if (l.length <= count) return RandShuffle(l);
    const ll = [];
    for (let i = 0; i < count; i++) {
      ll.push(l.splice(Math.floor(Math.random() * l.length), 1)[0]);
    }
    ll.splice(Math.floor(Math.random() * count), 0, focus);
    return ll;
  }

  GenerateRadical (i: number): QuestionInfo {
    const ansType = RandRange(0, 2);
    const focus = this.pickSubject(0) as SRadical;
    const selection = this.pickSubjects(0, 3, focus) as SRadical[];
    const base = { answered: null, i, pos: 0, type: 'radical', focus };
    switch (ansType as number) {
      case 0:
        return {
          ...base,
          title: h(RImage, { radical: focus }),
          body: BodyGenerators.MultiRadicalName(selection)
        };
      case 1:
        return {
          ...base,
          title: h('span', [focus.name]),
          body: BodyGenerators.MultiRadicalChar(selection)
        };
      default:
        throw '';
    }
  }

  CreateMultiSelect<T> (
    data: T[],
    comp: (i: T) => VNode | string,
    verify: (i: T) => boolean
  ) {
    const l = [];
    RandShuffle(data);
    let result = 0;
    for (let i = 0; i < data.length; i++) {
      l.push(
        h(
          'button',
          {
            result,
            onClick () {
              if (result) return;
              result = verify(data[i]) ? 2 : 1;
            }
          },
          [comp(data[i])]
        )
      );
    }
    return h('div', { class: 'multi-select' }, l);
  }
}
