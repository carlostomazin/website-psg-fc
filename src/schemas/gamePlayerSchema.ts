export interface GamePlayer {
  id: string;
  game_id: string;
  player_id: string;
  created_at: string;
  updated_at: string | null;
  is_goalkeeper: boolean;
  is_visitor: boolean;
  invited_by: string | null;
  team: string | null;
  amount_paid: number;
  paid: boolean;
}

export interface GamePlayerPost {
  game_id: string;
  player_id: string;
  is_goalkeeper?: boolean;
  is_visitor?: boolean;
  invited_by?: string | null;
  team?: string | null;
  amount_paid?: number;
  paid?: boolean;
}

export interface GamePlayerUpdate {
  is_goalkeeper?: boolean;
  is_visitor?: boolean;
  invited_by?: string | null;
  team?: string | null;
  amount_paid?: number;
  paid?: boolean;
}