
import React, { useRef, useEffect } from 'react';
import { useGame } from './GameContext';

const LightCanvas: React.FC = () => {
  const { state, addDrop, getBgColor } = useGame();
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle click to create a new drop
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    addDrop(x, y);
  };

  // Update background color based on light level
  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.style.backgroundColor = 'rgb(10, 10, 12)'; // Set a dark background instead of dynamic whitening
    }
  }, []);

  return (
    <div 
      ref={canvasRef}
      className="game-container w-full h-full absolute inset-0 overflow-hidden cursor-pointer"
      onClick={handleCanvasClick}
    >
      {/* SVG layer for connections */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {state.connections.map((connection, index) => {
          const fromDrop = state.drops.find(d => d.id === connection.from);
          const toDrop = state.drops.find(d => d.id === connection.to);
          
          if (!fromDrop || !toDrop) return null;
          
          return (
            <line
              key={`conn-${index}`}
              x1={fromDrop.position.x}
              y1={fromDrop.position.y}
              x2={toDrop.position.x}
              y2={toDrop.position.y}
              className="light-connection"
              style={{ opacity: connection.strength }}
            />
          );
        })}
      </svg>

      {/* Light drops */}
      {state.drops.map((drop) => (
        <div
          key={drop.id}
          className="light-drop drop-appear absolute rounded-full bg-white"
          style={{
            left: `${drop.position.x}px`,
            top: `${drop.position.y}px`,
            width: '8px',
            height: '8px',
            transform: 'translate(-50%, -50%)',
            opacity: 0.8 + drop.brightness * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default LightCanvas;
