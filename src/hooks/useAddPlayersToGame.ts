import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseListaFutebol } from '@/lib/utils';
import { postPlayer, getPlayers } from '@/services/playerService';
import { postGamePlayer, getGamePlayersByGameId } from '@/services/gamePlayerService';

interface PlayerData {
  name: string;
  is_goalkeeper: boolean;
  is_visitor: boolean;
  invited_by_name: string | null;
}

export function useAddPlayersToGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gameId, text }: { gameId: string; text: string }) => {
      const lista: PlayerData[] = parseListaFutebol(text);

      // Get existing players
      const existingPlayers = await getPlayers();
      const existingGamePlayers = await getGamePlayersByGameId(gameId);

      for (const playerData of lista) {
        // Check if player exists
        let player = existingPlayers.find(p => p.name === playerData.name);
        if (!player) {
          // Create new player
          player = await postPlayer({ name: playerData.name });
        }

        // Find invited_by player
        let invitedById: string | null = null;
        if (playerData.invited_by_name) {
          const invitedByPlayer = existingPlayers.find(p => p.name === playerData.invited_by_name);
          if (invitedByPlayer) {
            invitedById = invitedByPlayer.id;
          } else {
            // Optionally, you could create the inviter as well if they don't exist
            const newInviter = await postPlayer({ name: playerData.invited_by_name });
            invitedById = newInviter.id;
          }
        }

        // Check if already in game
        const alreadyInGame = existingGamePlayers.some(gp => gp.player_id === player.id);
        if (!alreadyInGame) {
          // Add to game
          await postGamePlayer({
            game_id: gameId,
            player_id: player.id,
            is_goalkeeper: playerData.is_goalkeeper,
            is_visitor: playerData.is_visitor,
            invited_by: invitedById,
          });
        }
      }
    },
    onSuccess: (_, { gameId }) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['player-data'] });
      queryClient.invalidateQueries({ queryKey: ['game-player-data', gameId] });
    },
  });
}