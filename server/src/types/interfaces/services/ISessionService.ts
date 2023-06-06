import { IField } from "src/types/IField";
import { ISession } from "src/types/ISession";

export interface ISessionService {
  makeSession(playerId: number, field: IField): Promise<ISession>;
  connectToSession(
    playerId: number,
    sessionId: string,
    field: IField
  ): Promise<ISession>;
  deleteSession(playerId: number): Promise<ISession>;
  findSession(playerId: number): Promise<ISession>;
  getAnotherPlayer(playerId: number): Promise<number>;
}
