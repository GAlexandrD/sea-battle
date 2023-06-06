import { IField } from '../src/types/IField';
import { IShip } from '../src/types/IShip';
import { game, shootRes } from '../src/logic/Game';

test('server game logic', () => {
  const ship1: IShip = {
    x: 1,
    y: 1,
    decks: [
      { x: 1, y: 1, isDamaged: false },
      { x: 2, y: 1, isDamaged: false },
    ],
  };
  const ship2: IShip = {
    x: 3,
    y: 3,
    decks: [
      { x: 3, y: 3, isDamaged: false },
      { x: 3, y: 4, isDamaged: false },
    ],
  };
  const field: IField = { height: 10, width: 10, ships: [ship1, ship2] };

  let resp: shootRes = game.shoot(1, 1, field)
  expect(resp.isShip).toBe(true)
  expect(resp.isDestroyed).toBe(null)
  expect(resp.isOver).toBe(false)
  expect(resp.x).toBe(1)
  expect(resp.y).toBe(1)

  resp = game.shoot(2, 1, field)
  expect(resp.isShip).toBe(true)
  expect(resp.isDestroyed).toBe(ship1)
  expect(resp.isOver).toBe(false)
  expect(resp.x).toBe(2)
  expect(resp.y).toBe(1)

  game.shoot(3, 3, field)
  resp = game.shoot(3, 4, field)
  expect(resp.isShip).toBe(true)
  expect(resp.isDestroyed).toBe(ship2)
  expect(resp.isOver).toBe(true)
  expect(resp.x).toBe(3)
  expect(resp.y).toBe(4)

});
