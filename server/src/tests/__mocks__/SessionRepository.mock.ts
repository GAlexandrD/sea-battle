import { ISessionRepository } from 'src/types/interfaces/repositories/ISessionRepository';

export const SessionRepositoryMock = () =>
  ({
    createSession: jest.fn(),
    connectToSession: jest.fn(),
    deleteSession: jest.fn(),
    getSession: jest.fn(),
  } as ISessionRepository);
