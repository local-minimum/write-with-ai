import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Stack, TextField } from '@mui/material';
import * as React from 'react';
import { SecretWords } from '../api/types';
import GameState from '../GameState';
import { TextWord } from './TextWord';

interface GuessInputProps {
  story: TextWord[];
  gameState: GameState;
  secretWords: SecretWords | undefined;
  humanTurn: boolean;
  onAddGuess: (word: string) => void;
}

function toColor(ownSecret: boolean, warnDuplicate: boolean): 'error' | 'warning' | undefined {
  if (ownSecret) return 'error';
  if (warnDuplicate) return 'warning';
  return undefined;
}

function toLabel(ownSecret: boolean, warnDuplicate: boolean): string {
  if (ownSecret) return 'You can\'t use your own secrets';
  if (warnDuplicate) return 'You or the AI have used this word before';
  return 'Input word';
}

function GuessInput({
  gameState, secretWords, humanTurn, onAddGuess, story,
}: GuessInputProps): JSX.Element {
  const [currentGuess, setCurrentGuess] = React.useState<string>('');

  const currentLex = currentGuess.trim().toLowerCase();
  const ownSecret = !!(
    secretWords?.human.some(([lex, revealed]) => lex === currentLex && !revealed)
  );
  const warnDuplicate = story.some(([lex]) => currentLex === lex);

  return (
    <Stack direction="row" gap={1}>
      <TextField
        value={currentGuess}
        disabled={!humanTurn || gameState !== GameState.Play}
        color={toColor(ownSecret, warnDuplicate)}
        variant="outlined"
        label={toLabel(ownSecret, warnDuplicate)}
        spellCheck
        size="small"
        onChange={({ target: { value } }) => setCurrentGuess(value)}
        onKeyDown={({ key }) => {
          if (key === 'Enter' && !ownSecret && humanTurn && currentGuess.length > 0) {
            onAddGuess(currentGuess);
            setCurrentGuess('');
          }
        }}
      />
      <Button
        variant="contained"
        onClick={() => { onAddGuess(currentLex); setCurrentGuess(''); }}
        startIcon={<FontAwesomeIcon icon={faComment} />}
        disabled={ownSecret || !humanTurn}
      >
        Submit
      </Button>
    </Stack>
  );
}

export default GuessInput;
