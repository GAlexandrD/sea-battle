import React, {
  FC,
  ReactNode,
  useContext,
  useState,
  useMemo,
} from 'react';
import Api from '../api/api';
import { SeaBattle } from '../logic/Game';
import { Ship } from '../logic/Ship';
import { ICell } from '../types/ICell';

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
  session: number;
  restart: Function;
}

const GameContext = React.createContext<ISeaBattleContext>(
  {} as ISeaBattleContext
);

export const useGame = () => useContext(GameContext);

const EditorProvider: FC<SeaBattleProviderProps> = ({ children }) => {
  const [movingSide, setMovingSide] = useState<boolean>(true);
  const [session, setSession] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [winner, setWinner] = useState<null | 'allies' | 'enemies'>(null);
  const [enemiesCells, setEnemiesCells] = useState<ICell[][]>([]);
  const [alliesCells, setAlliesCells] = useState<ICell[][]>([]);
  const [value, setValue] = useState<boolean>(false);

  const restart = () => {
    setValue(!value);
  };

  const update = (game: SeaBattle) => () => {
    setMovingSide(game.movingSide);
    setSession(game.api.sessionId);
    setIsStarted(game.isStarted);
    setWinner(game.winner);
    setEnemiesCells(game.enemiesField.cells);
    setAlliesCells(game.alliesField.cells);
  }

  const game = useMemo(() => {
    const game = new SeaBattle(
      () => {}
    );
    game.update = update(game)
    game.update()
    const ships = [
      Ship.createShip(1, 1, 4, 'horizontal'),
      Ship.createShip(1, 3, 3, 'horizontal'),
      Ship.createShip(1, 5, 3, 'horizontal'),
      Ship.createShip(1, 7, 2, 'horizontal'),
      Ship.createShip(4, 7, 2, 'horizontal'),
      Ship.createShip(1, 9, 2, 'horizontal'),
      Ship.createShip(10, 10, 1, 'horizontal'),
      Ship.createShip(10, 8, 1, 'horizontal'),
      Ship.createShip(10, 6, 1, 'horizontal'),
      Ship.createShip(10, 4, 1, 'horizontal'),
    ];
    for (const ship of ships) {
      game.alliesField.addShip(ship.x, ship.y, ship);
    }
    console.log(game.alliesField);
    return game;
  }, [value]);

  return (
    <GameContext.Provider
      value={{
        game,
        api: game.api,
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
