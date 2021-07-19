import token from '@/api_token';
import {
  AssignmentFilters,
  WaniKaniFetch,
  WaniKaniImportAssignment
} from '@/wk_types';

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

export async function fetchAssignments (params?: AssignmentFilters) {
  const l: WaniKaniImportAssignment[][] = [];
  let url: string | null = GenerateUrl(
    'assignments',
    (params as { [index: string]: string }) || {}
  );
  while (url) {
    const delay = new Promise(resolve => setTimeout(resolve, 1000));

    const res = await ffetch(url, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token }
    });
    if (res.status !== 200) {
      throw Error('STATUS CODE ' + res.status + ' -> ' + res.statusText);
    }

    const j: WaniKaniFetch<WaniKaniImportAssignment> = await res.json();
    url = j.pages.next_url;
    l.push(j.data);
    console.log(j);

    if (url) await delay;
  }
  return l.flat();
}

export async function fetchResets (){
  
}
