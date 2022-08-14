import { TextWord } from '../components/TextWord';
import { SecretWords } from './types';

interface GuessResponse {
  guess: string;
}

function makeAIGuess(
  story: TextWord[],
  secretWords: SecretWords | undefined,
  lead = false,
  target: string | undefined = undefined,
): Promise<TextWord[]> {
  return fetch(
    './api/play',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        prompt: story.map(([word]) => word).filter((word) => word !== ''),
        lead,
        target,
        guessWordLengths: secretWords?.human.map((w) => w.length),
      }),
    },
  )
    .then((response) => {
      if (response.ok) {
        return response.json() as Promise<GuessResponse>;
      }
      throw new Error('Failed to make AI guess');
    })
    .then(({ guess }) => [...story, [' ', false], [guess, false]]);
}

export default makeAIGuess;
