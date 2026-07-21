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

interface AddPlayersToGameParams {
  gameId: string;
  text?: string;
  singlePlayer?: PlayerData;
}

export function useAddPlayersToGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ gameId, text, singlePlayer }: AddPlayersToGameParams) => {
      const lista: PlayerData[] = singlePlayer
        ? [singlePlayer]
        : parseListaFutebol(text ?? "");

      // Get existing players
      const existingPlayers = await getPlayers();
      const existingGamePlayers = await getGamePlayersByGameId(gameId);

      for (const playerData of lista) {
        // Normalize player name to lowercase and trim whitespace
        const normalizedName = playerData.name.trim().toLowerCase();

        // Check if player exists (compare normalized)
        let player = existingPlayers.find(p => p.name?.trim().toLowerCase() === normalizedName);
        if (!player) {
          // Create new player with normalized name
          player = await postPlayer({ name: normalizedName });
          existingPlayers.push(player);
        }

        // Find invited_by player (normalize inviter name if present)
        let invitedById: string | null = null;
        if (playerData.invited_by_name) {
          const normalizedInvitedBy = playerData.invited_by_name.trim().toLowerCase();
          const invitedByPlayer = existingPlayers.find(p => p.name?.trim().toLowerCase() === normalizedInvitedBy);
          if (invitedByPlayer) {
            invitedById = invitedByPlayer.id;
          } else {
            // Create inviter with normalized name if they don't exist
            const newInviter = await postPlayer({ name: normalizedInvitedBy });
            invitedById = newInviter.id;
            existingPlayers.push(newInviter);
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