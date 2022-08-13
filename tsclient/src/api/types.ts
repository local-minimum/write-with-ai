export type SecretWord = [lex: string, revealed: boolean];

export interface SecretWords {
  human: [SecretWord, SecretWord, SecretWord];
  ai: [SecretWord, SecretWord, SecretWord];
}
