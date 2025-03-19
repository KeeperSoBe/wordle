interface Position {
  x: number;
  y: number;
}

type Direction = 'left' | 'right' | 'down';

const Utils = {
  getRandomInRange: (
    min: number,
    max: number,
    precision: number = 0,
  ): number => {
    const multiplier = Math.pow(10, precision);
    const randomValue = Math.random() * (max - min) + min;
    return Math.floor(randomValue * multiplier) / multiplier;
  },
  getScaleFactor: (): number => Math.log(window.innerWidth) / Math.log(1920),
  debounce: (func: () => void, delay: number): (() => void) => {
    let timeout: NodeJS.Timeout;
    return (): void => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(), delay);
    };
  },
};

const DEG_TO_RAD = Math.PI / 180;
const defaultConfettiConfig = {
  confettiCount: 250,
  confettiRadius: 6,
  confettiColors: [
    '#fcf403',
    '#62fc03',
    '#f4fc03',
    '#03e7fc',
    '#03fca5',
    '#a503fc',
    '#fc03ad',
    '#fc03c2',
  ],
};

class Confetti {
  public readonly speed: Position;
  public readonly radius: Position;
  public readonly position: Position;
  public readonly initialPosition: Position;
  public readonly initialRadius: number;
  public readonly finalSpeedX: number;

  public readonly dragCoefficient: number;
  public readonly rotationSpeed: number;
  public readonly rotationAngle: number;
  public readonly radiusYDirection: string;
  public readonly absCos: number;
  public readonly absSin: number;
  public readonly color: string;
  public readonly createdAt: number;
  public readonly direction: Direction;

  public constructor({
    initialPosition,
    direction,
    radius,
    colors,
  }: {
    initialPosition: Position;
    direction: Direction;
    radius: number;
    colors: string[];
  }) {
    const speedFactor =
      Utils.getRandomInRange(0.9, 1.7, 3) * Utils.getScaleFactor();
    this.speed = { x: speedFactor, y: speedFactor };
    this.finalSpeedX = Utils.getRandomInRange(0.2, 0.6, 3);
    this.rotationSpeed =
      Utils.getRandomInRange(0.03, 0.07, 3) * Utils.getScaleFactor();
    this.dragCoefficient = Utils.getRandomInRange(0.0005, 0.0009, 6);
    this.radius = { x: radius, y: radius };
    this.initialRadius = radius;
    this.rotationAngle =
      direction === 'left'
        ? Utils.getRandomInRange(0, 0.2, 3)
        : Utils.getRandomInRange(-0.2, 0, 3);
    this.radiusYDirection = 'down';

    const angle =
      direction === 'left'
        ? Utils.getRandomInRange(82, 15) * DEG_TO_RAD
        : Utils.getRandomInRange(-15, -82) * DEG_TO_RAD;
    this.absCos = Math.abs(Math.cos(angle));
    this.absSin = Math.abs(Math.sin(angle));

    const offset = Utils.getRandomInRange(-150, 0);
    const position = {
      x:
        initialPosition.x +
        (direction === 'left' ? -offset : offset) * this.absCos,
      y: initialPosition.y - offset * this.absSin,
    };

    this.position = { ...position };
    this.initialPosition = { ...position };
    this.color = colors[Math.floor(Math.random() * colors.length)];

    this.createdAt = Date.now();
    this.direction = direction;
  }

  public draw(context: CanvasRenderingContext2D): void {
    const { x, y } = this.position;
    const { x: radiusX, y: radiusY } = this.radius;
    const scale = window.devicePixelRatio;

    context.fillStyle = this.color;
    context.beginPath();
    context.ellipse(
      x * scale,
      y * scale,
      radiusX * scale,
      radiusY * scale,
      this.rotationAngle,
      0,
      2 * Math.PI,
    );
    context.fill();
  }

  public updatePosition(deltaTime: number, currentTime: number): void {
    const elapsed = currentTime - this.createdAt;

    if (this.speed.x > this.finalSpeedX) {
      this.speed.x -= this.dragCoefficient * deltaTime;
    }

    this.position.x +=
      this.speed.x *
      (this.direction === 'left' ? -this.absCos : this.absCos) *
      deltaTime;
    this.position.y =
      this.initialPosition.y -
      this.speed.y * this.absSin * elapsed +
      (0.00125 * Math.pow(elapsed, 2)) / 2;
  }

  public isVisible(canvasHeight: number): boolean {
    return this.position.y < canvasHeight + 100;
  }
}

class ConfettiManager {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private confetti: Confetti[];
  private lastUpdated: number;

  public constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.style =
      'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1000; pointer-events: none;';
    document.body.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.confetti = [];
    this.lastUpdated = Date.now();
    window.addEventListener(
      'resize',
      Utils.debounce(() => this.resizeCanvas(), 200),
    );
    this.resizeCanvas();
    requestAnimationFrame(() => this.loop());
  }

  public resetAndStart(config = {}): void {
    this.confetti = [];
    this.addConfetti(config);
  }

  private addConfetti(config = {}): void {
    const { confettiCount, confettiRadius, confettiColors } = {
      ...defaultConfettiConfig,
      ...config,
    };

    const baseY = (5 * window.innerHeight) / 7;
    for (let i = 0; i < confettiCount / 2; i++) {
      this.confetti.push(
        new Confetti({
          initialPosition: { x: 0, y: baseY },
          direction: 'right',
          radius: confettiRadius,
          colors: confettiColors,
        }),
      );
      this.confetti.push(
        new Confetti({
          initialPosition: { x: window.innerWidth, y: baseY },
          direction: 'left',
          radius: confettiRadius,
          colors: confettiColors,
        }),
      );
    }
  }

  private resizeCanvas(): void {
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
  }

  private loop(): void {
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastUpdated;
    this.lastUpdated = currentTime;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.confetti = this.confetti.filter((item) => {
      item.updatePosition(deltaTime, currentTime);
      item.draw(this.context);
      return item.isVisible(this.canvas.height);
    });

    requestAnimationFrame((): void => this.loop());
  }
}

const manager = new ConfettiManager();

export function CreateConfetti(): void {
  manager.resetAndStart();
}
