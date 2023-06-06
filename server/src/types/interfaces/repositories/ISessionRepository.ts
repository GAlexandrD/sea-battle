import { ISession } from "src/types/ISession";

export interface ISessionRepository {
  createSession(playerId: number): Promise<ISession>
  connectToSession(playerId: number, sessionId: string): Promise<ISession>
  getSession(playerId: number): Promise<ISession | null>
  deleteSession(playerId: number): Promise<ISession>
}