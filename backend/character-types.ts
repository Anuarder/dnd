/**
 * Character entity types
 */

export interface Character {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCharacterInput {
  name: string;
  [key: string]: unknown;
}

export interface CreateCharacterResponse {
  success: boolean;
  data: Character;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}



