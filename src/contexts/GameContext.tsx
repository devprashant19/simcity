import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PathType = 'ninja' | 'elves' | 'dwarves';
export type RankType = 'S' | 'A' | 'B';

interface GameState {
  selectedPath: PathType | null;
  round1Answers: string[];
  round2Answers: string[];
  riddleAnswers: string[];
  rank: RankType | null;
  riddlesSolved: number;
  isPromoted: boolean;
}

interface GameContextType {
  gameState: GameState;
  setSelectedPath: (path: PathType) => void;
  addRound1Answer: (answer: string) => void;
  addRound2Answer: (answer: string) => void;
  addRiddleAnswer: (answer: string) => void;
  calculateResults: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  selectedPath: null,
  round1Answers: [],
  round2Answers: [],
  riddleAnswers: [],
  rank: null,
  riddlesSolved: 0,
  isPromoted: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const setSelectedPath = (path: PathType) => {
    setGameState(prev => ({ ...prev, selectedPath: path }));
  };

  const addRound1Answer = (answer: string) => {
    setGameState(prev => ({
      ...prev,
      round1Answers: [...prev.round1Answers, answer],
    }));
  };

  const addRound2Answer = (answer: string) => {
    setGameState(prev => ({
      ...prev,
      round2Answers: [...prev.round2Answers, answer],
    }));
  };

  const addRiddleAnswer = (answer: string) => {
    setGameState(prev => ({
      ...prev,
      riddleAnswers: [...prev.riddleAnswers, answer],
    }));
  };

  const calculateResults = () => {
    // Simulate riddles solved (in real app, this would be evaluated)
    const riddlesSolved = Math.floor(Math.random() * 5) + 10; // 10-14 for demo
    
    // Calculate rank based on MCQ performance (simplified)
    const totalAnswers = gameState.round1Answers.length + gameState.round2Answers.length;
    let rank: RankType;
    if (totalAnswers >= 12) {
      rank = 'S';
    } else if (totalAnswers >= 8) {
      rank = 'A';
    } else {
      rank = 'B';
    }

    // Determine promotion
    let isPromoted = false;
    if (rank === 'S' && riddlesSolved >= 10) isPromoted = true;
    if (rank === 'A' && riddlesSolved >= 12) isPromoted = true;
    if (rank === 'B' && riddlesSolved >= 14) isPromoted = true;

    setGameState(prev => ({
      ...prev,
      rank,
      riddlesSolved,
      isPromoted,
    }));
  };

  const resetGame = () => {
    setGameState(initialState);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        setSelectedPath,
        addRound1Answer,
        addRound2Answer,
        addRiddleAnswer,
        calculateResults,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
