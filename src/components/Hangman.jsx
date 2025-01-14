import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Hangman.css';

const WORD_SETS = {
  EASY: [
    {
      word: 'JAVA',
      hints: [
        'A popular programming language',
        'Named after a type of coffee',
        'Known for "Write Once, Run Anywhere"',
        'Uses JVM to run',
        'Created by Sun Microsystems',
        'Often used for Android development',
        'Has a mascot named Duke',
        'Object-oriented programming language',
        'Released in 1995',
        'Famous for enterprise applications'
      ]
    },
    {
      word: 'PYTHON',
      hints: [
        'Named after a snake',
        'Known for readability',
        'Uses indentation for blocks',
        'Created by Guido van Rossum',
        'Popular in data science',
        'Has a zen philosophy',
        'Interpreted language',
        'Mascot is a snake',
        'Known for being beginner-friendly',
        'Popular for AI development'
      ]
    },
    {
      word: 'HTML',
      hints: [
        'Markup language for web',
        'Creates structure of web pages',
        'Uses tags and elements',
        'Stands for HyperText Markup Language',
        'Works with CSS',
        'Basic building block of web pages',
        'Uses angle brackets',
        'Not a programming language',
        'Current version is 5',
        'Rendered by browsers'
      ]
    },
    {
      word: 'PIZZA',
      hints: [
        'Popular Italian food',
        'Usually round in shape',
        'Has toppings',
        'Baked in an oven',
        'Often delivered to homes',
        'Has cheese on top',
        'Can have different crusts',
        'Party favorite',
        'Slice shaped like a triangle',
        'Originally from Naples'
      ]
    },
    {
      word: 'BEACH',
      hints: [
        'Found near the ocean',
        'Has sand',
        'Summer destination',
        'Place for swimming',
        'Build castles here',
        'Has waves',
        'Sunny spot',
        'Need sunscreen here',
        'Seashells found here',
        'Vacation spot'
      ]
    },
    {
      word: 'MUSIC',
      hints: [
        'Art of sound',
        'Has rhythm',
        'Uses instruments',
        'Can be sung',
        'Has different genres',
        'Creates melody',
        'Found in concerts',
        'Makes people dance',
        'Universal language',
        'Uses notes'
      ]
    },
    {
      word: 'SMILE',
      hints: [
        'Shows happiness',
        'Uses facial muscles',
        'Shows teeth',
        'Sign of joy',
        'Universal expression',
        'Brightens faces',
        'Contagious action',
        'Creates dimples',
        'Sign of friendliness',
        'Makes eyes crinkle'
      ]
    },
    {
      word: 'CLOUD',
      hints: [
        'Found in sky',
        'Made of water vapor',
        'Can bring rain',
        'Floats in air',
        'Different shapes',
        'Can be white or grey',
        'Part of weather',
        'Blocks the sun',
        'Like cotton balls',
        'Found in groups'
      ]
    },
    {
      word: 'BREAD',
      hints: [
        'Baked food',
        'Made from flour',
        'Basic food item',
        'Needs yeast to rise',
        'Can be toasted',
        'Many varieties exist',
        'Found in bakeries',
        'Makes sandwiches',
        'Daily staple food',
        'Has a crust'
      ]
    },
    {
      word: 'DREAM',
      hints: [
        'Happens while sleeping',
        'Can be vivid',
        'Often forgotten',
        'Night time activity',
        'Can be strange',
        'In your mind',
        'Like a story',
        'Can be good or bad',
        'REM sleep phase',
        'Subconscious activity'
      ]
    }
  ],
  MEDIUM: [
    {
      word: 'FUNCTION',
      hints: [
        'A reusable block of code',
        'Can accept parameters',
        'May return values',
        'Basic unit of code organization',
        'Can be named or anonymous',
        'Performs a specific task',
        'Has its own scope',
        'Can be nested',
        'Fundamental programming concept',
        'Helps avoid code repetition'
      ]
    },
    {
      word: 'SYMPHONY',
      hints: [
        'Musical composition',
        'Played by orchestra',
        'Multiple movements',
        'Classical music form',
        'Many instruments',
        'Complex arrangement',
        'Conducted by maestro',
        'Large scale work',
        'Concert hall music',
        'Harmonic structure'
      ]
    },
    {
      word: 'VOLCANO',
      hints: [
        'Mountain type',
        'Erupts lava',
        'Geological feature',
        'Can be active',
        'Creates new land',
        'Has magma chamber',
        'Natural disaster',
        'Ring of fire',
        'Releases ash',
        'Mountain formation'
      ]
    },
    {
      word: 'PENGUIN',
      hints: [
        'Flightless bird',
        'Lives in cold',
        'Black and white',
        'Excellent swimmer',
        'Antarctic animal',
        'Walks upright',
        'Lives in colonies',
        'Lays eggs',
        'Feeds on fish',
        'Social creature'
      ]
    },
    {
      word: 'BALLET',
      hints: [
        'Dance form',
        'Uses pointe shoes',
        'Classical art',
        'Requires training',
        'Has positions',
        'Graceful movement',
        'Stage performance',
        'Uses music',
        'Has costumes',
        'French origin'
      ]
    },
    {
      word: 'CASTLE',
      hints: [
        'Medieval building',
        'Has towers',
        'Royal residence',
        'Stone structure',
        'Has moat',
        'Defensive walls',
        'Historical place',
        'Has dungeons',
        'Knights lived here',
        'Has drawbridge'
      ]
    },
    {
      word: 'JUNGLE',
      hints: [
        'Dense forest',
        'Tropical location',
        'Many animals',
        'Thick vegetation',
        'High rainfall',
        'Like rainforest',
        'Wild habitat',
        'Diverse ecosystem',
        'Humid climate',
        'Natural environment'
      ]
    },
    {
      word: 'CAMERA',
      hints: [
        'Takes pictures',
        'Has lens',
        'Captures moments',
        'Uses memory card',
        'Has flash',
        'Digital or film',
        'Photography tool',
        'Has shutter',
        'Records images',
        'Different modes'
      ]
    },
    {
      word: 'BRIDGE',
      hints: [
        'Crosses water',
        'Connects land',
        'Structure type',
        'Transportation link',
        'Can be long',
        'Engineering feat',
        'Spans gaps',
        'Different designs',
        'Has supports',
        'Over rivers'
      ]
    },
    {
      word: 'GARDEN',
      hints: [
        'Growing space',
        'Has plants',
        'Outdoor area',
        'Needs water',
        'Has flowers',
        'Needs sunlight',
        'Natural space',
        'Has soil',
        'Peaceful place',
        'Green space'
      ]
    }
  ],
  HARD: [
    {
      word: 'KUBERNETES',
      hints: [
        'Container orchestration',
        'Originally by Google',
        'Named after Greek word',
        'Known as K8s',
        'Manages containers',
        'Uses pods',
        'Cloud-native',
        'Container scaling',
        'Microservices platform',
        'Container deployment'
      ]
    },
    {
      word: 'KALEIDOSCOPE',
      hints: [
        'Optical instrument',
        'Shows patterns',
        'Uses mirrors',
        'Creates symmetry',
        'Colorful views',
        'Rotating pieces',
        'Visual toy',
        'Changes images',
        'Geometric shapes',
        'Light effects'
      ]
    },
    {
      word: 'RENAISSANCE',
      hints: [
        'Historical period',
        'Cultural rebirth',
        'European movement',
        'Art flourished',
        'Scientific progress',
        'After medieval',
        'Cultural change',
        'Italian origin',
        'Great masters',
        'Knowledge revival'
      ]
    },
    {
      word: 'PHILOSOPHY',
      hints: [
        'Study of wisdom',
        'Deep thinking',
        'Ancient discipline',
        'Questions existence',
        'Seeks truth',
        'Abstract thought',
        'Mental discipline',
        'Life questions',
        'Critical thinking',
        'Theoretical study'
      ]
    },
    {
      word: 'LABYRINTH',
      hints: [
        'Complex maze',
        'Intricate paths',
        'Ancient design',
        'Hard to navigate',
        'Mythological origin',
        'Puzzle structure',
        'Many passages',
        'Greek mythology',
        'Winding paths',
        'Complex pattern'
      ]
    },
    {
      word: 'NOSTALGIA',
      hints: [
        'Sentimental longing',
        'Past memories',
        'Emotional feeling',
        'Remembering past',
        'Wistful desire',
        'Memory emotion',
        'Past yearning',
        'Fond memories',
        'Reminiscent mood',
        'Memory feeling'
      ]
    },
    {
      word: 'METAPHOR',
      hints: [
        'Figure of speech',
        'Symbolic comparison',
        'Literary device',
        'Indirect comparison',
        'Not literal',
        'Language tool',
        'Writing technique',
        'Poetic device',
        'Comparative phrase',
        'Expression type'
      ]
    },
    {
      word: 'PARADOX',
      hints: [
        'Contradictory statement',
        'Logical conflict',
        'Seems impossible',
        'Self-contradicting',
        'Mind puzzle',
        'Logic problem',
        'Complex concept',
        'Opposite ideas',
        'Brain teaser',
        'Philosophical concept'
      ]
    },
    {
      word: 'ZEITGEIST',
      hints: [
        'Spirit of time',
        'Cultural mood',
        'Era defining',
        'Period character',
        'German origin',
        'Time spirit',
        'Cultural feeling',
        'Historical mood',
        'Period atmosphere',
        'Social climate'
      ]
    },
    {
      word: 'ETHEREAL',
      hints: [
        'Extremely delicate',
        'Light and airy',
        'Heavenly quality',
        'Not earthly',
        'Celestial nature',
        'Refined delicacy',
        'Supernatural feel',
        'Unusually perfect',
        'Divine quality',
        'Extremely light'
      ]
    }
  ]
};
const Hangman = ({ difficulty = 'MEDIUM' }) => {
  const [word, setWord] = useState('');
  const [currentHints, setCurrentHints] = useState([]);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState('');
  const [loading, setLoading] = useState(true);

  const maxWrongGuesses = 6;

  const getRandomWord = () => {
    const wordSet = WORD_SETS[difficulty.toUpperCase()] || WORD_SETS.MEDIUM;
    return wordSet[Math.floor(Math.random() * wordSet.length)];
  };

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

  const resetGame = () => {
    setLoading(true);
    const wordData = getRandomWord();
    setWord(wordData.word);
    setCurrentHints(wordData.hints);
    setCurrentHintIndex(0);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameOver(false);
    setGameResult('');
    setLoading(false);
  };

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
        const newScore = calculateScore();
        setGameOver(true);
        setGameResult(`Congratulations! You won! +${newScore} points`);
        setScore(prevScore => prevScore + newScore);
      }
    }
  }, [gameOver, guessedLetters, word, wrongGuesses, maxWrongGuesses]);

  const nextHint = () => {
    if (currentHintIndex < currentHints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
  };

  const getHint = () => {
    if (!currentHints || currentHints.length === 0) return '';
    
    switch(difficulty.toUpperCase()) {
      case 'EASY':
        return `Hint ${currentHintIndex + 1}: ${currentHints[currentHintIndex]}`;
      case 'MEDIUM':
        return wrongGuesses >= 2 ? 
          `Hint ${currentHintIndex + 1}: ${currentHints[currentHintIndex]}` : 
          'Hints available after 2 wrong guesses';
      case 'HARD':
        return wrongGuesses >= 3 ? 
          `Hint ${currentHintIndex + 1}: ${currentHints[currentHintIndex]}` : 
          'Hints available after 3 wrong guesses';
      default:
        return '';
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameOver) return;
      
      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key) && !guessedLetters.has(key)) {
        handleGuess(key);
      }
    };

    window.addEventListener('keyup', handleKeyPress);
    return () => {
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, [guessedLetters, gameOver, handleGuess]);

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  const maskedWord = word
    .split('')
    .map(letter => guessedLetters.has(letter) ? letter : '_')
    .join(' ');

  const keyboard = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
    <button
      key={letter}
      className={`key ${guessedLetters.has(letter) ? 
        (word.includes(letter) ? 'correct' : 'wrong') : ''}`}
      onClick={() => handleGuess(letter)}
      disabled={guessedLetters.has(letter) || gameOver}
    >
      {letter}
    </button>
  ));

  const HangmanDrawing = ({ wrongGuesses }) => {
    return (
      <div className="hangman-drawing">
        <svg viewBox="0 0 200 250">
          {/* Base */}
          <line x1="40" y1="230" x2="160" y2="230" stroke="black" strokeWidth="4"/>
          <line x1="100" y1="230" x2="100" y2="30" stroke="black" strokeWidth="4"/>
          <line x1="100" y1="30" x2="150" y2="30" stroke="black" strokeWidth="4"/>
          <line x1="150" y1="30" x2="150" y2="50" stroke="black" strokeWidth="4"/>

          {/* Head */}
          {wrongGuesses >= 1 && (
            <circle cx="150" cy="70" r="20" fill="none" stroke="black" strokeWidth="4"/>
          )}
          
          {/* Body */}
          {wrongGuesses >= 2 && (
            <line x1="150" y1="90" x2="150" y2="150" stroke="black" strokeWidth="4"/>
          )}
          
          {/* Left Arm */}
          {wrongGuesses >= 3 && (
            <line x1="150" y1="110" x2="120" y2="130" stroke="black" strokeWidth="4"/>
          )}
          
          {/* Right Arm */}
          {wrongGuesses >= 4 && (
            <line x1="150" y1="110" x2="180" y2="130" stroke="black" strokeWidth="4"/>
          )}
          
          {/* Left Leg */}
          {wrongGuesses >= 5 && (
            <line x1="150" y1="150" x2="120" y2="180" stroke="black" strokeWidth="4"/>
          )}
          
          {/* Right Leg */}
          {wrongGuesses >= 6 && (
            <line x1="150" y1="150" x2="180" y2="180" stroke="black" strokeWidth="4"/>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="hangman-container">
      {loading ? (
        <div className="loading">Loading new word...</div>
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

          <div className="word-display">
            {maskedWord}
          </div>

          {!gameOver && (
            <div className="hint-section">
              <div className="hint">{getHint()}</div>
              <button 
                className="hint-button" 
                onClick={nextHint}
                disabled={
                  (difficulty === 'MEDIUM' && wrongGuesses < 2) ||
                  (difficulty === 'HARD' && wrongGuesses < 3) ||
                  currentHintIndex === currentHints.length - 1
                }
              >
                Next Hint
              </button>
            </div>
          )}

          {gameResult && (
            <div className={`game-result ${gameResult.includes('won') ? 'win' : 'lose'}`}>
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
