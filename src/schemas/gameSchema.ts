export interface Game {
  id: string;
  created_at: string;
  updated_at: string | null;
  game_date: string;
  game_price: number;
  price_per_player: number;
  goalkeepers_pay: boolean;
}

export interface GamePost {
  game_date: string;
  game_price: number;
  price_per_player: number;
  goalkeepers_pay: boolean;
}

export interface GameUpdate {
  game_date?: string;
  game_price?: number;
  price_per_player?: number;
  goalkeepers_pay?: boolean;
}