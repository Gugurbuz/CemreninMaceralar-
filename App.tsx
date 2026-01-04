import React from 'react';
import { GameCanvas } from './components/GameCanvas';

function App() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-stone-900">
      <GameCanvas />
    </div>
  );
}

export default App;