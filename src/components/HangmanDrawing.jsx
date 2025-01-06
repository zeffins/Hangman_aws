import { memo } from 'react';
import '../styles/HangmanDrawing.css';
import PropTypes from 'prop-types';

const HangmanDrawing = memo(({ wrongGuesses }) => {
  const parts = [
    // Base
    <line key="base" x1="60" y1="280" x2="240" y2="280" className="hangman-part" />,
    // Vertical pole
    <line key="pole" x1="150" y1="280" x2="150" y2="50" className="hangman-part" />,
    // Horizontal pole
    <line key="top" x1="150" y1="50" x2="240" y2="50" className="hangman-part" />,
    // Rope
    <line key="rope" x1="240" y1="50" x2="240" y2="90" className="hangman-part" />,
    // Head
    <circle key="head" cx="240" cy="110" r="20" className="hangman-part head" />,
    // Body
    <line key="body" x1="240" y1="130" x2="240" y2="190" className="hangman-part" />,
    // Left arm
    <line key="leftArm" x1="240" y1="150" x2="200" y2="170" className="hangman-part" />,
    // Right arm
    <line key="rightArm" x1="240" y1="150" x2="280" y2="170" className="hangman-part" />,
    // Left leg
    <line key="leftLeg" x1="240" y1="190" x2="200" y2="230" className="hangman-part" />,
    // Right leg
    <line key="rightLeg" x1="240" y1="190" x2="280" y2="230" className="hangman-part" />
  ];

  // Ensure wrongGuesses is within valid bounds
  const validWrongGuesses = Math.max(0, Math.min(wrongGuesses, parts.length - 4));

  return (
    <svg width="300" height="300" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
      {/* Always show gallows */}
      {parts.slice(0, 4)}
      {/* Show body parts based on wrong guesses */}
      {parts.slice(4, 4 + validWrongGuesses)}
    </svg>
  );
});

HangmanDrawing.propTypes = {
  wrongGuesses: PropTypes.number.isRequired
};

export default HangmanDrawing;