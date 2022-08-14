import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import createGame from '../api/createGame';
import makeAIGuess from '../api/makeAIGuess';
import { SecretWords } from '../api/types';
import Game from '../components/Game';
import Preamble from '../components/Preable';
import { TextWord } from '../components/TextWord';

import GameState from '../GameState';
import useStoredValue from '../hooks/useStoredValue';
import {
  asLex, isPunctuation, isSpace, reveal,
} from '../tools/guess';
import generate from '../tools/prompt';

function GameContainer(): JSX.Element {
  const [gameState, setGameState] = useStoredValue<GameState>('game-state', GameState.Preamble);
  const [story, setStory] = useStoredValue<TextWord[]>('story', []);
  const [secretWords, setSecretWords] = useStoredValue<SecretWords | undefined>('secret-words', undefined);
  const [humanTurn, setHumanTurn] = useStoredValue<boolean>('human-turn', false);

  const handleNextState = React.useCallback((): void => {
    switch (gameState) {
      case GameState.Preamble:
        return setGameState(GameState.Introduction);
      case GameState.Introduction:
        return setGameState(GameState.Prompt);
      case GameState.Prompt:
        return setGameState(GameState.Setup);
      case GameState.Setup:
        return setGameState(GameState.Play);
      case GameState.Play:
        return setGameState(GameState.Victory);
      case GameState.Victory:
        return setGameState(GameState.Prompt);
      default:
        return setGameState(GameState.Preamble);
    }
  }, [gameState, setGameState]);

  useQuery(
    ['generate'],
    () => createGame(story),
    {
      staleTime: Infinity,
      enabled: gameState === GameState.Setup,
      onSuccess(data) {
        setSecretWords(data);
        setHumanTurn(true);
        handleNextState();
      },
    },
  );

  useQuery(
    ['ai-guess'],
    () => makeAIGuess(story),
    {
      enabled: gameState === GameState.Play && !humanTurn,
      onSuccess(newStory) {
        setStory(newStory);

        if (secretWords !== undefined) {
          const [lex] = newStory[newStory.length - 1];
          const idx = secretWords.human.findIndex(([sLex]) => sLex === lex);
          if (idx >= 0) {
            setSecretWords({ human: reveal(secretWords.human, idx), ai: secretWords.ai });
          }
        }

        setHumanTurn(true);
      },
    },
  );

  const handleHumanGuess = React.useCallback((guess: string): void => {
    if (isSpace(guess)) return;

    if (secretWords !== undefined) {
      const lex = asLex(guess);
      const idx = secretWords.ai.findIndex(([sLex]) => sLex === lex);
      if (idx >= 0) {
        setSecretWords({ human: secretWords.human, ai: reveal(secretWords.ai, idx) });
      }
    }

    setStory([...story, [' ', false], [guess, true]]);

    if (!isPunctuation(guess)) {
      setHumanTurn(false);
    }
  }, [secretWords, setHumanTurn, setSecretWords, setStory, story]);

  React.useEffect(() => {
    if (gameState === GameState.Introduction) {
      handleNextState();
    } else if (gameState === GameState.Prompt) {
      setStory(generate());
      handleNextState();
    }
  }, [gameState, handleNextState, setStory]);

  return (
    <>
      <Preamble gameState={gameState} onNextState={handleNextState} />
      <Game
        gameState={gameState}
        story={story}
        secretWords={secretWords}
        onAddGuess={handleHumanGuess}
        humanTurn={humanTurn}
      />
    </>
  );
}

export default GameContainer;
