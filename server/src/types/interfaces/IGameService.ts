import { shootRes } from "src/logic/Game"
import { ISession } from "../ISession"

export interface IGameService {
  shoot(playerId: number, x: number, y: number): Promise<shootRes> 
  endGame(session: ISession): Promise<void>
}