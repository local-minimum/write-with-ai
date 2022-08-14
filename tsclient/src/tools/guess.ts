import { SecretWord } from '../api/types';

export function isSpace(word: string): boolean {
  return word.trim().length === 0;
}

export function isPunctuation(word: string): boolean {
  // eslint-disable-next-line no-useless-escape
  return word.replace(/[ .:?!;_/\\+*=%&^@#$()[\]{}<>'"\-]*/g, '').length === 0;
}

export function asLex(word: string): string {
  return word.trim().toLowerCase();
}

export function reveal(
  secrets: [SecretWord, SecretWord, SecretWord],
  position: number,
): [SecretWord, SecretWord, SecretWord] {
  return secrets
    .map(([lex, revealed], idx) => (idx === position ? [lex, true] : [lex, revealed])) as [
      SecretWord, SecretWord, SecretWord
    ];
}
