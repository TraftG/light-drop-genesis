import React from "react";
import { useGame } from "./GameContext";
import { Button } from "@/components/ui/button";
import { Star, Circle, Diamond, Info, Rocket } from "lucide-react";

const GameUI: React.FC = () => {
  const { state, createNewUniverse, canCreateNewUniverse } = useGame();

  return (
    <div className="absolute bottom-6 left-0 p-2 w-full z-10 flex flex-col items-center sm:flex-row sm:justify-between sm:items-end">
      <div className="bg-black bg-opacity-50 p-3 rounded-lg text-white backdrop-blur-sm w-full sm:w-auto mb-4 sm:mb-0">
        <div className="flex flex-wrap justify-between text-xs sm:text-sm space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center">
            <Circle className="h-4 w-4 mr-1" />
            <span>{state.drops.length}</span>
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

      <div className="flex flex-col gap-2 sm:gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-2 sm:gap-4">
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
        </div>
      </div>
    </div>
  );
};

export default GameUI;
