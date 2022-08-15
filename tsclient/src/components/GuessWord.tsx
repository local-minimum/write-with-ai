import * as React from 'react';
import { styled } from '@mui/system';

const Hidden = styled('span')({
  backgroundColor: '#4A051C',
  fontFamily: 'monospace',
  marginLeft: 2,
  marginRight: 2,
  paddingLeft: 8,
  paddingRight: 8,
  paddingTop: 2,
  paddingBottom: 2,
  color: '#eee',
});

const Solved = styled('span')({
  backgroundColor: '#52FFB8',
  fontFamily: 'monospace',
  marginLeft: 2,
  marginRight: 2,
  paddingLeft: 8,
  paddingRight: 8,
  paddingTop: 2,
  paddingBottom: 2,
  textTransform: 'uppercase',
});

const Unsolved = styled('span')({
  backgroundColor: '#FAB2EA',
  fontFamily: 'monospace',
  marginLeft: 2,
  marginRight: 2,
  paddingLeft: 8,
  paddingRight: 8,
  paddingTop: 2,
  paddingBottom: 2,
  textTransform: 'uppercase',
});

interface GuessWordProps {
  word: string;
  revealed: boolean;
  humanWord?: boolean;
}

function GuessWordSpan({ word, revealed, humanWord = false }: GuessWordProps): JSX.Element {
  if (revealed) return <Solved>{word}</Solved>;
  if (humanWord) return <Unsolved>{word}</Unsolved>;
  return <Hidden>{word.replace(/./g, '?')}</Hidden>;
}

export default GuessWordSpan;
