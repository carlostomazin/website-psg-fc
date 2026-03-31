import supabase from "@/lib/supabase-client";
import type { GamePlayerPost, GamePlayerUpdate } from "@/schemas/gamePlayerSchema";

export async function getGamePlayers() {
  const { data, error } = await supabase
    .from("game_players")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getGamePlayerById(id: string) {
  const { data, error } = await supabase
    .from("game_players")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getGamePlayersByGameId(gameId: string) {
  const { data, error } = await supabase
    .from("game_players")
    .select("*")
    .eq("game_id", gameId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function postGamePlayer(gamePlayer: GamePlayerPost) {
  const { data, error } = await supabase
    .from("game_players")
    .insert(gamePlayer)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateGamePlayer(id: string, updates: GamePlayerUpdate) {
  const { data, error } = await supabase
    .from("game_players")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function deleteGamePlayer(id: string) {
  const { error } = await supabase
    .from("game_players")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}