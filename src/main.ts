import { CreateConfetti } from './confetti';
import { Keyboard } from './keyboard';
import { UI } from './ui';
import { words } from './words';

/**
 * The number of guesses the player gets each game.
 *
 * @type { number }
 */
const guessLimit: number = 6;

/**
 * Stores all of the guesses.
 *
 * @type { string[] }
 */
const guesses: string[] = [];

/**
 * The currently untested guess.
 *
 * @type { string }
 */
let currentGuess: string = '';

/**
 * The target word, chosen randomly from the test words array.
 *
 * @type { string }
 */
const word: string = words[Math.floor(Math.random() * words.length)];

/**
 * If the game has finished.
 *
 * @type { boolean }
 */
let gameOver: boolean = false;

/**
 * Handles keydown events on the document.
 *
 * @param { KeyboardEvent } event
 * @return { void }
 */
function handleKeydownEvent(event: KeyboardEvent): void {
  if (guesses.length === guessLimit) {
    return;
  }

  const key = event.key.toLowerCase();

  // // Ignore key presses that are not expected.
  if (!Keyboard.isValidKey(key)) {
    return;
  }

  handleInput(key);
}

/**
 * Handles input from the virtual keyboard or document keyboard events.
 *
 * @param { string } key
 * @return { void }
 */
function handleInput(key: string): void {
  if (guesses.length === guessLimit || gameOver) {
    return;
  }

  switch (key) {
    case 'enter':
      if (currentGuess.length === 5) {
        guess();
      }
      break;
    case 'backspace':
      handleBackspaceInput();
      break;

    default:
      if (currentGuess.length < 5) {
        currentGuess += key.toLowerCase();
        UI.fillColumn(guesses.length, currentGuess.length - 1, key);
      }
      break;
  }
}

/**
 * Deletes the last character from the pending current guess, if there is one.
 *
 * @return { void }
 */
function handleBackspaceInput(): void {
  if (currentGuess.length > 0) {
    UI.deleteColumn(guesses.length, currentGuess.length - 1);

    currentGuess = currentGuess.slice(0, -1);
  }
}

/**
 * Makes a guess using the currentWord, reveals correctly placed and valid letters.
 *
 * @return { void }
 */
function guess(): void {
  for (let index = 0; index < currentGuess.length; index++) {
    const key = currentGuess[index];

    let validLetter = false;
    let validPlacement = false;

    if (word.includes(key)) {
      validLetter = true;
      UI.markValidLetter(guesses.length, index);
      Keyboard.markValidLetter(key);
    }

    if (word[index] === key) {
      validPlacement = true;
      UI.markValidPlacementLetter(guesses.length, index);
      Keyboard.markValidPlacementLetter(key);
    }

    if (!validLetter && !validPlacement) {
      UI.markInvalidLetter(guesses.length, index);
      Keyboard.markInvalidLetter(key);
    }
  }

  guesses.push(currentGuess);

  if (word !== currentGuess) {
    currentGuess = '';
  } else {
    gameOver = true;
    CreateConfetti();
  }
}

// Initialise the UI and virtual Keyboard.
UI.init(guessLimit);
Keyboard.init(handleInput, handleKeydownEvent);
