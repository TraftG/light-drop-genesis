import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";

// Define types for our state
interface Position {
  x: number;
  y: number;
}

interface LightDrop {
  id: string;
  position: Position;
  brightness: number;
  createdAt: number;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  strength: number;
}

interface Pattern {
  id: string;
  name: string;
  connections: string[];
  completed: boolean;
}

interface UniverseStats {
  number: number;
  lightMultiplier: number;
}

interface GameState {
  drops: LightDrop[];
  connections: Connection[];
  patterns: Pattern[];
  lightDust: number;
  universeStats: UniverseStats;
}

interface GameContextType {
  state: GameState;
  addDrop: (x: number, y: number) => void;
  createNewUniverse: () => void;
  canCreateNewUniverse: () => boolean;
  getBgColor: () => string;
}

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Create provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state
  const [state, setState] = useState<GameState>({
    drops: [],
    connections: [],
    patterns: [],
    lightDust: 0,
    universeStats: {
      number: 1,
      lightMultiplier: 1.0,
    },
  });

  // Function to check if position is already taken
  const isPositionTaken = (x: number, y: number): boolean => {
    const threshold = 20; // minimum distance between drops
    return state.drops.some((drop) => {
      const dx = drop.position.x - x;
      const dy = drop.position.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < threshold;
    });
  };

  // Function to add a new light drop
  const addDrop = (x: number, y: number) => {
    // Check if position is already taken
    if (isPositionTaken(x, y)) {
      return; // Don't add a drop if position is taken
    }

    const newDrop: LightDrop = {
      id: uuidv4(),
      position: { x, y },
      brightness: 1,
      createdAt: Date.now(),
    };

    setState((prevState) => {
      // Add the new drop
      const updatedDrops = [...prevState.drops, newDrop];

      // Check for connections
      const newConnections = createConnections(updatedDrops, newDrop);
      const updatedConnections = [...prevState.connections, ...newConnections];

      // Check for patterns
      const { newPatterns, earnedLightDust } = checkForPatterns(
        updatedConnections,
        prevState.patterns
      );

      // Update light dust count
      const updatedLightDust =
        prevState.lightDust +
        earnedLightDust * prevState.universeStats.lightMultiplier;

      return {
        ...prevState,
        drops: updatedDrops,
        connections: updatedConnections,
        patterns: [...prevState.patterns, ...newPatterns],
        lightDust: updatedLightDust,
      };
    });
  };

  // Function to create connections between drops
  const createConnections = (
    drops: LightDrop[],
    newDrop: LightDrop
  ): Connection[] => {
    const connections: Connection[] = [];
    const MAX_CONNECTION_DISTANCE = 150;

    drops.forEach((drop) => {
      if (drop.id === newDrop.id) return;

      const dx = drop.position.x - newDrop.position.x;
      const dy = drop.position.y - newDrop.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= MAX_CONNECTION_DISTANCE) {
        const strength = 1 - distance / MAX_CONNECTION_DISTANCE;
        connections.push({
          id: uuidv4(),
          from: drop.id,
          to: newDrop.id,
          strength,
        });
      }
    });

    return connections;
  };

  // Function to check for patterns
  const checkForPatterns = (
    connections: Connection[],
    existingPatterns: Pattern[]
  ) => {
    const newPatterns: Pattern[] = [];
    let earnedLightDust = 0;

    // Define pattern detection logic here
    // Triangle pattern
    if (
      connections.length >= 3 &&
      existingPatterns.find((p) => p.name === "Треугольник") === undefined
    ) {
      const triangleFound = detectTriangle(connections);
      if (triangleFound.length > 0) {
        newPatterns.push({
          id: uuidv4(),
          name: "Треугольник",
          connections: triangleFound,
          completed: true,
        });
        earnedLightDust += 10;
      }
    }

    // Square pattern
    if (
      connections.length >= 4 &&
      existingPatterns.find((p) => p.name === "Квадрат") === undefined
    ) {
      const squareFound = detectSquare(connections);
      if (squareFound.length > 0) {
        newPatterns.push({
          id: uuidv4(),
          name: "Квадрат",
          connections: squareFound,
          completed: true,
        });
        earnedLightDust += 20;
      }
    }

    // Star pattern
    if (
      connections.length >= 5 &&
      existingPatterns.find((p) => p.name === "Звезда") === undefined
    ) {
      const starFound = detectStar(connections);
      if (starFound.length > 0) {
        newPatterns.push({
          id: uuidv4(),
          name: "Звезда",
          connections: starFound,
          completed: true,
        });
        earnedLightDust += 50;
      }
    }

    return { newPatterns, earnedLightDust };
  };

  // Pattern detection functions
  const detectTriangle = (connections: Connection[]): string[] => {
    // Simplified detection
    if (connections.length >= 3) {
      return [connections[0].id, connections[1].id, connections[2].id];
    }
    return [];
  };

  const detectSquare = (connections: Connection[]): string[] => {
    // Simplified detection
    if (connections.length >= 4) {
      return [
        connections[0].id,
        connections[1].id,
        connections[2].id,
        connections[3].id,
      ];
    }
    return [];
  };

  const detectStar = (connections: Connection[]): string[] => {
    // Simplified detection
    if (connections.length >= 5) {
      return [
        connections[0].id,
        connections[1].id,
        connections[2].id,
        connections[3].id,
        connections[4].id,
      ];
    }
    return [];
  };

  // Function to get background color based on light level
  const getBgColor = () => {
    const baseColor = 10;
    const maxColor = 30;
    const lightLevel = Math.min(state.drops.length, 50) / 50;
    const colorValue =
      baseColor + Math.floor((maxColor - baseColor) * lightLevel);
    return `rgb(${colorValue}, ${colorValue}, ${colorValue + 5})`;
  };

  // Function to create a new universe
  const createNewUniverse = () => {
    setState((prevState) => ({
      drops: [],
      connections: [],
      patterns: [],
      lightDust: prevState.lightDust, // Keep accumulated light dust
      universeStats: {
        number: prevState.universeStats.number + 1,
        lightMultiplier: prevState.universeStats.lightMultiplier + 0.1, // Increase multiplier by 10% per universe
      },
    }));
  };

  // Check if player can create a new universe
  const canCreateNewUniverse = useCallback(() => {
    return state.drops.length >= 50;
  }, [state.drops.length]);

  return (
    <GameContext.Provider
      value={{
        state,
        addDrop,
        createNewUniverse,
        canCreateNewUniverse,
        getBgColor,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
