import { IDeck } from '../../types/IShip';
import { Ship } from '../../logic/Ship';

test('Ship test', () => {
  const ship = new Ship(1, 1, [
    { x: 1, y: 1, isDamaged: false },
    { x: 1, y: 2, isDamaged: false },
  ]);
  ship.damage(1, 2);
  expect(ship.decks[1].isDamaged).toBe(true);
  expect(ship.decks[0].isDamaged).toBe(false);
  ship.damage(1, 1);
  expect(ship.decks[1].isDamaged).toBe(true);
  expect(ship.decks[0].isDamaged).toBe(true);
  expect(ship.isDestroyed()).toBe(true);

  const createdShip = Ship.createShip(3, 3, 4, 'horizontal');
  const decks: IDeck[] = [
    { x: 3, y: 3, isDamaged: false },
    { x: 4, y: 3, isDamaged: false },
    { x: 5, y: 3, isDamaged: false },
    { x: 6, y: 3, isDamaged: false },
  ];
  expect(createdShip.decks).toEqual(decks);
});
