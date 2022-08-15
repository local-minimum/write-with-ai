import { TextWord } from '../components/TextWord';
import { API_DOMAIN } from './domain';
import { SecretWords } from './types';

interface GuessResponse {
  guess: string;
}

function makeAIGuess(
  story: TextWord[],
  secretWords: SecretWords | undefined,
  lead = false,
): Promise<string> {
  const remainingLengths = secretWords?.human
    .filter(([_, revealed]) => !revealed)
    .map(([lex]) => lex.length) ?? [];

  const shallLead = lead || remainingLengths.length === 0;
  const remainingSecrets = secretWords?.ai
    .filter(([_, revealed]) => !revealed)
    .sort(([a], [b]) => (a.length < b.length ? -1 : 1))
    .map(([lex]) => lex) ?? [];
  const target = shallLead ? remainingSecrets[0] : undefined;

  return fetch(
    `${API_DOMAIN}/api/play`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        prompt: story.map(([word]) => word).filter((word) => word !== ' '),
        lead: shallLead,
        target,
        guessWordLengths: remainingLengths,
        aiSecrets: remainingSecrets,
      }),
    },
  )
    .then((response) => {
      if (response.ok) {
        return response.json() as Promise<GuessResponse>;
      }
      throw new Error('Failed to make AI guess');
    })
    .then(({ guess }) => guess);
}

export default makeAIGuess;
