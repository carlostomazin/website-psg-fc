import { useQuery } from '@tanstack/react-query'
import supabase from "@/lib/supabase-client";

export interface GameData {
    id: string;
    game_date: string;
}

const fetchData = async (): Promise<GameData[] | null> => {
    const response = await supabase
        .from("games")
        .select("*")
        .order("game_date", { ascending: false });

    return response.data;
}

export function useGameData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['game-data'],
    })

    return query;
}

// export const useGameById = (gameId: string) => {
//     return useQuery({
//         queryKey: ['game', gameId],
//         queryFn: () => getGameById(gameId),
//         enabled: !!gameId, // Only run the query if gameId is provided
//     })
// }