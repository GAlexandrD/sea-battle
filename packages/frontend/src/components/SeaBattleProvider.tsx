import React, { FC, ReactNode, useContext, useState, useMemo } from 'react';
import Api from '../api/api';
import { SeaBattle } from '../logic/Game';
import { ICell } from '../types/ICell';
import { Field } from '../logic/Field';

interface SeaBattleProviderProps {
  children: ReactNode;
}

interface ISeaBattleContext {
  game: SeaBattle;
  api: Api;
  isStarted: boolean;
  winner: null | 'allies' | 'enemies';
  movingSide: boolean;
  alliesCells: ICell[][];
  enemiesCells: ICell[][];
  session: string;
  restart: Function;
}

const GameContext = React.createContext<ISeaBattleContext>(
  {} as ISeaBattleContext
);

export const useGame = () => useContext(GameContext);

const EditorProvider: FC<SeaBattleProviderProps> = ({ children }) => {
  const [movingSide, setMovingSide] = useState<boolean>(true);
  const [session, setSession] = useState<string>('');
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [winner, setWinner] = useState<null | 'allies' | 'enemies'>(null);
  const [enemiesCells, setEnemiesCells] = useState<ICell[][]>([]);
  const [alliesCells, setAlliesCells] = useState<ICell[][]>([]);
  const [value, setValue] = useState<boolean>(false);

  const restart = () => {
    game.reloadGame();
  };

  const update = (game: SeaBattle) => () => {
    setMovingSide(game.movingSide);
    setIsStarted(game.isStarted);
    setSession(game.sessionId);
    setWinner(game.winner);
    setEnemiesCells(game.enemiesField.cells);
    setAlliesCells(game.alliesField.cells);
  };

  const game = useMemo(() => {
    const game = SeaBattle.createGame();
    if (!game.alliesField.ships.length) {
      const ships = Field.generateShips();
      for (const ship of ships) {
        game.alliesField.addShip(ship.x, ship.y, ship);
      }
    }
    game.update = update(game);
    game.update();
    return game;
  }, [value]);

  const api = useMemo(() => {
    const api = Api.createApi(game);
    game.api = api;
    return api;
  }, [value]);

  return (
    <GameContext.Provider
      value={{
        game,
        api: api,
        movingSide,
        winner,
        enemiesCells,
        alliesCells,
        isStarted,
        session,
        restart,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default EditorProvider;
