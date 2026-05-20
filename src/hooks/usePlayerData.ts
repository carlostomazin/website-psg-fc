import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import supabase from "@/lib/supabase-client";
import type { Player, PlayerPost } from '@/schemas/playerSchema'

const fetchData = async () => {
    const response = await supabase
        .from("players")
        .select("*")
        .order("name", { ascending: false });

    return response.data;
}

const fetchDataById = async (id: string): Promise<Player | null> => {
    const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

const postData = async (player: PlayerPost) => {
    const { data, error } = await supabase
        .from("players")
        .insert(player)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export function usePlayerData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['player-data'],
    })

    return query;
}

export function usePlayerDataById(id: string) {
    return useQuery({
        queryFn: () => fetchDataById(id),
        queryKey: ['player-data', id],
        enabled: !!id,
    })
}

export function usePlayerMutate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['player-data'] })
        },
    })
}
