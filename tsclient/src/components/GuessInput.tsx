import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Stack, TextField } from '@mui/material';
import * as React from 'react';
import { SecretWords } from '../api/types';
import GameState from '../GameState';

interface GuessInputProps {
  gameState: GameState;
  secretWords: SecretWords | undefined;
  humanTurn: boolean;
  onAddGuess: (word: string) => void;
}

function GuessInput({
  gameState, secretWords, humanTurn, onAddGuess,
}: GuessInputProps): JSX.Element {
  const [currentGuess, setCurrentGuess] = React.useState<string>('');

  const currentLex = currentGuess.trim().toLowerCase();
  const ownSecret = !!(
    secretWords?.human.some(([lex, revealed]) => lex === currentLex && !revealed)
  );
  return (
    <Stack direction="row" gap={1}>
      <TextField
        value={currentGuess}
        disabled={!humanTurn || gameState !== GameState.Play}
        color={ownSecret ? 'error' : undefined}
        variant="outlined"
        label={ownSecret ? 'You can\'t use your own secrets' : 'Input word'}
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
