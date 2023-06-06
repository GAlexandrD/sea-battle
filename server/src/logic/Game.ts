import { IField } from '../types/IField';
import { IShip } from '../types/IShip';

export interface shootRes {
  x: number;
  y: number;
  isShip: boolean;
  isDestroyed: IShip | null;
  isOver: boolean;
}

class Game {
  shoot(x: number, y: number, field: IField): shootRes {
    const resp: shootRes = {
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
    const isWin = this.isOver(ship, field)
    if (!isWin) return resp
    resp.isOver = true 
    return resp
  }

  isShip(x: number, y: number, field: IField): IShip | null {
    for (const ship of field.ships) {
      for (const deck of ship.decks) {
        if (x === deck.x && y === deck.y) {
          deck.isDamaged = true
          return ship;
        }
      }
    }
    return null;
  }

  isDestroyed(x: number, y: number, ship: IShip): boolean {
    for (const deck of ship.decks) {
      if (!deck.isDamaged && (x !== deck.x || y !== deck.y)) return false;
    }
    return true;
  }

  isOver(ship: IShip, field: IField): boolean {
    for (const sh of field.ships) {
      if(sh === ship) continue
      for (const deck of sh.decks) {
        if(!deck.isDamaged) return false
      }
    }
    return true
  }
}

export const game = new Game();
