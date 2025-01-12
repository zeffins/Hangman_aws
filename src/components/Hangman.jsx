// Hangman.jsx
import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Hangman.css';

// Word sets organized by difficulty
const WORD_SETS = {
  EASY: [
    'JAVA',
    'PYTHON',
    'HTML',
    'CSS',
    'REACT',
    'LINUX',
    'DOCKER',
    'GIT',
    'NODE',
    'API'
  ],
  MEDIUM: [
    'FUNCTION',
    'VARIABLE',
    'FRONTEND',
    'BACKEND',
    'MONGODB',
    'ANGULAR',
    'WINDOWS',
    'POSTGRES',
    'EXPRESS',
    'TYPESCRIPT'
  ],
  HARD: [
    'APPLICATION',
    'KUBERNETES',
    'POSTGRESQL',
    'DEPLOYMENT',
    'INTERFACE',
    'MIDDLEWARE',
    'ALGORITHM',
    'ENCRYPTION',
    'MICROSERVICE',
    'ARCHITECTURE'
  ]
};

const Hangman = ({ difficulty = 'MEDIUM' }) => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState('');
  const [loading, setLoading] = useState(true);

  const maxWrongGuesses = 6;

  // Get random word based on difficulty
  const getRandomWord = () => {
    const wordSet = WORD_SETS[difficulty.toUpperCase()] || WORD_SETS.MEDIUM;
    return wordSet[Math.floor(Math.random() * wordSet.length)];
  };

  // Calculate score based on difficulty
  const calculateScore = () => {
    const baseScore = {
      EASY: 50,
      MEDIUM: 100,
      HARD: 150
    };
    
    const penaltyPerWrongGuess = {
      EASY: 5,
      MEDIUM: 10,
      HARD: 15
    };

    const difficultyLevel = difficulty.toUpperCase();
    return baseScore[difficultyLevel] - (wrongGuesses * penaltyPerWrongGuess[difficultyLevel]);
  };

  // Reset game state
  const resetGame = () => {
    setLoading(true);
    const newWord = getRandomWord();
    setWord(newWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameOver(false);
    setGameResult('');
    setLoading(false);
  };

  // Handle letter guess
  const handleGuess = useCallback((letter) => {
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
        setScore(prevScore => prevScore + calculateScore());
      }
    }
  }, [gameOver, guessedLetters, word, wrongGuesses, maxWrongGuesses]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameOver) return;
      
      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key) && !guessedLetters.has(key)) {
        handleGuess(key);
      }
    };

    // Add event listener
    window.addEventListener('keyup', handleKeyPress);

    // Cleanup: remove event listener
    return () => {
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, [guessedLetters, gameOver, handleGuess]);

  // Get hint based on difficulty
  const getHint = () => {
    switch(difficulty.toUpperCase()) {
      case 'EASY':
        return `Hint: The word has ${word.length} letters`;
      case 'MEDIUM':
        return `Hint: First letter is ${word[0]}`;
      case 'HARD':
        return 'No hints available in Hard mode!';
      default:
        return '';
    }
  };

  // Create masked word display
  const maskedWord = word
    .split('')
    .map(letter => guessedLetters.has(letter) ? letter : '_')
    .join(' ');

  // Generate keyboard
  const keyboard = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
    <button
      key={letter}
      className={`key ${guessedLetters.has(letter) ? 'used' : ''}`}
      onClick={() => handleGuess(letter)}
      disabled={guessedLetters.has(letter) || gameOver}
    >
      {letter}
    </button>
  ));

  // Reset game when difficulty changes
  useEffect(() => {
    resetGame();
  }, [difficulty]);

  const HangmanDrawing = ({ wrongGuesses }) => {
    return (
      <svg className="hangman-drawing" viewBox="0 0 200 250">
        {/* Base and Gallows - Always visible */}
        <g className="gallows">
          <line x1="40" y1="230" x2="160" y2="230" /> {/* Base */}
          <line x1="100" y1="230" x2="100" y2="30" />  {/* Vertical pole */}
          <line x1="100" y1="30" x2="150" y2="30" />   {/* Top */}
          <line x1="150" y1="30" x2="150" y2="50" />   {/* Noose */}
        </g>

        {/* Body Parts - Appear based on wrong guesses */}
        <g className="hangman-body">
          {wrongGuesses >= 1 && (
            <circle 
              cx="150" 
              cy="70" 
              r="20" 
              className="hangman-part head"
            />
          )}
          {wrongGuesses >= 2 && (
            <line 
              x1="150" 
              y1="90" 
              x2="150" 
              y2="150" 
              className="hangman-part body"
            />
          )}
          {wrongGuesses >= 3 && (
            <line 
              x1="150" 
              y1="110" 
              x2="120" 
              y2="140" 
              className="hangman-part left-arm"
            />
          )}
          {wrongGuesses >= 4 && (
            <line 
              x1="150" 
              y1="110" 
              x2="180" 
              y2="140" 
              className="hangman-part right-arm"
            />
          )}
          {wrongGuesses >= 5 && (
            <line 
              x1="150" 
              y1="150" 
              x2="120" 
              y2="180" 
              className="hangman-part left-leg"
            />
          )}
          {wrongGuesses >= 6 && (
            <line 
              x1="150" 
              y1="150" 
              x2="180" 
              y2="180" 
              className="hangman-part right-leg"
            />
          )}
        </g>
      </svg>
    );
  };

  return (
    <div className="hangman-container">
      {loading ? (
        <div className="loading">
          <div className="loading-text">Loading new word...</div>
        </div>
      ) : (
        <>
          <div className="game-header">
            <div className="score">Score: {score}</div>
            <div className="difficulty">
              Difficulty: <span className={`difficulty-${difficulty.toLowerCase()}`}>
                {difficulty}
              </span>
            </div>
            <div className="guesses">
              Guesses Left: {maxWrongGuesses - wrongGuesses}
            </div>
          </div>

          <HangmanDrawing wrongGuesses={wrongGuesses} />

          <div className="word-display" data-difficulty={difficulty.toLowerCase()}>
            {maskedWord}
          </div>

          {!gameOver && <div className="hint">{getHint()}</div>}

          {gameResult && (
            <div className={`game-result ${gameResult.includes('Win') ? 'win' : 'lose'}`}>
              {gameResult}
            </div>
          )}

          <div className="keyboard">
            {keyboard}
          </div>

          {gameOver && (
            <button className="reset-button" onClick={resetGame}>
              Play Again
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Hangman;
