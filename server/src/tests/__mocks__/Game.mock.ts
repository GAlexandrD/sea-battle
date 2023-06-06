import { IGame } from "src/types/interfaces/services/IGameRules";

export const SessionServiceMock = () => ({
  shoot: jest.fn(),
}) as IGame;
