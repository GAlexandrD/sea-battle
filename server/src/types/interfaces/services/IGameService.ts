import { shootRes } from "src/services/GameRules"
import { ISession } from "../../ISession"

export interface IGameService {
  shoot(playerId: number, x: number, y: number): Promise<shootRes> 
  endGame(session: ISession): Promise<void>
}