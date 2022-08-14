import { faPerson, faRobot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Paper, Typography, Stack, Button, Box,
} from '@mui/material';
import * as React from 'react';
import { SecretWords } from '../api/types';
import GameState from '../GameState';
import CollaboratedStory from './CollaboratedStory';
import GuessInput from './GuessInput';
import SecretWordsView from './SecretWordsView';
import { TextWord } from './TextWord';

interface GameProps {
  secretWords?: SecretWords;
  story: TextWord[];
  gameState: GameState;
  humanTurn: boolean;
  onAddGuess: (word: string) => void;
  smallVictory: boolean;
  onProgressGameState: () => void;
}

/*
#D0FEF5
#FAB2EA
#4A051C
#52FFB8
#830A48
*/

function Game({
  secretWords, story, gameState, humanTurn, onAddGuess, smallVictory,
  onProgressGameState,
}: GameProps): JSX.Element {
  return (
    <Paper sx={{ m: 2, minHeight: '90vh', padding: 1 }} elevation={2}>
      <Typography variant="h1">Collaborate Human!</Typography>
      <Stack sx={{ maxWidth: '800px' }} gap={1}>
        <SecretWordsView secretWords={secretWords} gameState={gameState} />
        <CollaboratedStory story={story} />
        <GuessInput
          story={story}
          gameState={gameState}
          secretWords={secretWords}
          humanTurn={humanTurn}
          onAddGuess={onAddGuess}
        />
        {gameState === GameState.Play && smallVictory && (
          <Stack>
            <Button
              variant="outlined"
              onClick={onProgressGameState}
              title="Have made a long text together and gotten almost all words"
              startIcon={<FontAwesomeIcon icon={faPerson} />}
              endIcon={<FontAwesomeIcon icon={faRobot} />}
            >
              Claim minor victory.
            </Button>
            <Box sx={{ flex: 1 }} />
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

export default Game;
