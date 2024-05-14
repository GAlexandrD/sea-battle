import Api from '../api/api';
import { ICell } from '../types/ICell';
import { IShip } from '../types/IShip';
import { Field } from './Field';
import { Ship } from './Ship';

export class SeaBattle {
  static created: SeaBattle | null;
  api: Api | null = null;
  userId: number = 0;
  alliesField: Field;
  enemiesField: Field;
  isStarted: boolean = false;
  movingSide: boolean = true;
  sessionId: string = '';
  winner: null | 'allies' | 'enemies' = null;
  update: Function = () => {};
  constructor(update?: Function, api?: Api) {
    if (update) this.update = update;
    if (api) this.api = api;
    this.alliesField = new Field(10, 10);
    this.enemiesField = new Field(10, 10);
    this.enemiesFieldOnClick = this.enemiesFieldOnClick.bind(this);
    this.alliesFieldOnShoot = this.alliesFieldOnShoot.bind(this);
    this.alliesFieldOnClick = this.alliesFieldOnClick.bind(this);
  }

  static createGame(update?: Function, api?: Api): SeaBattle {
    if (this.created) {
      if (update) this.created.update = update;
      if (api) this.created.api = api;
      return this.created;
    }
    this.created = new SeaBattle(update, api);
    return this.created;
  }

  enemiesFieldOnClick(x: number, y: number) {
    if (!this.movingSide) return;
    let cell: ICell | null = null;
    for (const row of this.enemiesField.cells) {
      for (const c of row) {
        if (c.x === x && c.y === y) cell = c;
      }
    }
    if (!cell) return;
    if (cell.variant !== 'unrevealed') return;
    if (this.api) this.api.shoot(x, y);
  }

  enemiesFieldOnShoot(
    x: number,
    y: number,
    isShip: boolean,
    destroyed?: IShip,
    isWin?: boolean
  ) {
    if (this.winner) return;
    if (!isShip) {
      this.enemiesField.setCellState(x, y, 'checked');
      this.movingSide = !this.movingSide;
    } else if (!destroyed) {
      this.enemiesField.setCellState(x, y, 'damaged');
    } else {
      const ship = new Ship(destroyed.x, destroyed.y, destroyed.decks);
      this.enemiesField.addShip(ship.x, ship.y, ship);
      this.enemiesField.setShipCells(ship.decks, ship.isDestroyed());
      if (isWin) {
        this.winner = 'allies';
      }
    }
    this.update();
  }

  alliesFieldOnShoot(x: number, y: number) {
    if (this.winner) return;
    const ship = this.alliesField.findShip(x, y);
    if (!ship) {
      this.alliesField.setCellState(x, y, 'checked');
      this.movingSide = !this.movingSide;
      this.update();
      return;
    }
    ship.damage(x, y);
    this.alliesField.setShipCells(ship.decks, ship.isDestroyed());
    if (ship.isDestroyed()) {
      let isLost = true;
      for (const ship of this.alliesField.ships) {
        if (!ship.isDestroyed()) isLost = false;
      }
      if (isLost) {
        this.winner = 'enemies';
      }
    }
    this.update();
  }

  alliesFieldOnClick(x: number, y: number) {
    const ship = this.alliesField.findShip(x, y);
    const choosenShip = this.alliesField.choosenShip;
    if (choosenShip) {
      if (ship && ship.x === choosenShip.x && ship.y === choosenShip.y) {
        this.alliesField.turnShip(ship);
        this.alliesField.choosenShip = null;
      } else {
        this.alliesField.moveShip(x, y, choosenShip);
        this.alliesField.choosenShip = null;
      }
      this.update();
      return;
    }
    if (!ship) return;
    this.alliesField.choosenShip = ship;
    this.alliesField.setChoosenShipCells(ship);
    this.update();
  }

  reloadGame() {
    this.reloadFields();
    this.movingSide = true;
    this.isStarted = false;
    this.winner = null;
    this.sessionId = '';
    this.update();
  }

  reloadFields() {
    this.enemiesField.ships = [];
    for (const row of this.enemiesField.cells) {
      for (const cell of row) {
        this.enemiesField.setCellState(cell.x, cell.y, 'unrevealed');
      }
    }
    for (const row of this.alliesField.cells) {
      for (const cell of row) {
        this.alliesField.setCellState(cell.x, cell.y, 'unrevealed');
      }
    }
    for (const ship of this.alliesField.ships) {
      for (const deck of ship.decks) {
        deck.isDamaged = false;
      }
      this.alliesField.setShipCells(ship.decks, false);
    }
    this.update()
  }
}
