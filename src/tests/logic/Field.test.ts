import { Ship } from '../../logic/Ship';
import { Field } from '../../logic/Field';

test('Field test', () => {
  const field = new Field(10, 10);
  expect(field.cells.length).toBe(10);
  for (const row of field.cells) {
    expect(row.length).toBe(10);
  }

  const ship1 = Ship.createShip(1, 1, 4, 'vertical');
  const ship2 = Ship.createShip(3, 3, 4, 'vertical');
  field.addShip(1, 1, ship1);
  field.addShip(3, 3, ship2);
  expect(field.ships.length).toBe(2);

  // forbidden move
  field.moveShip(3, 3, ship1);
  expect(ship1.x).toBe(1);
  expect(ship1.y).toBe(1);

  // allowed move
  field.moveShip(5, 3, ship1);
  expect(ship1.x).toBe(5);
  expect(ship1.y).toBe(3);

  // allowed move move
  field.turnShip(ship1);
  expect(ship1.decks[3].y).toBe(3);
  expect(ship1.decks[3].x).toBe(8);

  // forbidden move
  field.turnShip(ship2);
  expect(ship2.decks[3].x).toBe(3);
  expect(ship2.decks[3].y).toBe(6);

  const ship = field.findShip(3, 3);
  expect(ship).toBe(ship2);
});
