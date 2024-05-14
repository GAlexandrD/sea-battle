import React, { FC, useState } from 'react';
import classes from '../styles/SessionControl.module.scss';
import { useGame } from './SeaBattleProvider';
import { IField } from '../types/IField';

const SessionControl: FC = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const { api, session, game, isStarted, winner, restart } = useGame();
  const onMakeSession = () => {
    const field: IField = {
      ships: game.alliesField.ships,
      width: game.alliesField.width,
      height: game.alliesField.height,
      cells: [],
    };
    api.makeSession(field);
  };

  const onConnectToSession = () => {
    if (!sessionId) return;
    const field: IField = {
      ships: game.alliesField.ships,
      width: game.alliesField.width,
      height: game.alliesField.height,
      cells: [],
    };
    api.connectToSession(sessionId, field);
    setSessionId('');
  };
  return (
    <div className={classes.container}>
      {winner ? (
        <>
          {winner === 'allies' ? (
            <span className={classes.session_text_win}>WIN</span>
          ) : (
            <span className={classes.session_text_lose}>LOSE</span>
          )}
          <button className={classes.button_return} onClick={(e) => restart()}>
            Exit
          </button>
        </>
      ) : (
        <>
          {isStarted ? (
            <div className={classes.session}>
              <span className={classes.session_text_start}>
                Game started, your session:{' '}
              </span>
              <span className={classes.session_code}>{session}</span>
            </div>
          ) : (
            <>
              <input
                value={sessionId}
                className={classes.session_input}
                onInput={(e: any) => {
                  setSessionId(e.target.value);
                }}
                placeholder="input session id"
              />
              <div className={classes.buttons}>
                <button className={classes.button} onClick={onMakeSession}>
                  Make Session
                </button>
                <button className={classes.button} onClick={onConnectToSession}>
                  Connect
                </button>
              </div>
              <div className={classes.session}>
                {!!session && (
                  <>
                    <span className={classes.session_text}>
                      Your session id:{' '}
                    </span>
                    <span className={classes.session_code}>{session}</span>
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SessionControl;
