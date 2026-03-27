import { useQuery } from '@tanstack/react-query'
import supabase from "@/lib/supabase-client"

export interface GamePlayerData {
  id: string
  game_id: string
  game: {
    id: string
    game_date: string
  }
  player_id: string
  player: {
    id: string
    name: string
  }
  created_at: string
  updated_at: string | null
  is_goalkeeper: boolean
  is_visitor: boolean
  invited_by: string | null
  team: string | null
  amount_paid: number | null
  paid: boolean
}

const fetchData = async (): Promise<GamePlayerData[] | null> => {
  const response = await supabase
    .from("game_players")
    .select("*, player:player_id(id, name), game:game_id(id, game_date)")
    .order('created_at', { ascending: false })

  return response.data
}

export function useGamePlayerData() {
  const query = useQuery({
    queryKey: ['game-player-data'],
    queryFn: fetchData,
  })

  return query
}

export function useGamesPendingPayments() {
  return useQuery({
    queryKey: ['game-player-data'], // Usa a mesma chave
    queryFn: fetchData,
    // O 'select' transforma o dado retornado pela queryFn
    select: (gamePlayers) => {
      if (!gamePlayers || gamePlayers.length === 0) return [];

      const gameMap = new Map<string, { gameDate: string; unpaidCount: number }>();
      
      gamePlayers.forEach((player) => {
        if (!gameMap.has(player.game_id)) {
          gameMap.set(player.game_id, {
            gameDate: player.game.game_date,
            unpaidCount: 0,
          });
        }
        if (!player.paid) {
          const game = gameMap.get(player.game_id)!;
          game.unpaidCount += 1;
        }
      });

      return Array.from(gameMap.entries())
        .filter(([, game]) => game.unpaidCount > 0)
        .map(([gameId, game]) => ({
          gameId,
          gameDate: new Date(game.gameDate).toLocaleDateString('pt-BR'),
          unpaidCount: game.unpaidCount,
        }))
        .sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime());
    }
  });
}