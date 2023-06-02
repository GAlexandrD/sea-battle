import React from 'react';
import GameProvider from './SeaBattleProvider';
import SeaBattleComponent from './SeaBattle';

function SeaBattleContainer() {
  return (
    <GameProvider>
      <SeaBattleComponent />
    </GameProvider>
  );
}

export default SeaBattleContainer;
