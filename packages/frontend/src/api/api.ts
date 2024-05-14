import axios from 'axios';
import { SeaBattle } from '../logic/Game';
import { IShip } from '../types/IShip';
import { IField } from '../types/IField';
import { io } from 'socket.io-client';
import { HTTP_URL, WS_URL } from './api.constants';

interface IShotMes {
  event: 'shoot';
  side: 'allies' | 'enemies';
  x: number;
  y: number;
  isDestroyed: IShip | null;
  isShip: boolean;
  isWin?: boolean;
}

class Api {
  static created: Api | null = null
  ws = io(WS_URL, { transports: ["websocket"] });
  game: SeaBattle | null = null;
  userId: number = 0;

  constructor(game?: SeaBattle) {
    if(game) this.game = game;
    
    this.ws.on('shoot', (payload: any) => {
      this.shootAllies(payload);
    })

    this.ws.on('connect-player', (data: any) => {
      this.userId = data
    })

    this.ws.on('player-connected', () => {
      if (!this.game) return
      this.game.isStarted = true;
      this.game.reloadFields()
    })

    this.ws.on('session-closed', () => {
      if(!this.game) return
      this.game.reloadGame();
      this.game.sessionId = '';
      this.game.update()
    })

    this.makeSession = this.makeSession.bind(this);
    this.connectToSession = this.connectToSession.bind(this);
    this.shoot = this.shoot.bind(this);
  }

  static createApi(game?: SeaBattle) {
    if(Api.created) {
      if(game) Api.created.game = game
      return Api.created
    }
    Api.created = new Api(game)
    return Api.created
  }

  async makeSession(field: IField) {
    const response = await axios.post(`${HTTP_URL}/game/make-session`, {
      field,
      playerId: this.userId,
    });
    if (!response.data.sessionId) return;
    if(!this.game) return
    this.game.sessionId = response.data.sessionId;
    this.game.reloadFields()
  }

  async connectToSession(sessionId: string, field: IField) {
    const response = await axios.post(
      `${HTTP_URL}/game/connect-to-session`,
      { field, playerId: this.userId, sessionId }
    );
    if (!response.data.sessionId) return;
    if(!this.game) return
    this.game.sessionId = response.data.sessionId;
    this.game.movingSide = !this.game.movingSide;
    this.game.isStarted = true;
    this.game.reloadFields()
  }

  async shoot(x: number, y: number) {
    const { data }: any = await axios.post(`${HTTP_URL}/game/shoot`, {
      playerId: this.userId,
      x,
      y,
    });
    if (!this.game) return
    this.game.enemiesFieldOnShoot(
      x,
      y,
      data.isShip,
      data.isDestroyed,
      data.isOver
    );
  }

  shootAllies(message: IShotMes) {
    if(!this.game) return
    this.game.alliesFieldOnShoot(message.x, message.y);
  }
}

export default Api