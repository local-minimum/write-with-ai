import * as React from 'react';
import { Grid, Typography } from '@mui/material';
import { SecretWords } from '../api/types';
import GuessWordSpan from './GuessWord';
import GameState from '../GameState';

interface SecretWordsViewProps {
  secretWords?: SecretWords;
  gameState: GameState;
}

function SecretWordsView({ secretWords, gameState }: SecretWordsViewProps): JSX.Element {
  const revealAll = gameState === GameState.Victory;
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography variant="h6">Your secret words:</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6">AI&apos;s secret words:</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant={secretWords === undefined ? 'caption' : 'h6'}>
          {secretWords === undefined ? (
            <i>Waiting for game...</i>
          ) : secretWords.human.map(([word, revealed]) => (
            <GuessWordSpan key={word} word={word} revealed={revealed || revealAll} humanWord />
          ))}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant={secretWords === undefined ? 'caption' : 'h6'}>
          {secretWords === undefined ? (
            <i>Waiting for game...</i>
          ) : secretWords.ai.map(
            ([word, revealed]) => (
              <GuessWordSpan key={word} word={word} revealed={revealed || revealAll} />
            ),
          )}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default SecretWordsView;
