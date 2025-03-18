import { Keyboard } from './keyboard';
import { UI } from './ui';
import { words } from './words';

const guessLimit = 5;

/**
 * Stores all of the guesses
 *
 * @type { string[] }
 */
const guesses: string[] = [];

/**
 * The currently untested guess
 *
 * @type { string }
 */
let currentGuess: string = '';

/**
 * The target word, chosen randomly from the test words array
 *
 * @type { string }
 */
const word: string = words[Math.floor(Math.random() * words.length)];

/**
 * Checks if the maximum number of guesses has been made yet, and returns the result.
 *
 * @return { boolean }
 */
function isAtGuessLimit(): boolean {
  return word === currentGuess || guesses.length === guessLimit;
}

/**
 * Handles click events for the keyboard buttons
 *
 * @param { string } key
 * @return { void }
 */
function handleKeyboardClickEvent(key: string): void {
  if (isAtGuessLimit()) {
    return;
  }

  handleInput(key);
}

/**
 * Handles keydown events on the document
 *
 * @param { KeyboardEvent } event
 * @return { void }
 */
function handleKeydownEvent(event: KeyboardEvent): void {
  if (isAtGuessLimit()) {
    return;
  }

  const key = event.key.toLowerCase();

  // // Ignore key presses that are not expected
  if (!Keyboard.isValidKey(key)) {
    return;
  }

  handleInput(key);
}

function handleInput(key: string): void {
  if (isAtGuessLimit()) {
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

function handleBackspaceInput(): void {
  if (currentGuess.length > 0) {
    UI.deleteColumn(guesses.length, currentGuess.length - 1);

    currentGuess = currentGuess.slice(0, -1);
  }
}

/**
 * Makes a guess using the currentWord, reveals correctly placed and valid letters
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
  }
}

// Initialise the UI and virtual Keyboard.
UI.init();
Keyboard.init(handleKeyboardClickEvent, handleKeydownEvent);
