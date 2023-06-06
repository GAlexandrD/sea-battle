import { FieldRepository } from "./repositories/FieldRepository";
import { SessionRepository } from "./repositories/SessionRepository";
import { GameRules } from "./services/GameRules";
import { GameService } from "./services/GameService";
import { SessionService } from "./services/SessionService";

export const fieldRepository = new FieldRepository();
export const sessionRepository = new SessionRepository();
export const sessionService = new SessionService(fieldRepository, sessionRepository)
const game = new GameRules()
export const gameService = new GameService(fieldRepository, game, sessionRepository)