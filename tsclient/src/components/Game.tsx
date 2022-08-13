import { Paper, Typography } from '@mui/material';
import * as React from 'react';

function Game(): JSX.Element {
  return (
    <Paper sx={{ m: 2 }} elevation={2}>
      <Typography variant="h1">Collaborate Human!</Typography>
    </Paper>
  );
}

export default Game;
