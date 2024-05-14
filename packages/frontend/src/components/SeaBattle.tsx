import React, { FC } from 'react';
import FieldComponent from '../components/Field';
import classes from '../styles/SeaBattle.module.scss';
import { useGame } from './SeaBattleProvider';
import SessionControl from './SessionControl';
import { Field } from '../logic/Field';

const SeaBattleComponent: FC = () => {
  const { game, movingSide, alliesCells, enemiesCells, isStarted } = useGame();
  const regenerateField = () => {
    game.alliesField.ships = [];
    const ships = Field.generateShips();
    for (const ship of ships) {
      game.alliesField.addShip(ship.x, ship.y, ship);
      game.reloadFields();
    }
  };
  return (
    <>
      <div className={classes.title}>Sea Battle</div>
      <SessionControl />
      {isStarted ? (
        <>
          <div className={classes.container}>
            {movingSide ? (
              <span className={classes.text_alliesTurn}>Your turn</span>
            ) : (
              <span className={classes.text_enemiesTurn}>Enemies turn</span>
            )}
            <div className={classes.container_fields}>
              <FieldComponent
                cells={alliesCells}
                onClick={() => {}}
                movingSide={movingSide}
              ></FieldComponent>
              <FieldComponent
                cells={enemiesCells}
                onClick={game.enemiesFieldOnClick}
                movingSide={!movingSide}
              ></FieldComponent>
            </div>
          </div>
        </>
      ) : (
        <>
          <FieldComponent
            cells={alliesCells}
            onClick={game.alliesFieldOnClick}
          ></FieldComponent>
          <img src="./reload.png" alt="" onClick={() => regenerateField()} className={classes.reload_btn} />
        </>
      )}
    </>
  );
};

export default SeaBattleComponent;
