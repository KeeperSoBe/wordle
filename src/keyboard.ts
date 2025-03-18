import { flatten } from './util';

/**
 * Handles creating and managing the virtual keyboard elements.
 *
 * @export
 * @class Keyboard
 */
export class Keyboard {
  /**
   * The key characters that will be used to build the keyboard, with each array represents a keyboard row
   *
   * The <-- character is replaced with a Svg in the DOM, and the event.key 'Backspace' keyboard event
   *
   * @private
   * @static
   * @type { string[][] }
   * @memberof Keyboard
   */
  private static readonly keyRows: string[][] = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<--'],
  ];

  /**
   * Used to identify and replace the <-- keyboard character
   *
   * @private
   * @static
   * @type { string }
   * @memberof Keyboard
   */
  private static readonly backspace: string = '<--';

  /**
   * The keyboard container element.
   *
   * @private
   * @static
   * @type { (HTMLDivElement | null) }
   * @memberof Keyboard
   */
  private static container: HTMLDivElement | null;

  /**
   * The handler that should be called when a virtual key is pressed.
   *
   * @private
   * @static
   * @memberof Keyboard
   */
  private static handleKeyboardClickEvent: (key: string) => void;

  /**
   * The handler that should be called when a keydown event occurs.
   *
   * @private
   * @static
   * @memberof Keyboard
   */
  private static handleKeydownEvent: (event: KeyboardEvent) => void;

  /**
   * Sets up the virtual keyboard.
   *
   * @static
   * @memberof Keyboard
   */
  public static init(
    handleKeyboardClickEvent: (key: string) => void,
    handleKeydownEvent: (event: KeyboardEvent) => void,
  ): void {
    if (this.container) {
      console.error('[Keyboard](init): Keyboard element already exists!');
    } else {
      this.handleKeyboardClickEvent = handleKeyboardClickEvent;
      this.handleKeydownEvent = handleKeydownEvent;

      this.container = document.body.appendChild(this.createKeyboardElement());
      document.addEventListener('keydown', this.handleKeydownEvent);
    }
  }

  /**
   * Destroys the virtual keyboard.
   *
   * @static
   * @memberof Keyboard
   */
  public static destroy(): void {
    if (this.container) {
      document.removeChild(this.container);
      document.removeEventListener('keydown', this.handleKeydownEvent);
      this.container = null;
    } else {
      console.error('[Keyboard](destroy): Keyboard element does not exist!');
    }
  }

  /**
   * Checks if the provided key is valid and returns the result.
   *
   * Excludes the backspace key.
   *
   * @static
   * @param { string } key
   * @return { boolean }
   * @memberof Keyboard
   */
  public static isValidKey(key: string): boolean {
    return !!flatten(this.keyRows, ['backspace']).find((k) => key === k);
  }

  /**
   * Marks a virtual key as being a correct letter, but in the wrong place.
   *
   * @static
   * @param { string } key
   * @memberof Keyboard
   */
  public static markValidLetter(key: string): void {
    this.getKeyboardButtonElement(key).classList.add('wordle-valid-letter');
  }

  /**
   * Marks a virtual key as being a correct letter in the correct place.
   *
   * @static
   * @param { string } key
   * @memberof Keyboard
   */
  public static markValidPlacementLetter(key: string): void {
    this.getKeyboardButtonElement(key).classList.add('wordle-valid-placement');
  }

  /**
   * Marks a virtual key as being a incorrect letter.
   *
   * @static
   * @param { string } key
   * @memberof Keyboard
   */
  public static markInvalidLetter(key: string): void {
    this.getKeyboardButtonElement(key).classList.add('wordle-invalid-letter');
  }

  /**
   * Builds the keyboard using the keyRows, returns the keyboard container element.
   *
   * @private
   * @static
   * @return { HTMLDivElement }
   * @memberof Keyboard
   */
  private static createKeyboardElement(): HTMLDivElement {
    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');

    for (
      let keyRowsIndex = 0, keyRowsLen = this.keyRows;
      keyRowsIndex < keyRowsLen.length;
      keyRowsIndex++
    ) {
      const row = document.createElement('div');

      row.classList.add('keyboard-row');

      for (
        let keyColIndex = 0, keyColLen = this.keyRows[keyRowsIndex].length;
        keyColIndex < keyColLen;
        keyColIndex++
      ) {
        row.appendChild(
          this.createKeyboardKeyElement(
            this.keyRows[keyRowsIndex][keyColIndex],
          ),
        );
      }

      keyboard.appendChild(row);
    }

    return keyboard;
  }

  /**
   * Creates and returns a keyboard key element based on the key.
   *
   * @private
   * @static
   * @param { string } key
   * @return { HTMLButtonElement }
   * @memberof Keyboard
   */
  private static createKeyboardKeyElement(key: string): HTMLButtonElement {
    const button = document.createElement('button');

    if (key === 'enter' || key === this.backspace) {
      button.classList.add('large-key');
    }

    if (key === this.backspace) {
      button.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#fff" height="20px"><path d="M576 384C576 419.3 547.3 448 512 448H205.3C188.3 448 172 441.3 160 429.3L9.372 278.6C3.371 272.6 0 264.5 0 256C0 247.5 3.372 239.4 9.372 233.4L160 82.75C172 70.74 188.3 64 205.3 64H512C547.3 64 576 92.65 576 128V384zM271 208.1L318.1 256L271 303C261.7 312.4 261.7 327.6 271 336.1C280.4 346.3 295.6 346.3 304.1 336.1L352 289.9L399 336.1C408.4 346.3 423.6 346.3 432.1 336.1C442.3 327.6 442.3 312.4 432.1 303L385.9 256L432.1 208.1C442.3 199.6 442.3 184.4 432.1 175C423.6 165.7 408.4 165.7 399 175L352 222.1L304.1 175C295.6 165.7 280.4 165.7 271 175C261.7 184.4 261.7 199.6 271 208.1V208.1z"/></svg>';
    } else {
      button.innerText = key;
    }

    button.onclick = () => this.handleKeyboardClickEvent(key);

    return button;
  }

  /**
   * Returns a button by its key.
   *
   * @private
   * @static
   * @param { string } key
   * @return { HTMLButtonElement }
   * @memberof Keyboard
   */
  private static getKeyboardButtonElement(key: string): HTMLButtonElement {
    let indexOfKeyRow = -1;
    let indexOfKeyRowChar = -1;

    this.keyRows.forEach((keyRow, keyRowIndex) => {
      keyRow.forEach((keyChar, keyCharIndex) => {
        if (keyChar === key) {
          indexOfKeyRow = keyRowIndex;
          indexOfKeyRowChar = keyCharIndex;
        }
      });
    });

    return (
      this.container
        .querySelectorAll<HTMLButtonElement>('.keyboard-row')
        // eslint-disable-next-line no-unexpected-multiline
        [indexOfKeyRow].querySelectorAll<HTMLButtonElement>('button')[
        indexOfKeyRowChar
      ]
    );
  }
}
