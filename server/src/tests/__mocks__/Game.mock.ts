import { IGame } from "src/types/interfaces/services/IGame";

export const SessionServiceMock = () => ({
  shoot: jest.fn(),
}) as IGame;
