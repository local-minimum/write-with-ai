import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import createGame from '../api/createGame';
import { SecretWords } from '../api/types';
import Game from '../components/Game';
import Preamble from '../components/Preable';
import { TextWord } from '../components/TextWord';

import GameState from '../GameState';
import useStoredValue from '../hooks/useStoredValue';
import generate from '../tools/prompt';

function GameContainer(): JSX.Element {
  const [gameState, setGameState] = useStoredValue<GameState>('game-state', GameState.Preamble);
  const [story, setStory] = useStoredValue<TextWord[]>('story', []);
  const [secretWords, setSecretWords] = useStoredValue<SecretWords | undefined>('secret-words', undefined);

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
        handleNextState();
        setSecretWords(data);
      },
    },
  );

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
      />
    </>
  );
}

export default GameContainer;
