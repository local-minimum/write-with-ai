import {
  Paper, Typography, Stack,
} from '@mui/material';
import * as React from 'react';
import { SecretWords } from '../api/types';
import GameState from '../GameState';
import CollaboratedStory from './CollaboratedStory';
import SecretWordsView from './SecretWordsView';
import { TextWord } from './TextWord';

interface GameProps {
  secretWords?: SecretWords;
  text: TextWord[];
  gameState: GameState;
}

/*
#D0FEF5
#FAB2EA
#4A051C
#52FFB8
#830A48
*/

function Game({ secretWords, text, gameState }: GameProps): JSX.Element {
  return (
    <Paper sx={{ m: 2, minHeight: '90vh', padding: 1 }} elevation={2}>
      <Typography variant="h1">Collaborate Human!</Typography>
      <Stack sx={{ maxWidth: '800px' }} gap={1}>
        <SecretWordsView secretWords={secretWords} />
        <CollaboratedStory story={text} />
      </Stack>
    </Paper>
  );
}

export default Game;