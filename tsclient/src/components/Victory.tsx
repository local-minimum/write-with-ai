import { faHandshake, faPerson, faRobot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import * as React from 'react';
import GameState from '../GameState';
import { isPunctuation } from '../tools/guess';
import { TextWord } from './TextWord';

interface VictoryProps {
  gameState: GameState;
  majorVictory: boolean;
  story: TextWord[];
  onNewGame: () => void;
}

function Victory({
  gameState, majorVictory, story, onNewGame,
}: VictoryProps): JSX.Element {
  const [forceClose, setForceClose] = React.useState(false);

  return (
    <Dialog
      open={gameState === GameState.Victory && !forceClose}
      onClose={() => setForceClose(true)}
    >
      <DialogTitle>
        <FontAwesomeIcon icon={faPerson} />
        {' '}
        Team
        {' '}
        <FontAwesomeIcon icon={faHandshake} />
        {' '}
        Work
        {' '}
        <FontAwesomeIcon icon={faRobot} />
      </DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          {
            majorVictory
              ? 'Together you found all of each others secret words! '
              : 'While you didn\'t find all of the secret words, you did a mighty good job! '
          }
          The most important thing is that you worked as a team
          and that you became closer.
        </DialogContentText>
        <DialogContentText>
          All you needed was
          {' '}
          {story.filter(([lex]) => !isPunctuation(lex)).length}
          {' '}
          words... it&apos;s as if your brains are on the same
          wavelength.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onNewGame}
          startIcon={<FontAwesomeIcon icon={faPerson} />}
          endIcon={<FontAwesomeIcon icon={faRobot} />}
          title="Become an even stronger team"
          variant="outlined"
        >
          New Game
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Victory;
