import { IDeck } from '../types/IShip';
import { Ship } from './Ship';

interface Rect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export class FieldValidator {
  static validateShipPos(
    height: number,
    width: number,
    decks: IDeck[],
    ships: Ship[]
  ): boolean {
    const isOnFreeSpot = this.isOnFreeSpot(ships, decks);
    const isOnField = this.isOnField(height, width, decks);
    if (isOnField && isOnFreeSpot) return true;
    return false;
  }

  static isOnFreeSpot(ships: Ship[], decks: IDeck[]) {
    const shipRect2 = this.getShipRect(decks);
    for (const ship of ships) {
      const shipRect = this.getShipRect(ship.decks);
      const isNotCross = this.isNotCross(shipRect, shipRect2);
      if (!isNotCross) return false;
    }
    return true;
  }

  static isNotCross(rect1: Rect, rect2: Rect): boolean {
    const isNotOverlapping =
      rect1.x1 > rect2.x2 - 1 ||
      rect1.x2 < rect2.x1 + 1 ||
      rect1.y1 > rect2.y2 - 1 ||
      rect1.y2 < rect2.y1 + 1;
    return isNotOverlapping;
  }

  static getShipRect(decks: IDeck[]): Rect {
    const l = decks.length - 1;
    const { x1, y1 } = { x1: decks[0].x - 1, y1: decks[0].y - 1 };
    const { x2, y2 } = { x2: decks[l].x + 1, y2: decks[l].y + 1 };
    return { x1, y1, x2, y2 };
  }

  static isOnField(height: number, width: number, decks: IDeck[]): boolean {
    let isOnField = true;
    for (const deck of decks) {
      const isFit = this.checkCell(deck.x, deck.y, width, height);
      if (!isFit) isOnField = false;
    }
    return isOnField;
  }

  static checkCell(
    x: number,
    y: number,
    width: number,
    height: number
  ): boolean {
    const isFitX = x >= 1 && x <= width;
    const isFitY = y >= 1 && y <= height;
    return isFitX && isFitY;
  }
}
