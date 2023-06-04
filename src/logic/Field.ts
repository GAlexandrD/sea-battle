import { ICell, variant } from '../types/ICell';
import { IField } from '../types/IField';
import { IDeck, IShip } from '../types/IShip';
import { FieldValidator } from './FieldValidator';
import { Ship } from './Ship';

export class Field implements IField {
  readonly width: number;
  readonly height: number;
  cells: ICell[][] = [];
  ships: Ship[] = [];
  choosenShip: Ship | null = null;

  constructor(width: number, height: number) {
    this.height = height;
    this.width = width;
    const cells = this.createField(width, height);
    this.cells = cells;
  }

  static generateShips(): Ship[] {
    const ships: Ship[] = []
    let isValid = false; 
    while (!isValid) {
      const ship = this.genShip(4)
      isValid = FieldValidator.validateShipPos(10, 10, ship.decks, ships)
      if(isValid) ships.push(ship)
    }
    isValid = false
    for (let i = 0; i < 2; i++) {
      while (!isValid) {
        const ship = this.genShip(3)
        isValid = FieldValidator.validateShipPos(10, 10, ship.decks, ships)
        if(isValid) ships.push(ship)
      }
      isValid = false
    }
    for (let i = 0; i < 3; i++) {
      while (!isValid) {
        const ship = this.genShip(2)
        isValid = FieldValidator.validateShipPos(10, 10, ship.decks, ships)
        if(isValid) ships.push(ship)
      }
      isValid = false
    }
    for (let i = 0; i < 4; i++) {
      while (!isValid) {
        const ship = this.genShip(1)
        isValid = FieldValidator.validateShipPos(10, 10, ship.decks, ships)
        if(isValid) ships.push(ship)
      }
      isValid = false
    }
    return ships
  }

  private static genShip(length: number): Ship {
    const x = Math.floor(Math.random() * 10 + 1)
    const y = Math.floor(Math.random() * 10 + 1)
    const or = Math.floor(Math.random() * 2 + 1)
    let orientation = or === 1 ? 'horizontal' : 'vertical'
    const randShip = Ship.createShip(x, y, length, orientation)
    return randShip
  }

  createField(width: number, height: number): ICell[][] {
    const cells: ICell[][] = [];
    for (let i = 1; i <= height; i++) {
      const row: ICell[] = [];
      for (let j = 1; j <= width; j++) {
        row.push({ x: j, y: i, variant: 'unrevealed' });
      }
      cells.push(row);
    }
    return cells;
  }

  setCellState(x: number, y: number, variant: variant) {
    this.cells = [
      ...this.cells.map((row) => {
        for (const cell of row) {
          if (cell.x === x && cell.y === y) {
            cell.variant = variant;
          }
        }
        return row;
      }),
    ];
  }

  addShip(x: number, y: number, ship: Ship) {
    const validateShipPos = FieldValidator.validateShipPos(
      this.height,
      this.width,
      ship.decks,
      this.ships
    );
    if (!validateShipPos) return;
    ship.x = x;
    ship.y = y;
    this.ships.push(ship);
    this.setShipCells(ship.decks, ship.isDestroyed());
  }

  moveShip(x: number, y: number, ship: Ship) {
    const findedShip = this.ships.find((s) => s === ship);
    if (!findedShip) return;
    const decks = findedShip.decks;
    const oldDecks = JSON.parse(JSON.stringify(findedShip.decks));
    const [pX, pY] = [decks[0].x, decks[0].y];
    for (let i = 0; i < oldDecks.length; i++) {
      const [pdX, pdY] = [decks[i].x, decks[i].y];
      decks[i].x = pdX + x - pX;
      decks[i].y = pdY + y - pY;
    }
    const validateShipPos = FieldValidator.validateShipPos(
      this.height,
      this.width,
      ship.decks,
      this.ships.filter((s) => ship !== s)
    );
    if (!validateShipPos) {
      findedShip.decks = oldDecks;
      this.setShipCells(oldDecks, ship.isDestroyed());
      return;
    }
    ship.x = x;
    ship.y = y;
    this.removeShipCells(oldDecks);
    this.setShipCells(ship.decks, ship.isDestroyed());
  }

  turnShip(ship: Ship) {
    const findedShip = this.ships.find((s) => s === ship);
    if (!findedShip) return;
    const oldDecks = JSON.parse(JSON.stringify(findedShip.decks));
    this.turnObjectShip(findedShip);
    const validateShipPos = FieldValidator.validateShipPos(
      this.height,
      this.width,
      ship.decks,
      this.ships.filter((s) => ship !== s)
    );
    if (!validateShipPos) {
      this.turnObjectShip(findedShip);
      this.setShipCells(oldDecks, ship.isDestroyed());
      return;
    }
    this.removeShipCells(oldDecks);
    this.setShipCells(ship.decks, ship.isDestroyed());
  }

  turnObjectShip(ship: Ship) {
    const decks = ship.decks;
    for (let i = 1; i < decks.length; i++) {
      if (decks[i].x === decks[0].x) {
        decks[i].x = decks[0].x + i;
        decks[i].y = decks[0].y;
      } else {
        decks[i].y = decks[0].y + i;
        decks[i].x = decks[0].x;
      }
    }
  }

  setShipCells(decks: IDeck[], isDestroyed: boolean) {
    for (const deck of decks) {
      if (isDestroyed) {
        this.setCellState(deck.x, deck.y, 'destroyed');
        continue;
      }
      if (deck.isDamaged) {
        this.setCellState(deck.x, deck.y, 'damaged');
      } else {
        this.setCellState(deck.x, deck.y, 'ship');
      }
    }
  }

  setChoosenShipCells(ship: Ship) {
    for (const deck of ship.decks) {
      this.setCellState(deck.x, deck.y, 'choosen');
    }
  }

  removeShipCells(decks: IDeck[]) {
    for (const deck of decks) {
      this.setCellState(deck.x, deck.y, 'unrevealed');
    }
  }

  findShip(x: number, y: number) {
    for (const ship of this.ships) {
      for (const deck of ship.decks) {
        if (deck.x === x && deck.y === y) {
          return ship;
        }
      }
    }
    return null;
  }
}
