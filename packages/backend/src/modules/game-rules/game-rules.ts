import { IField } from 'src/types/IField';
import { IShip } from 'src/types/IShip';
import { IShoot } from 'src/types/IShoot';

export class GameRules {
  static shoot(x: number, y: number, field: IField): IShoot {
    const resp: IShoot = {
      x,
      y,
      isShip: false,
      isDestroyed: null,
      isOver: false,
    };
    const ship = this.isShip(x, y, field);
    if (!ship) return resp;
    resp.isShip = true;
    const isDestroyed = this.isDestroyed(x, y, ship);
    if (!isDestroyed) return resp;
    resp.isDestroyed = ship;
    const isWin = this.isOver(ship, field);
    if (!isWin) return resp;
    resp.isOver = true;
    return resp;
  }

  private static isShip(x: number, y: number, field: IField): IShip | null {
    for (const ship of field.ships) {
      for (const deck of ship.decks) {
        if (x === deck.x && y === deck.y) {
          deck.isDamaged = true;
          return ship;
        }
      }
    }
    return null;
  }

  private static isDestroyed(x: number, y: number, ship: IShip): boolean {
    for (const deck of ship.decks) {
      if (!deck.isDamaged && (x !== deck.x || y !== deck.y)) return false;
    }
    return true;
  }

  private static isOver(ship: IShip, field: IField): boolean {
    for (const sh of field.ships) {
      if (sh === ship) continue;
      for (const deck of sh.decks) {
        if (!deck.isDamaged) return false;
      }
    }
    return true;
  }
}
