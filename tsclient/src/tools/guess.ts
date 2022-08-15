import { SecretWord } from '../api/types';

export function isSpace(word: string): boolean {
  return word.trim().length === 0;
}

export function isPunctuation(word: string): boolean {
  // eslint-disable-next-line no-useless-escape
  return word.replace(/[ ,.:?!;_/\\+*=%&^@#$()[\]{}<>'"\-]*/g, '').length === 0;
}

export function asLex(word: string): string {
  return word.trim().toLowerCase();
}

export function reveal(
  secrets: SecretWord[],
  position: number,
): SecretWord[] {
  return secrets
    .map(([lex, revealed], idx) => (idx === position ? [lex, true] : [lex, revealed]));
}

export function transformGuess(
  lex: string,
  previousLex: string | undefined,
): string {
  if (lex === 'i') return 'I';
  if (lex === 'i\'m') return 'I\'m';
  if (lex.length >= 1 && ['.', '!', '?'].includes(previousLex ?? '')) return lex[0].toUpperCase() + lex.slice(1);
  return lex;
}
