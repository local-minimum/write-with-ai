import { faPerson } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Link, List, ListItem, ListItemText, Typography,
} from '@mui/material';
import * as React from 'react';
import GameState from '../GameState';

interface PreambleProps {
  gameState: GameState;
  onNextState: () => void;
}

function Preamble({ gameState, onNextState }: PreambleProps): JSX.Element {
  return (
    <Dialog open={gameState === GameState.Preamble} onClose={onNextState}>
      <DialogTitle>Hello Human</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          A friendly word before we begin and we let the very polite AI loose.
          I feel as the creator that I should say a few things about
          this game...
        </DialogContentText>
        <DialogContentText gutterBottom>
          This is a word guessing game where
          {' '}
          <b>you</b>
          {' '}
          (human) and the
          {' '}
          <b>Resident Champion</b>
          {' '}
          (AI) each get three words that the
          other doesn&apos;t know about. Thereafter you take turns
          inputting words with the aim of guessing each other&apos;s using
          as few guesses as possible.
          When you as a
          {' '}
          <b>team</b>
          {' '}
          have each others&apos; you win
          (or if there is only one left and you&apos;ve been at it for a long time
          it is also a kind of victory).
          Each side only knows the common written story and how long the hidden
          words are.
        </DialogContentText>
        <DialogContentText gutterBottom>
          Either you learn to
          {' '}
          <i>collaborate</i>
          {' '}
          and both become winners,
          or neither will succeed.
          This is
          {' '}
          <i>not</i>
          {' '}
          a game about being better than the other,
          not a prooving ground for silicon vs carbon,
          brains vs cpus.
        </DialogContentText>
        <DialogContentText variant="caption" gutterBottom sx={{ marginTop: 1 }}>
          The game was originally created for
          {' '}
          <Link href="https://itch.io/jam/wowie-jam-4">Wowie! Jam 4.0</Link>
          .
          <br />
          You can find the source and contribute or fork it
          {' '}
          <Link href="https://github.com/local-minimum/write-with-ai">here</Link>
          .
        </DialogContentText>
        <Typography variant="h6" sx={{ marginTop: 1, marginBottom: 0.5 }}>
          Some credits:
        </Typography>
        <List sx={{ padding: 0 }}>
          <ListItem>
            <ListItemText>
              The AI dataset comes from:
              {' '}
              <i>
                Jeffrey Pennington, Richard Socher, and Christopher D. Manning. 2014.
                GloVe: Global Vectors for Word Representation
              </i>
            </ListItemText>
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={onNextState}
          startIcon={<FontAwesomeIcon icon={faPerson} />}
        >
          Got it!
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Preamble;
