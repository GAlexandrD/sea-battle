/* eslint-disable jest/no-mocks-import */
import { FieldRepositoryMock } from './__mocks__/FieldRepository';
import { SessionRepositoryMock } from './__mocks__/SessionRepository';
import { SessionService } from './../services/SessionService';

let fieldRepositoryMock = FieldRepositoryMock();
let sessionRepositoryMock: ReturnType<typeof SessionRepositoryMock>;

let sessionService: SessionService;

describe('game service test', () => {
  beforeEach(() => {
    fieldRepositoryMock = FieldRepositoryMock();
    sessionRepositoryMock = SessionRepositoryMock();
    sessionService = new SessionService(
      fieldRepositoryMock,
      sessionRepositoryMock
    );
  });

  it('create session', async () => {
    await sessionService.makeSession(1, { width: 0, height: 0, ships: [] });
    expect(fieldRepositoryMock.addField.mock.calls.length).toBe(1);
    expect(sessionRepositoryMock.createSession.mock.calls.length).toBe(1);
  });

  it('connect to session', async () => {
    sessionRepositoryMock.connectToSession.mockReturnValue({
      id: 'fs',
      player1: 1,
      player2: 1,
    });
    await sessionService.connectToSession(1, 'id', {
      width: 0,
      height: 0,
      ships: [],
    });
    expect(fieldRepositoryMock.addField.mock.calls.length).toBe(1);
    expect(sessionRepositoryMock.connectToSession.mock.calls.length).toBe(1);
  });
});
