import { Game } from "./logic/Game";
import { FieldService } from "./services/FieldService";
import { GameService } from "./services/GameService";
import { SessionService } from "./services/SessionService";

export const fieldService = new FieldService();
export const sessionService = new SessionService(fieldService);
const game = new Game()
export const gameService = new GameService(fieldService, game, sessionService)