
import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { LightDrop, Connection, Pattern, Constellation } from './models/LightDrop';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { PatternTemplates } from './models/LightDrop';

interface GameState {
  drops: LightDrop[];
  connections: Connection[];
  patterns: Pattern[];
  constellations: Constellation[];
  lightLevel: number;
  lightDust: number;
  discoveredPatterns: string[];
}

type GameAction =
  | { type: 'ADD_DROP'; drop: LightDrop }
  | { type: 'CONNECT_DROPS'; connection: Connection }
  | { type: 'DISCOVER_PATTERN'; pattern: Pattern }
  | { type: 'FORM_CONSTELLATION'; constellation: Constellation }
  | { type: 'INCREASE_LIGHT_LEVEL'; amount: number }
  | { type: 'EARN_LIGHT_DUST'; amount: number };

const initialState: GameState = {
  drops: [],
  connections: [],
  patterns: [],
  constellations: [],
  lightLevel: 0,
  lightDust: 0,
  discoveredPatterns: [],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_DROP':
      return {
        ...state,
        drops: [...state.drops, action.drop],
      };

    case 'CONNECT_DROPS':
      // Don't add duplicate connections
      const connectionExists = state.connections.some(
        conn => (conn.from === action.connection.from && conn.to === action.connection.to) ||
               (conn.from === action.connection.to && conn.to === action.connection.from)
      );
      if (connectionExists) {
        return state;
      }
      return {
        ...state,
        connections: [...state.connections, action.connection],
      };

    case 'DISCOVER_PATTERN':
      if (state.discoveredPatterns.includes(action.pattern.id)) {
        return state;
      }
      toast(`Открыт узор: ${action.pattern.name}`);
      return {
        ...state,
        patterns: [...state.patterns, action.pattern],
        discoveredPatterns: [...state.discoveredPatterns, action.pattern.id],
        lightLevel: Math.min(100, state.lightLevel + 3),
      };

    case 'FORM_CONSTELLATION':
      toast(`Создано созвездие: ${action.constellation.name}`, {
        description: `Стоимость: ${action.constellation.value} LDS`
      });
      return {
        ...state,
        constellations: [...state.constellations, action.constellation],
        lightLevel: Math.min(100, state.lightLevel + 10),
      };

    case 'INCREASE_LIGHT_LEVEL':
      return {
        ...state,
        lightLevel: Math.min(100, state.lightLevel + action.amount),
      };

    case 'EARN_LIGHT_DUST':
      return {
        ...state,
        lightDust: state.lightDust + action.amount,
      };

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  addDrop: (x: number, y: number) => void;
  checkPatterns: () => void;
  getBgColor: () => string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

const CONNECTION_DISTANCE = 150;

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const addDrop = useCallback((x: number, y: number) => {
    const newDrop: LightDrop = {
      id: uuidv4(),
      position: { x, y },
      createdAt: Date.now(),
      brightness: 1,
    };
    
    dispatch({ type: 'ADD_DROP', drop: newDrop });
    dispatch({ type: 'EARN_LIGHT_DUST', amount: 1 });
    
    if (state.drops.length > 0) {
      dispatch({ type: 'INCREASE_LIGHT_LEVEL', amount: 0.2 });
    }
    
    // After adding a new drop, check for possible connections
    state.drops.forEach(existingDrop => {
      const dx = existingDrop.position.x - newDrop.position.x;
      const dy = existingDrop.position.y - newDrop.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= CONNECTION_DISTANCE) {
        const connection: Connection = {
          from: existingDrop.id,
          to: newDrop.id,
          strength: 1 - distance / CONNECTION_DISTANCE, // Higher strength for closer drops
        };
        dispatch({ type: 'CONNECT_DROPS', connection });
      }
    });
  }, [state.drops]);

  // Simple pattern detection (this would be more sophisticated in a full game)
  const checkPatterns = useCallback(() => {
    // Check for simple patterns based on the number of connections
    if (state.connections.length === 5 && !state.discoveredPatterns.includes('spiral')) {
      const pattern: Pattern = {
        id: 'spiral',
        name: PatternTemplates.spiral.name,
        description: PatternTemplates.spiral.description,
        drops: Array.from(new Set(state.connections.flatMap(conn => [conn.from, conn.to]))),
        connections: state.connections.slice(-5),
      };
      dispatch({ type: 'DISCOVER_PATTERN', pattern });
    }
    
    if (state.connections.length === 10 && !state.discoveredPatterns.includes('lotus')) {
      const pattern: Pattern = {
        id: 'lotus',
        name: PatternTemplates.lotus.name,
        description: PatternTemplates.lotus.description,
        drops: Array.from(new Set(state.connections.flatMap(conn => [conn.from, conn.to]))),
        connections: state.connections.slice(-7),
      };
      dispatch({ type: 'DISCOVER_PATTERN', pattern });
    }
    
    if (state.connections.length === 15 && !state.discoveredPatterns.includes('tree')) {
      const pattern: Pattern = {
        id: 'tree',
        name: PatternTemplates.tree.name,
        description: PatternTemplates.tree.description,
        drops: Array.from(new Set(state.connections.flatMap(conn => [conn.from, conn.to]))),
        connections: state.connections.slice(-9),
      };
      dispatch({ type: 'DISCOVER_PATTERN', pattern });
    }
    
    // Check if we can form a constellation from discovered patterns
    if (state.patterns.length >= 3 && state.constellations.length === 0) {
      const constellation: Constellation = {
        id: uuidv4(),
        name: "Первый Свет",
        patterns: state.patterns.map(p => p.id),
        value: 100,
      };
      dispatch({ type: 'FORM_CONSTELLATION', constellation });
      dispatch({ type: 'EARN_LIGHT_DUST', amount: 100 });
    }
  }, [state.connections, state.patterns, state.constellations, state.discoveredPatterns]);

  // Run pattern check when connections change
  useEffect(() => {
    checkPatterns();
  }, [state.connections.length, checkPatterns]);

  // Calculate background color based on light level
  const getBgColor = useCallback(() => {
    const lightValue = Math.floor((state.lightLevel / 100) * 25); // Max 25% brightness
    return `rgb(${lightValue}, ${lightValue}, ${Math.floor(lightValue * 1.2)})`;
  }, [state.lightLevel]);

  return (
    <GameContext.Provider value={{ state, addDrop, checkPatterns, getBgColor }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
