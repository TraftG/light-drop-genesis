
export interface Position {
  x: number;
  y: number;
}

export interface LightDrop {
  id: string;
  position: Position;
  createdAt: number;
  brightness: number;
}

export interface Connection {
  from: string;
  to: string;
  strength: number;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  drops: string[];
  connections: Connection[];
}

export interface Constellation {
  id: string;
  name: string;
  patterns: string[];
  value: number;
}

export const PatternTemplates: Record<string, { name: string, description: string }> = {
  "spiral": {
    name: "Спираль",
    description: "Вечное движение, начало и конец.",
  },
  "lotus": {
    name: "Лотос",
    description: "Рождение нового в чистоте помыслов.",
  },
  "tree": {
    name: "Древо",
    description: "Соединение миров, корни и крона.",
  },
}
