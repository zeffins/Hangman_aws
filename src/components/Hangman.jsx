import React, { useState, useEffect } from 'react';
import HangmanDrawing from './HangmanDrawing';
import '../styles/Hangman.css';
import { div } from 'three/tsl';

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

const getRandomWord = () => {
  return words[Math.floor(Math.random() * words.length)];
};

const maxWrongGuesses = 6;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const Hangman = ({difficulty}) => {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(true);
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState('');
  const [score, setScore] = useState(0);

  const calculateScore = () => {
    const baseScore = 100;
    const penaltyPerWrongGuess = 10;
    return baseScore - (wrongGuesses * penaltyPerWrongGuess);
  };

  const handleGuess = (letter) => {
    if (gameOver || guessedLetters.has(letter)) return;

    const newGuessedLetters = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      if (newWrongGuesses === maxWrongGuesses) {
        setGameOver(true);
        setGameResult(`Game Over! The word was: ${word}`);
      }
    } else {
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

  const resetGame = () => {
    setLoading(true);
    setWord(getRandomWord());
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameOver(false);
    setGameResult('');
    setLoading(false);
  };

  const maskedWord = word
    .split('')
    .map(letter => guessedLetters.has(letter) ? letter : '_')
    .join(' ');

  useEffect(() => {
    const handleKeyPress = (event) => {
      const letter = event.key.toUpperCase();
      if (alphabet.includes(letter) && !guessedLetters.has(letter) && !loading && !gameOver) {
        handleGuess(letter);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [guessedLetters, gameOver, loading, word]);

  useEffect(() => {
    resetGame();
  }, []);

  return (
    <div className="hangman-container">
      {loading ? (
        <div className="loading">
          <div className="loading-text">Loading new word...</div>
        </div>
      ) : (
        <>
          <h1 className='title'>Hangman</h1>
          <HangmanDrawing wrongGuesses={wrongGuesses} />
          
          <div className="word-display">{maskedWord}</div>
          
          <div className="game-info">
            <div className="score">Score : <span>{score}</span></div>
            <div className="guesses-remaining">
              Remaining Guesses : <span>{maxWrongGuesses - wrongGuesses}</span>
            </div>
            <div className='difficulty'>
            Difficulty : <span>{difficulty}</span>
            </div>
          </div>

          {gameOver ? (
            <div className="game-result-container">
            <div className={`game-result ${gameResult.includes('Win') ? 'win' : 'lose'}`}>
              <p>{gameResult}</p>
              <button 
                type="button"
                onClick={resetGame}
                className="reset-button"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Play Again'}
              </button>
            </div>
            </div>
          ) : (
            <div className="keyboard">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => handleGuess(letter)}
                  disabled={guessedLetters.has(letter) || loading}
                  className={`key ${guessedLetters.has(letter) ? 'used' : ''}`}
                >
                  {letter}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Hangman;
