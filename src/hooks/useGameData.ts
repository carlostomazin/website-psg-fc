import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import supabase from "@/lib/supabase-client";

export interface GameData {
    id: string;
    game_date: string;
    game_price: number;
    price_per_player: number;
    goalkeeper_pays: boolean;
}

export interface GameDataPost {
    game_date: string;
    game_price: number;
    price_per_player: number;
    goalkeepers_pay: boolean;
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

const postData = async (data: GameDataPost) => {
    return await supabase
        .from("games")
        .insert(data)
}

export function useGameMutate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['game-data'] })
        },
    })
}
