import { IDeck, IShip } from '../types/IShip';

export class Ship implements IShip {
  x: number = 0;
  y: number = 0;
  decks: IDeck[] = [];
  constructor(x: number, y: number, decks: IDeck[]) {
    this.x = x;
    this.y = y;
    this.decks = decks;
  }

  damage(x: number, y: number) {
    if (this.isDestroyed()) return;
    const deck = this.decks.find((d) => d.x === x && d.y === y);
    if (!deck) return;
    deck.isDamaged = true;
  }

  isDestroyed(): boolean {
    let isDestroyed = true;
    for (const deck of this.decks) {
      if (!deck.isDamaged) isDestroyed = false;
    }
    return isDestroyed;
  }

  static createShip(
    x: number,
    y: number,
    length: number,
    orientation: string
  ): Ship {
    let decks: IDeck[] = [];
    for (let i = 0; i < length; i++) {
      if (orientation === 'horizontal') {
        decks.push({ x: x + i, y: y, isDamaged: false });
      } else decks.push({ x: x, y: y + i, isDamaged: false });
    }
    const ship = new Ship(x, y, decks);
    return ship;
  }
}
