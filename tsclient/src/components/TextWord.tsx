import * as React from 'react';
import { styled } from '@mui/system';

export type TextWord = [word: string, byHuman: boolean];

interface TextWordSpanProps {
  word: string;
  byHuman: boolean;
}

const HumanWord = styled('span')({
  color: '#52FFB8',
  fontFamily: 'monospace',
});

const AIWord = styled('span')({
  color: '#830A48',
  fontFamily: 'monospace',
});

function TextWordSpan({ word, byHuman }: TextWordSpanProps): JSX.Element {
  if (byHuman) return <HumanWord>{word}</HumanWord>;
  return <AIWord>{word}</AIWord>;
}

export default TextWordSpan;
