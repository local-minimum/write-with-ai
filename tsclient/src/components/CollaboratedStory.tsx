import { Typography } from '@mui/material';
import * as React from 'react';
import TextWordSpan, { TextWord } from './TextWord';

interface CollaboratedStoryProps {
  story: TextWord[];
}

function CollaboratedStory({ story }: CollaboratedStoryProps): JSX.Element {
  return (
    <Typography sx={{ fontFamily: 'monospace', padding: 2, flex: 1 }}>
      {story.map(([word, byHuman], idx) => (
        <TextWordSpan
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          word={word}
          byHuman={byHuman}
        />
      ))}
    </Typography>
  );
}

export default CollaboratedStory;
