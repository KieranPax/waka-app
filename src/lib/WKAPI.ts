/* eslint-disable camelcase */
/*                                    ------------ Base types here ------------ */

type ISO8601Date = string; // {yyyy}-{mm}-{dd}T{hh}:{mm}:{ss}.{ffffff}Z => len(27)
type SubjectType = 'radical' | 'kanji' | 'vocabulary';

export interface WKFetchBase {
  object: string;
  url: string;
}

export interface WKFetchObject<T> extends WKFetchBase {
  object: 'report' | 'user';
  data_updated_at: ISO8601Date;
  data: T;
}

export interface WKFetchItem<T> extends WKFetchBase {
  id: number;
  object:
    | 'assignment'
    | 'level_progression'
    | 'reset'
    | 'review'
    | 'review_statistic'
    | 'spaced_repetition_system'
    | 'study_material'
    | 'voice_actor'
    | SubjectType;
  data_updated_at: ISO8601Date;
  data: T;
}

export interface WKFetchCollection<T> extends WKFetchBase {
  object: 'collection';
  pages: {
    next_url: string | null;
    previous_url: string | null;
    per_page: number;
  };
  total_count: number;
  data_updated_at: ISO8601Date | null;
  data: WKFetchItem<T>[];
}

/*                                    ------------ WK object types here ------------ */

export interface WKUser {
  id: string;
  current_vacation_started_at: ISO8601Date | null;
  level: number;
  preferences: {
    default_voice_actor_id: number;
    lessons_autoplay_audio: boolean;
    lessons_batch_size: number;
    lessons_presentation_order:
      | 'ascending_level_then_subject'
      | 'shuffled'
      | 'ascending_level_then_shuffled';
    reviews_autoplay_audio: boolean;
    reviews_display_srs_indicator: boolean;
  };
  profile_url: string;
  started_at: ISO8601Date;
  subscription: {
    active: boolean;
    max_level_granted: number; // active ? (3) : (60)
    period_ends_at: ISO8601Date | null;
    type: 'free' | 'recurring' | 'lifetime';
  };
  username: string;
}

export interface WKSummary {
  lessons: {
    available_at: ISO8601Date;
    subject_ids: number[];
  }[];
  next_reviews_at: ISO8601Date | null;
  reviews: {
    available_at: ISO8601Date;
    subject_ids: number[];
  }[];
}

/*                                    ------------ WK subject types here ------------ */

export interface WKSubject {
  auxiliary_meanings: { meaning: string; type: string }[];
  created_at: ISO8601Date;
  document_url: string;
  hidden_at: ISO8601Date | null;
  lesson_position: number;
  level: number;
  meaning_mnemonic: string;
  meanings: { meaning: string; primary: boolean; accepted_answer: boolean }[];
  slug: string;
  spaced_repetition_system_id: number;
}

export interface WKRadical extends WKSubject {
  amalgamation_subject_ids: string;
  characters: string | null;
  character_images: {
    url: string;
    content_type: 'image/svg+xml' | 'image/png';
    metadata: {
      inline_styles?: boolean; // SVG only
      color?: string; // #RRGGBB
      dimensions?: string; // {W}x{H}
      style_name?: string;
    };
  }[];
}

export interface WKKanji extends WKSubject {
  amalgamation_subject_ids: number[];
  characters: string;
  component_subject_ids: number[];
  meaning_hint: string;
  reading_hint: string;
  reading_mnemonic: string;
  readings: {
    reading: string; // hirigana
    primary: boolean;
    accepted_answer: boolean;
    type: 'kunyomi' | 'onyomi' | 'nanori';
  }[];
  visually_similar_subject_ids: number[];
}

export interface WKVocab extends WKSubject {
  characters: string;
  component_subject_ids: number[];
  context_sentences: { en: string; ja: string }[];
  meaning_mnemonic: string;
  parts_of_speech: string[];
  pronunciation_audios: {
    url: string;
    content_type: 'audio/mpeg' | 'audio/ogg';
    metadata: {
      gender: 'male' | 'female';
      source_id: number;
      pronunciation: string;
      voice_actor_id: number;
      voice_actor_name: string;
      voice_description: string;
    };
  }[];
  readings: {
    reading: string; // hirigana
    primary: boolean;
    accepted_answer: boolean;
  }[];
  reading_mnemonic: string;
}

