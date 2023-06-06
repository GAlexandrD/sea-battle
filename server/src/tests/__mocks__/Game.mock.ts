import { IGameRules } from "src/types/interfaces/services/IGameRules";

export const SessionServiceMock = () => ({
  shoot: jest.fn(),
}) as IGameRules;
