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

const fetchDataById = async (id: string): Promise<GameData | null> => {
    const response = await supabase
        .from("games")
        .select("*")
        .eq("id", id)
        .single();
    
    return response.data;
}

export function useGameData() {
    const query = useQuery({
        queryKey: ['game-data'],
        queryFn: fetchData,
    })

    return query;
}

export function useGameDataById(id: string) {
    const query = useQuery({
        queryKey: ['game-data', id],
        queryFn: () => fetchDataById(id),
        enabled: !!id,

    })
    return query;
}