/*                                    ------------ WK item types here ------------ */

export interface WKAssignment {
  available_at: ISO8601Date | null;
  burned_at: ISO8601Date | null;
  created_at: ISO8601Date;
  hidden: boolean;
  passed_at: ISO8601Date | null;
  resurrected_at: ISO8601Date | null;
  srs_stage: number;
  started_at: ISO8601Date | null;
  subject_id: number;
  subject_type: boolean;
  unlocked_at: ISO8601Date | null;
}

export interface WKLevelProgression {
  abandoned_at: ISO8601Date | null;
  completed_at: ISO8601Date | null;
  created_at: ISO8601Date;
  level: number;
  passed_at: ISO8601Date | null;
  started_at: ISO8601Date | null;
  unlocked_at: ISO8601Date | null;
}

export interface WKReset {
  confirmed_at: ISO8601Date | null;
  created_at: ISO8601Date;
  original_level: number;
  target_level: number;
}

export interface WKReview {
  assignment_id: number;
  created_at: ISO8601Date;
  ending_srs_stage: number;
  incorrect_meaning_answers: number;
  incorrect_reading_answers: number;
  spaced_repetition_system_id: number;
  starting_srs_stage: number;
  subject_id: number;
}

export interface WKReviewStatistic {
  created_at: ISO8601Date;
  hidden: boolean;
  meaning_correct: number;
  meaning_current_streak: number;
  meaning_incorrect: number;
  meaning_max_streak: number;
  percentage_correct: number;
  reading_correct: number;
  reading_current_streak: number;
  reading_incorrect: number;
  reading_max_streak: number;
  subject_id: number;
  subject_type: string;
}

export interface WKSpacedRepetitionSystem {
  burning_stage_position: number;
  created_at: ISO8601Date;
  description: string;
  name: string;
  passing_stage_position: number;
  stages: {
    interval: number | null;
    interval_unit: string | null;
    position: number;
  }[];
  starting_stage_position: number;
  unlocking_stage_position: number;
}

export interface WKStudyMaterial {
  created_at: ISO8601Date;
  hidden: boolean;
  meaning_note: string | null;
  meaning_synonyms: string[];
  reading_note: string | null;
  subject_id: number;
  subject_type: string;
}

export interface WKVoiceActor {
  description: string;
  gender: string;
  name: string;
}

/* eslint-enable camelcase */
/*                                    ------------ Fetch functions here ------------ */

export function GetAPIToken () {
  return localStorage.getItem('api_token');
}

export async function SetAPIToken (
  value: string
): Promise<{
  user?: WKFetchObject<WKUser>;
  status: number;
  errorText?: string;
}> {
  if (!value.length) { return { status: 401, errorText: 'Please input an API token' } }
  if (value.length !== 36) { return { status: 401, errorText: 'Make sure you copied the full token' } }
  const res: Response = await fetch('https://api.wanikani.com/user', {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + value }
  });
  if (res.status === 401) {
    return { status: 401, errorText: 'This is an invlid API token' };
  } else if (res.status !== 200) {
    return { status: res.status, errorText: res.statusText };
  }
  localStorage.setItem('api_token', value);
  return { status: 200, user: await res.json() };
}

interface URLObject {
  p: string; // path
  v?: any; // params / vars
}

function parseURLObject (url: URLObject): string {
  const s = 'https://api.wanikani.com/v2/' + url.p;
  const l: string[] = [];
  if (url.v) {
    for (const [a, b] of Object.entries(url.v)) {
      l.push(a + '=' + b);
    }
  }
  if (l.length) return s + (url.p.includes('?') ? '&' : '?') + l.join('&');
  return s;
}

async function wkfetchjson<T> (info: URLObject) {
  const url = parseURLObject(info);
  console.log('---- ONLINE FETCH ', url);
  const res: Response = await fetch(url, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + GetAPIToken() }
  });
  if (res.status !== 200) throw Error(res.statusText);
  return (await res.json()) as T;
}

async function wkfetchjsonc<T> (info: URLObject) {
  let url: string | null = parseURLObject(info);
  let data: undefined | WKFetchCollection<unknown>;
  while (url) {
    console.log('---- ONLINE FETCH ', url);
    const res: Response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + GetAPIToken() }
    });
    if(res.status !== 200) throw Error(res.statusText);
    const resData = (await res.json()) as WKFetchCollection<unknown>;
    if (!data) data = resData;
    else data.data = [data.data, resData.data].flat();
    url = resData.pages.next_url;
  }
  return data as WKFetchCollection<T>;
}

