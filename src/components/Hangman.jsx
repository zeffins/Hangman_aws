import React, { useState, useEffect } from 'react';
import GameNPC from './GameNPC';
import HangmanDrawing from './HangmanDrawing';
import '../styles/Hangman.css';

const words = [
  'APPLICATION',
  'FUNCTION',
  'VARIABLE',
  'COMPONENT',
  'INTERFACE',
  'FRONTEND',
  'BACKEND',
  'DEPLOYMENT',
  'PYTHON',
  'JAVA',
  'TYPESCRIPT',
  'ANGULAR',
  'DOCKER',
  'KUBERNETES',
  'MONGODB',
  'POSTGRESQL',
  'LINUX',
  'WINDOWS',
];

const maxWrongGuesses = 6;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const Hangman = () => {
  const [word, setWord] = useState(words[Math.floor(Math.random() * words.length)]);
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [npcMood, setNpcMood] = useState('neutral');
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState('');
  const [score, setScore] = useState(0);

  const handleGuess = (letter) => {
    if (gameOver || guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      setNpcMood('wrong');
      
      // Check for loss condition
      if (newWrongGuesses === maxWrongGuesses) {
        setGameOver(true);
        setGameResult(`Game Over! The word was: ${word}`);
      }
    } else {
      setNpcMood('correct');
      
      // Check for win condition
      const isWordComplete = [...word].every(char => 
        newGuessedLetters.has(char)
      );
      if (isWordComplete) {
        setGameOver(true);
        setGameResult('Congratulations! You Win!');
        setScore(score + calculateScore());
      }
    }
  };

  const calculateScore = () => {
    const baseScore = 100;
    const penaltyPerWrongGuess = 10;
    return baseScore - (wrongGuesses * penaltyPerWrongGuess);
  };

  const resetGame = () => {
    setWord(words[Math.floor(Math.random() * words.length)]);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setNpcMood('neutral');
    setGameOver(false);
    setGameResult('');
  };

  // Create masked word with dashes
  const maskedWord = word
    .split('')
    .map(letter => guessedLetters.has(letter) ? letter : '_')
    .join(' ');

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event) => {
      const letter = event.key.toUpperCase();
      if (alphabet.includes(letter) && !guessedLetters.has(letter)) {
        handleGuess(letter);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [guessedLetters, gameOver]);

  return (
    <div className="hangman-container">
      <GameNPC mood={npcMood} />
      <HangmanDrawing wrongGuesses={wrongGuesses} />
      
      <div className="word-display">{maskedWord}</div>
      
      <div className="game-info">
        <div className="score">Score: {score}</div>
        <div className="guesses-remaining">
          Remaining Guesses: {maxWrongGuesses - wrongGuesses}
        </div>
      </div>

      {gameOver ? (
        <div className={`game-result ${gameResult.includes('Win') ? 'win' : 'lose'}`}>
          <p>{gameResult}</p>
          <button onClick={resetGame} className="reset-button">
            Play Again
          </button>
        </div>
      ) : (
        <div className="keyboard">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guessedLetters.has(letter)}
              className={`key ${guessedLetters.has(letter) ? 'used' : ''}`}
            >
              {letter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hangman;
//hello