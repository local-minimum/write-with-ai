import { TextWord } from '../components/TextWord';

interface GuessResponse {
  guess: string;
}

function makeAIGuess(
  story: TextWord[],
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
