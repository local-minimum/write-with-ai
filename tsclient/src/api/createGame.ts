import { TextWord } from '../components/TextWord';
import { SecretWord, SecretWords } from './types';

interface ResponseJSON {
  human: [string, string, string];
  ai: [string, string, string];
}

function createGame(
  prompt: TextWord[],
): Promise<SecretWords> {
  return fetch(
    './api/create',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(prompt.map(([word]) => word).filter((word) => word !== '')),
    },
  )
    .then((response) => {
      if (response.ok) {
        return response.json() as Promise<ResponseJSON>;
      }
      throw new Error('Unexpected response');
    })
    .then(({ human, ai }) => ({
      human: human.map<SecretWord>((lex) => [lex, false]) as [SecretWord, SecretWord, SecretWord],
      ai: ai.map<SecretWord>((lex) => [lex, false]) as [SecretWord, SecretWord, SecretWord],
    }));
}

export default createGame;
