import * as React from 'react';
import { Grid, Typography } from '@mui/material';
import { SecretWords } from '../api/types';
import GuessWordSpan from './GuessWord';

interface SecretWordsViewProps {
  secretWords?: SecretWords;
}

function SecretWordsView({ secretWords }: SecretWordsViewProps): JSX.Element {
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography variant="h6">Your secret words</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6">AI&apos;s secret words</Typography>
      </Grid>
      <Grid item xs={6}>
        {secretWords === undefined ? (
          <i>Waiting for game...</i>
        ) : secretWords.human.map(([word, revealed]) => (
          <GuessWordSpan key={word} word={word} revealed={revealed} humanWord />
        ))}
      </Grid>
      <Grid item xs={6}>
        {secretWords === undefined ? (
          <i>Waiting for game...</i>
        ) : secretWords.ai.map(
          ([word, revealed]) => <GuessWordSpan key={word} word={word} revealed={revealed} />,
        )}
      </Grid>
    </Grid>
  );
}

export default SecretWordsView;
