import { useState, useCallback } from 'react';

export const useGameLogic = (initialWords) => {
  const [word, setWord] = useState(() => initialWords[Math.floor(Math.random() * initialWords.length)]);
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [npcMood, setNpcMood] = useState('neutral');
  const [isWinner, setIsWinner] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const resetGame = useCallback(() => {
    setWord(initialWords[Math.floor(Math.random() * initialWords.length)]);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setNpcMood('neutral');
    setIsWinner(false);
    setIsGameOver(false);
  }, [initialWords]);

  const makeGuess = useCallback((letter) => {
    if (isGameOver || isWinner || guessedLetters.has(letter)) {
      return;
    }
    
    const newGuessedLetters = new Set([...guessedLetters, letter]);
    setGuessedLetters(newGuessedLetters);
    
    if (!word.includes(letter)) {
      setWrongGuesses(prev => prev + 1);
      setNpcMood('sad');
    } else {
      setNpcMood('happy');
    }
    
    setTimeout(() => {
      setNpcMood('neutral');
    }, 2000);
  }, [isGameOver, isWinner, guessedLetters, word]);

  return {
    word,
    guessedLetters,
    wrongGuesses,
    npcMood,
    isWinner,
    isGameOver,
    resetGame,
    makeGuess,
    setIsWinner,
    setIsGameOver,
  };
};