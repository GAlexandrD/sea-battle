export const SessionRepositoryMock = () =>
  ({
    createSession: jest.fn(),
    connectToSession: jest.fn(),
    deleteSession: jest.fn(),
    getSession: jest.fn(),
  });
