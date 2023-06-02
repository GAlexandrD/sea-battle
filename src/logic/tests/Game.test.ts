import { Ship } from '../Ship';
import { SeaBattle } from '../Game';

test('Field test', () => {
  const game = new SeaBattle();
  game.movingSide = true;
  const ship = Ship.createShip(1, 1, 2, 'horizontal');
  game.alliesField.addShip(1, 1, ship);

  game.alliesFieldOnShoot(1, 1);
  expect(ship.decks[0].isDamaged).toBe(true);

  game.alliesFieldOnShoot(2, 1);
  expect(ship.decks[1].isDamaged).toBe(true);
  expect(ship.isDestroyed()).toBe(true);
  expect(game.winner).toBe('enemies');
});
