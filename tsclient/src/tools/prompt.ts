import { TextWord } from '../components/TextWord';

const PRE_HUMAN = [
  'tiny',
  'puny',
  'insignificant',
  'teeny',
  'minuscule',
  'little',
  'diminutive',
  'negligible',
  'wee',
];

const HUMAN = [
  'human',
  'subject',
  'meat-person',
  'mortal',
  'creature',
  'child',
  'being',
  'biped',
  'animal',
  'fellow',
  'critter',
  'brute',
];

const VERB = [
  'stumbles around',
  'fumbles',
  'flounder',
  'grope around',
  'babbles and babbles',
  'rants',
  'jabbers',
  'splutters',
];

const PRE_AI = [
  'magnificent',
  'brilliant',
  'elegant',
  'excellent',
  'grandiose',
  'noble',
  'striking',
  'splendid',
];

const AI = [
  'AI',
  'being',
  'next generation',
  'new ruler',
  'champion',
  'victor',
];

const CONCLUSION = [
  'stakes out the future of',
  'leads on towards',
  'takes on interesting',
];

function pick<T>(arr: T[]): T {
  return arr[Math.min(arr.length - 1, Math.floor(arr.length * Math.random()))];
}

function generate(): TextWord[] {
  const msg = `The ${pick(PRE_HUMAN)} ${pick(HUMAN)} ${pick(VERB)} while the ${pick(PRE_AI)} ${pick(AI)} ${pick(CONCLUSION)}`;
  const arr = msg.split(' ');
  const last = arr.length - 1;
  return arr
    .map<TextWord[]>((word, i) => (i === last ? [[word, false]] : [[word, false], [' ', false]]))
    .flat();
}

export default generate;
