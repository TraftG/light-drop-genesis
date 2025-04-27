
import React from 'react';
import { useGame } from './GameContext';
import { Button } from "@/components/ui/button";
import { Star, Circle, Diamond, Info, Rocket } from 'lucide-react';

const GameUI: React.FC = () => {
  const { state, createNewUniverse, canCreateNewUniverse } = useGame();
  
  return (
    <div className="absolute bottom-0 left-0 p-4 w-full z-10 flex justify-between items-end">
      <div className="bg-black bg-opacity-50 p-3 rounded-lg text-white backdrop-blur-sm">
        <h2 className="text-lg font-semibold mb-1">Капли Света</h2>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <Circle className="h-4 w-4 mr-1" />
            <span>{state.drops.length}</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 mr-1 border-t border-white"></div>
            <span>{state.connections.length}</span>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 mr-1" />
            <span>{state.patterns.length}</span>
          </div>
          <div className="flex items-center">
            <Diamond className="h-4 w-4 mr-1" />
            <span>{state.lightDust} LDS</span>
          </div>
          {state.universeStats.number > 1 && (
            <div className="flex items-center">
              <Rocket className="h-4 w-4 mr-1" />
              <span>x{state.universeStats.lightMultiplier.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        {state.patterns.length > 0 && (
          <div className="bg-black bg-opacity-50 p-3 rounded-lg text-white backdrop-blur-sm">
            <h3 className="text-md font-semibold mb-1">Открытые узоры:</h3>
            <ul className="text-sm">
              {state.patterns.map((pattern) => (
                <li key={pattern.id} className="flex items-center">
                  <Star className="h-3 w-3 mr-1 text-yellow-400" />
                  <span>{pattern.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {canCreateNewUniverse() && (
            <Button
              variant="outline"
              onClick={createNewUniverse}
              className="bg-black bg-opacity-50 text-white border-white border-opacity-30 hover:bg-opacity-70 flex items-center gap-2"
            >
              <Rocket className="h-4 w-4" />
              <span>Создать новую Вселенную</span>
            </Button>
          )}

          <Button
            variant="outline" 
            size="icon" 
            className="bg-black bg-opacity-50 text-white border-white border-opacity-30 hover:bg-opacity-70"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameUI;
