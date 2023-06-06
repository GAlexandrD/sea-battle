import { IField } from '../IField';
import { ISession } from '../ISession';

export interface ISessionService {
  makeSession(playerId: number, field: IField): Promise<ISession>;
  connectToSession(
    playerId: number,
    sessionId: number,
    field: IField
  ): Promise<ISession>;
  deleteSession(playerId: number): Promise<ISession>;
  findSession(playerId: number): Promise<ISession>;
  getAnotherPlayer(playerId: number): Promise<number>;
  validateSession(playerId: number): Promise<ISession>;
}
