import { Ship } from '../../logic/Ship';
import { SeaBattle } from '../../logic/Game';

describe('Field test', () => {
  const game = new SeaBattle();
  game.movingSide = true;
  const ships = [
    Ship.createShip(1, 1, 2, 'horizontal'),
    Ship.createShip(5, 5, 1, 'horizontal'),
  ];

  game.alliesField.addShip(1, 1, ships[0]);
  game.alliesField.addShip(5, 5, ships[1]);

  describe('allies fiield hit', () => {
    it('ship damaged', () => {
      game.alliesFieldOnShoot(1, 1);
      expect(ships[0].decks[0].isDamaged).toBe(true);
    });

    it('ship destroyed', () => {
      game.alliesFieldOnShoot(2, 1);
      expect(ships[0].decks[1].isDamaged).toBe(true);
      expect(ships[0].isDestroyed()).toBe(true);
    });

    it('game over', () => {
      game.alliesFieldOnShoot(5, 5)
      expect(ships[1].isDestroyed()).toBe(true)
      expect(game.winner).toBe('enemies');
    })
  });

 
});
