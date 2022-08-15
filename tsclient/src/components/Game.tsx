import { faPerson, faRobot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Paper, Typography, Stack, Button, Box,
} from '@mui/material';
import * as React from 'react';
import { SecretWords } from '../api/types';
import GameState from '../GameState';
import { isPunctuation } from '../tools/guess';
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
  onResetGame: () => void;
  onSurrender: () => void;
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
  onProgressGameState, onResetGame, onSurrender,
}: GameProps): JSX.Element {
  const words = story.filter(([lex]) => !isPunctuation(lex)).length;

  return (
    <Paper sx={{ m: 2, minHeight: '90vh', padding: 1 }} elevation={2}>
      <Typography variant="h1">Collaborate, Human!</Typography>
      <Stack sx={{ maxWidth: '800px' }} gap={1}>
        <SecretWordsView secretWords={secretWords} gameState={gameState} />
        <CollaboratedStory story={story} />
        <Typography variant="caption" gutterBottom>
          {`${words} word${words === 1 ? '' : 's'}`}
        </Typography>
        <GuessInput
          story={story}
          gameState={gameState}
          secretWords={secretWords}
          humanTurn={humanTurn}
          onAddGuess={onAddGuess}
        />
        <Stack direction="row">
          {gameState === GameState.Play && smallVictory && (
            <Button
              variant="outlined"
              onClick={onProgressGameState}
              title="Have made a long text together and gotten almost all words"
              startIcon={<FontAwesomeIcon icon={faPerson} />}
              endIcon={<FontAwesomeIcon icon={faRobot} />}
            >
              Claim minor victory.
            </Button>
          )}
          {gameState === GameState.Play && !smallVictory && words > 75 && (
            <Button
              variant="outlined"
              onClick={onSurrender}
              title="Have made a long text together and that at least counts for something"
              startIcon={<FontAwesomeIcon icon={faPerson} />}
              endIcon={<FontAwesomeIcon icon={faRobot} />}
            >
              Give up
            </Button>
          )}
          {gameState === GameState.Surrender && (
            <Button
              variant="outlined"
              onClick={onResetGame}
              title="Everyone has to start cooperation somewhere"
              startIcon={<FontAwesomeIcon icon={faPerson} />}
              endIcon={<FontAwesomeIcon icon={faRobot} />}
            >
              New Attempt
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
        </Stack>
      </Stack>
    </Paper>
  );
}

export default Game;
