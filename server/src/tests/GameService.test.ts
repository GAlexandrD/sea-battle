/* eslint-disable jest/no-mocks-import */
import { FieldRepositoryMock } from './__mocks__/FieldRepository';
import { SessionRepositoryMock } from './__mocks__/SessionRepository';
import { GameRulesMock } from './__mocks__/GameRules';
import { GameService } from './../services/GameService';
import { shootRes } from './../services/GameRules';
import { IShip } from '../types/IShip';

let fieldRepositoryMock: ReturnType<typeof FieldRepositoryMock>;
let sessionRepositoryMock: ReturnType<typeof SessionRepositoryMock>;
let gameRulesMock: ReturnType<typeof GameRulesMock>;

let gameService: GameService;

describe('game service test', () => {
  beforeEach(() => {
    fieldRepositoryMock = FieldRepositoryMock();
    sessionRepositoryMock = SessionRepositoryMock();
    gameRulesMock = GameRulesMock();
    gameService = new GameService(
      fieldRepositoryMock,
      gameRulesMock,
      sessionRepositoryMock
    );
    sessionRepositoryMock.getSession.mockReturnValue({
      id: 'fdsf',
      player1: 1,
      player2: 2,
    });
  });

  it('test no session found', async () => {
    sessionRepositoryMock.getSession.mockReturnValue(null);
    await expect(gameService.shoot(1, 1, 1)).rejects.toThrow();
  });

  it('test player didn`t connected', async () => {
    sessionRepositoryMock.getSession.mockReturnValue({
      is: 1,
      player1: 1,
      player2: undefined,
    });
    await expect(gameService.shoot(1, 1, 1)).rejects.toThrow();
  });

  it('test shoot return value', async () => {
    const mockResp: shootRes = {
      x: 1,
      y: 1,
      isShip: true,
      isDestroyed: null,
      isOver: false,
    };
    gameRulesMock.shoot.mockReturnValue(mockResp);
    const response = await gameService.shoot(1, 1, 1);
    expect(response).toEqual(mockResp);
  });

  it('test destroy ship', async () => {
    const destroyedShip: IShip = {
      x: 1,
      y: 1,
      decks: [{ x: 1, y: 1, isDamaged: true }],
    };
    const mockResp: shootRes = {
      x: 1,
      y: 1,
      isShip: true,
      isDestroyed: destroyedShip,
      isOver: false,
    };
    gameRulesMock.shoot.mockReturnValue(mockResp);
    const resp = await gameService.shoot(1, 1, 1);
    expect(resp).toEqual(mockResp);
    expect(fieldRepositoryMock.updateField.mock.calls.length).toBe(1);
  });

  it('test game over', async () => {
    const destroyedShip: IShip = {
      x: 1,
      y: 1,
      decks: [{ x: 1, y: 1, isDamaged: true }],
    };
    const mockResp: shootRes = {
      x: 1,
      y: 1,
      isShip: true,
      isDestroyed: destroyedShip,
      isOver: true,
    };
    gameRulesMock.shoot.mockReturnValue(mockResp);
    const resp = await gameService.shoot(2, 1, 1);
    expect(resp).toEqual(mockResp);
    expect(fieldRepositoryMock.removeField.mock.calls.length).toBe(2);
  });

  it('test end game', async () => {
    const session = {
      id: 'fsd',
      player1: 1,
      player2: 2,
    };
    await gameService.endGame(session);
    expect(sessionRepositoryMock.deleteSession.mock.calls.length).toEqual(1);
    expect(fieldRepositoryMock.removeField.mock.calls.length).toBe(2);
  });
});