export const FetchUser = () =>
  wkfetchjson<WKFetchObject<WKUser>>({ p: 'user' });
export const FetchSummary = async () =>
  wkfetchjson<WKFetchObject<WKSummary>>({ p: 'summary' });

export const FetchRadical = (i: number, v?: any) =>
  wkfetchjson<WKFetchItem<WKRadical>>({ p: `subjects/${i}?types=radical`, v });
export const FetchKanji = (i: number, v?: any) =>
  wkfetchjson<WKFetchItem<WKKanji>>({ p: `subjects/${i}?types=kanji`, v });
export const FetchVocab = (i: number, v?: any) =>
  wkfetchjson<WKFetchItem<WKVocab>>({ p: `subjects/${i}?types=vocabulary`, v });

export const FetchRadicals = (v?: any) =>
  wkfetchjsonc<WKRadical>({ p: 'subjects?types=radical', v });
export const FetchKanjis = (v?: any) =>
  wkfetchjsonc<WKKanji>({ p: 'subjects?types=kanji', v });
export const FetchVocabs = (v?: any) =>
  wkfetchjsonc<WKVocab>({ p: 'subjects?types=vocabulary', v });

export const FetchSubject = (i: number, v?: any) =>
  wkfetchjson<WKFetchItem<WKSubject>>({ p: `subjects/${i}`, v });
export const FetchSubjects = (v?: any) =>
  wkfetchjsonc<WKSubject>({ p: 'subjects', v });

export const FetchAssignment = (i: number, v?: any) =>
  wkfetchjson<WKFetchItem<WKAssignment>>({ p: `assignments/${i}`, v });
export const FetchAssignments = (v?: any) =>
  wkfetchjsonc<WKAssignment>({ p: 'assignments', v });

export const FetchLevelProgression = (i: number, v?: any) =>
  wkfetchjson<WKFetchItem<WKLevelProgression>>({
    p: `level_progressions/${i}`,
    v
  });
export const FetchLevelProgressions = (v?: any) =>
  wkfetchjsonc<WKLevelProgression>({ p: 'level_progressions', v });

export const FetchReset = (i: number, v?: any) =>
  wkfetchjson<WKFetchItem<WKReset>>({ p: `resets/${i}`, v });
export const FetchResets = (v?: any) =>
  wkfetchjsonc<WKReset>({ p: 'resets', v });

export const FetchReview = (i: number, v?: any) =>
  wkfetchjson<WKFetchItem<WKReview>>({ p: `reviews/${i}`, v });
export const FetchReviews = (v?: any) =>
  wkfetchjsonc<WKReview>({ p: 'reviews', v });

export const FetchReviewStatistic = (i: number, v?: any) =>
  wkfetchjson<WKFetchItem<WKReviewStatistic>>({
    p: `review_statistics/${i}`,
    v
  });
export const FetchReviewStatistics = (v?: any) =>
  wkfetchjsonc<WKReviewStatistic>({ p: 'review_statistics', v });

export const FetchSpacedRepetitionSystem = (i: number, v?: any) =>
  wkfetchjson<WKFetchItem<WKSpacedRepetitionSystem>>({
    p: `spaced_repetition_systems/${i}`,
    v
  });
export const FetchSpacedRepetitionSystems = (v?: any) =>
  wkfetchjsonc<WKSpacedRepetitionSystem>({ p: 'spaced_repetition_systems', v });

export const FetchStudyMaterial = (i: number, v?: any) =>
  wkfetchjson<WKFetchItem<WKStudyMaterial>>({ p: `study_materials/${i}`, v });
export const FetchStudyMaterials = (v?: any) =>
  wkfetchjsonc<WKStudyMaterial>({ p: 'study_materials', v });

export const FetchVoiceActor = (i: number, v?: any) =>
  wkfetchjson<WKFetchItem<WKVoiceActor>>({ p: `voice_actors/${i}`, v });
export const FetchVoiceActors = (v?: any) =>
  wkfetchjsonc<WKVoiceActor>({ p: 'voice_actors', v });
