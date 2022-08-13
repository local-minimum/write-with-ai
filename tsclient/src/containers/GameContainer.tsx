import * as React from 'react';
import Game from '../components/Game';
import Preamble from '../components/Preable';

import GameState from '../GameState';
import useStoredValue from '../hooks/useStoredValue';

function GameContainer(): JSX.Element {
  const [gameState, setGameState] = useStoredValue<GameState>('game-state', GameState.Preamble);

  const handleNextState = React.useCallback((): void => {
    switch (gameState) {
      case GameState.Preamble:
        return setGameState(GameState.Introduction);
      case GameState.Introduction:
        return setGameState(GameState.Prompt);
      case GameState.Prompt:
        return setGameState(GameState.Play);
      case GameState.Play:
        return setGameState(GameState.Victory);
      case GameState.Victory:
        return setGameState(GameState.Prompt);
      default:
        return setGameState(GameState.Preamble);
    }
  }, [gameState, setGameState]);

  return (
    <>
      <Preamble gameState={gameState} onNextState={handleNextState} />
      <Game
        gameState={gameState}
        text={[
          ['This', true], [' ', true],
          ['was', true], [' ', true],
          ['a', true], [' ', true],
          ['story', true], [' ', true],
          ['about', true], [' ', true],
          ['collaboration', false], ['.', false],
        ]}
      />
    </>
  );
}

export default GameContainer;
