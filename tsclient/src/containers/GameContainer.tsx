import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import createGame from '../api/createGame';
import makeAIGuess from '../api/makeAIGuess';
import { SecretWords } from '../api/types';
import Game from '../components/Game';
import Preamble from '../components/Preable';
import { TextWord } from '../components/TextWord';
import Victory from '../components/Victory';

import GameState from '../GameState';
import usePrevious from '../hooks/usePrevious';
import useStoredValue from '../hooks/useStoredValue';
import {
  asLex, isPunctuation, isSpace, reveal, transformGuess,
} from '../tools/guess';
import generate from '../tools/prompt';

function GameContainer(): JSX.Element {
  const queryClient = useQueryClient();
  const [leadHidden, setLeadHidden] = React.useState<number>(0);

  const [gameState, setGameState] = useStoredValue<GameState>('game-state', GameState.Preamble);
  const [story, setStory] = useStoredValue<TextWord[]>('story', []);
  const [secretWords, setSecretWords] = useStoredValue<SecretWords | undefined>('secret-words', undefined);
  const [humanTurn, setHumanTurn] = useStoredValue<boolean>('human-turn', false);

  const prevHumanTurn = usePrevious(humanTurn);

  const updateAIHMM = React.useCallback(() => {
    const remainHuman = secretWords?.human.filter(([, revealed]) => !revealed).length ?? 0;
    const remainAI = secretWords?.ai.filter(([, revealed]) => !revealed).length ?? 0;

    if (leadHidden < 0) {
      const stay = 1 + (remainAI + 1) / (remainHuman + 1);
      const leave = remainHuman > 0 ? Math.abs(leadHidden) / 5 : 0;
      const switchMode = Math.random() * (stay + leave) > stay;
      setLeadHidden(switchMode ? 1 : leadHidden - 1);
    } else if (leadHidden > 0) {
      const stay = 1 + (remainHuman + 1) / (remainAI + 1);
      const leave = remainAI > 0 ? leadHidden / 5 : 0;
      const switchMode = Math.random() * (stay + leave) > stay;
      setLeadHidden(switchMode ? -1 : leadHidden + 1);
    } else {
      const lead = Math.random() > 0.8 ? -1 : 1;
      setLeadHidden(lead ? -1 : 1);
    }
  }, [secretWords, leadHidden, setLeadHidden]);

  React.useEffect(() => {
    if (prevHumanTurn === false && humanTurn) {
      updateAIHMM();
    }
  }, [humanTurn, prevHumanTurn, updateAIHMM]);

  const handleResetGame = React.useCallback((): void => {
    setSecretWords(undefined);
    setGameState(GameState.Prompt);
  }, [setGameState, setSecretWords]);

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
        setSecretWords(undefined);
        return setGameState(GameState.Prompt);
      default:
        return setGameState(GameState.Preamble);
    }
  }, [gameState, setGameState, setSecretWords]);

  useQuery(
    ['generate'],
    () => createGame(story),
    {
      staleTime: Infinity,
      enabled: gameState === GameState.Setup,
      onSuccess: (data) => {
        setSecretWords(data);
        setHumanTurn(true);
        handleNextState();
      },
    },
  );

  useQuery(
    ['ai-guess'],
    () => makeAIGuess(story, secretWords, leadHidden < 0),
    {
      enabled: gameState === GameState.Play && !humanTurn,
      onSuccess: (lex) => {
        const isWord = !isPunctuation(lex);

        if (secretWords !== undefined) {
          const idx = secretWords.human.findIndex(([sLex]) => sLex === lex);
          if (idx >= 0) {
            setSecretWords({ human: reveal(secretWords.human, idx), ai: secretWords.ai });
          }
        }

        const word = transformGuess(lex, story[story.length - 1]?.[0]);
        if (isWord) {
          setStory([...story, [' ', false], [word, false]]);
          setHumanTurn(true);
        } else {
          setStory([...story, [word, false]]);
          queryClient.invalidateQueries(['ai-guess']);
        }
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

    if (isPunctuation(guess)) {
      setStory([...story, [guess, true]]);
    } else {
      setStory([...story, [' ', false], [guess, true]]);
      setHumanTurn(false);
    }

    updateAIHMM();
  }, [secretWords, setHumanTurn, setSecretWords, setStory, story, updateAIHMM]);

  const [smallVictory, majorVictory] = React.useMemo(() => {
    if (
      secretWords === undefined
      || (gameState !== GameState.Play && gameState !== GameState.Victory)
    ) {
      return [false, false];
    }

    const revealed = secretWords.ai.filter(([_, rev]) => rev).length
      + secretWords.human.filter(([_, rev]) => rev).length;

    return [
      revealed >= 5 && story.length > 200,
      revealed === 6,
    ];
  }, [gameState, secretWords, story.length]);

  React.useEffect(() => {
    if (gameState === GameState.Introduction) {
      handleNextState();
    } else if (gameState === GameState.Prompt) {
      setStory(generate());
      handleNextState();
    } else if (gameState === GameState.Play && majorVictory) {
      handleNextState();
    }
  }, [majorVictory, gameState, handleNextState, setStory]);

  return (
    <>
      <Preamble gameState={gameState} onNextState={handleNextState} />
      <Victory
        gameState={gameState}
        onNewGame={handleResetGame}
        majorVictory={majorVictory}
        story={story}
      />
      <Game
        gameState={gameState}
        story={story}
        secretWords={secretWords}
        onAddGuess={handleHumanGuess}
        humanTurn={humanTurn}
        smallVictory={smallVictory}
        onProgressGameState={handleNextState}
        onResetGame={handleResetGame}
      />
    </>
  );
}

export default GameContainer;
