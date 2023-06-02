import axios from 'axios';
import { SeaBattle } from '../logic/Game';
import { IShip } from '../types/IShip';
import { IField } from '../types/IField';

interface IConnectMes {
  event: 'connect';
  userId: number;
  sessionId: number;
}

interface IShotMes {
  event: 'shoot';
  side: 'allies' | 'enemies';
  x: number;
  y: number;
  destroyed?: IShip;
  isShip: boolean;
  isWin?: boolean;
}

class Api {
  static created: Api | null = null
  ws: WebSocket = new WebSocket('ws://localhost:4000');
  game: SeaBattle | null = null;
  userId: number = 0;
  messages: any = {
    shoot: (data: any) => {
      this.shootAllies(data);
    },
    connect: (data: any) => {
      this.connectMessage(data);
    },
    'player-connected': () => {
      if (!this.game) return
      this.game.isStarted = true;
      this.game.update()
    },
    'session-closed': () => {
      if(!this.game) return
      this.game.reloadFields();
      this.game.sessionId = 0;
      this.game.update()
    },
  };
  constructor(game?: SeaBattle) {
    if(game) this.game = game;
    this.ws.onmessage = (m: MessageEvent) => this.onMessage(m);
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

  onMessage(mesEvent: MessageEvent) {
    const data = JSON.parse(mesEvent.data);
    const handler = this.messages[data.event];
    if (handler) handler(data);
  }

  async makeSession(field: IField) {
    const response = await axios.post('http://localhost:5000/make-session', {
      field,
      playerId: this.userId,
    });
    if (!response.data.sessionId) return;
    if(!this.game) return
    this.game.sessionId = response.data.sessionId;
    this.game.update()
  }

  async connectToSession(sessionId: number, field: IField) {
    const response = await axios.post(
      'http://localhost:5000/connect-to-session',
      { field, playerId: this.userId, sessionId }
    );
    if (!response.data.sessionId) return;
    if(!this.game) return
    this.game.sessionId = response.data.sessionId;
    this.game.movingSide = !this.game.movingSide;
    this.game.isStarted = true;
    this.game.update()
  }

  connectMessage(message: IConnectMes) {
    this.userId = message.userId;
  }

  async shoot(x: number, y: number) {
    const { data }: any = await axios.post('http://localhost:5000/shoot', {
      playerId: this.userId,
      x,
      y,
    });
    if (!this.game) return
    this.game.enemiesFieldOnShoot(
      x,
      y,
      data.isShip,
      data.destroyed,
      data.isOver
    );
  }

  shootAllies(message: IShotMes) {
    if(!this.game) return
    this.game.alliesFieldOnShoot(message.x, message.y);
  }
}

export default Api