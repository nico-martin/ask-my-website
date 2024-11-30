export interface VectorDBStats {
  parsedCharacters: number;
  entries: number;
  sections: number;
}

export interface Source {
  content: string;
  id: string;
}
