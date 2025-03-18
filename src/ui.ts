/**
 * Handles setting up the Wordle container and its elements, including the rows and columns.
 *
 * @export
 * @class UI
 */
export class UI {
  /**
   * The selectors used to identify DOM elements.
   *
   * @private
   * @static
   * @memberof UI
   */
  private static readonly selectors = {
    container: 'wordle',
    row: 'wordle-row',
    column: 'wordle-col',
  };

  /**
   * The UI container element.
   *
   * @private
   * @static
   * @type { (HTMLDivElement | null) }
   * @memberof UI
   */
  private static container: HTMLDivElement | null = null;

  /**
   * Returns a row element.
   *
   * @private
   * @static
   * @param { number } index
   * @return { (HTMLDivElement | null) }
   * @memberof UI
   */
  private static row(index: number): HTMLDivElement | null {
    return this.container.querySelectorAll<HTMLDivElement>(
      `.${this.selectors.row}`,
    )[index];
  }

  /**
   * Returns a column element.
   *
   * @private
   * @static
   * @param { number } row
   * @param { number } index
   * @return { (HTMLDivElement | null) }
   * @memberof UI
   */
  private static column(row: number, index: number): HTMLDivElement | null {
    return this.row(row).querySelectorAll<HTMLDivElement>(
      `.${this.selectors.column}`,
    )[index];
  }

  /**
   * Sets up the Wordle UI.
   *
   * @static
   * @memberof UI
   */
  public static init(): void {
    if (this.container) {
      console.error('[UI](init): Wordle element already exists!');
    } else {
      this.container = document.body.appendChild(
        this.createWordleContainerElement(),
      );
    }
  }

  /**
   * Destroys the Wordle UI.
   *
   * @static
   * @memberof UI
   */
  public static destroy(): void {
    if (this.container) {
      document.removeChild(this.container);
      this.container = null;
    } else {
      console.error('[UI](destroy): Wordle element does not exist!');
    }
  }

  /**
   * Fills a column with a character.
   *
   * @static
   * @param { number } row
   * @param { number } column
   * @param { string } character
   * @memberof UI
   */
  public static fillColumn(
    row: number,
    column: number,
    character: string,
  ): void {
    this.column(row, column).innerText = character;
  }

  /**
   * Removes a character from a column.
   *
   * @static
   * @param { number } row
   * @param { number } column
   * @memberof UI
   */
  public static deleteColumn(row: number, column: number): void {
    const characterSlot = this.column(row, column);

    characterSlot.innerText = '';
    characterSlot.classList.remove('filled');
  }

  /**
   * Marks a column as containing a correct letter, but in the wrong place.
   *
   * @static
   * @param { number } row
   * @param { number } column
   * @memberof UI
   */
  public static markValidLetter(row: number, column: number): void {
    this.column(row, column).classList.add('wordle-valid-letter');
  }

  /**
   * Marks a column as containing a correct letter in the correct place.
   *
   * @static
   * @param { number } row
   * @param { number } column
   * @memberof UI
   */
  public static markValidPlacementLetter(row: number, column: number): void {
    this.column(row, column).classList.add('wordle-valid-placement');
  }

  /**
   * Marks a column as containing a incorrect letter.
   *
   * @static
   * @param { number } row
   * @param { number } column
   * @memberof UI
   */
  public static markInvalidLetter(row: number, column: number): void {
    this.column(row, column).classList.add('wordle-invalid-letter');
  }

  /**
   * Creates the Wordle container element and builds out its rows and columns.
   *
   * @static
   * @param { number } [rows=5]
   * @param { number } [cols=5]
   * @return { HTMLDivElement }
   * @memberof UI
   */
  private static createWordleContainerElement(
    rows: number = 5,
    cols: number = 5,
  ): HTMLDivElement {
    if (this.container) {
      throw new Error(
        '[UI](createWordleElement): Container element already exists!',
      );
    }

    const wordleElement = document.createElement('div');

    wordleElement.id = this.selectors.container;

    for (let index = 0; index < rows; index++) {
      wordleElement.appendChild(this.createWordleRowElement(cols));
    }

    return wordleElement;
  }

  /**
   * Creates and returns a row and its columns.
   *
   * @static
   * @param { number } cols
   * @return { HTMLDivElement }
   * @memberof UI
   */
  private static createWordleRowElement(cols: number): HTMLDivElement {
    const row = document.createElement('div');

    row.classList.add(this.selectors.row);

    for (let index = 0; index < cols; index++) {
      const col = document.createElement('div');

      col.classList.add(this.selectors.column);

      row.appendChild(col);
    }

    return row;
  }
}
