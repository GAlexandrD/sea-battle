export interface IDeck {
  isDamaged: boolean;
  x: number;
  y: number;
}

export interface IShip {
  x: number;
  y: number;
  decks: IDeck[];
}
