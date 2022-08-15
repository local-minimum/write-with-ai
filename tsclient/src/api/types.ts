export type SecretWord = [lex: string, revealed: boolean];

export interface SecretWords {
  human: SecretWord[];
  ai: SecretWord[];
}
