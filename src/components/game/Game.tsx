
import React, { useState } from 'react';
import { GameProvider } from './GameContext';
import LightCanvas from './LightCanvas';
import GameUI from './GameUI';
import GameIntro from './GameIntro';

const Game: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  
  return (
    <GameProvider>
      <div className="w-full h-screen overflow-hidden relative">
        <LightCanvas />
        <GameUI />
        {showIntro && <GameIntro onStart={() => setShowIntro(false)} />}
      </div>
    </GameProvider>
  );
};

export default Game;
