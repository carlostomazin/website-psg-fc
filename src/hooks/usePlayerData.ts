import { useQuery } from '@tanstack/react-query'
import supabase from "@/lib/supabase-client";

const fetchData = async () => {
    const response = await supabase
        .from("players")
        .select("*")
        .order("name", { ascending: false });

    return response.data;
}

export function usePlayerData() {
    const query = useQuery({
        queryFn: fetchData,
        queryKey: ['player-data'],
    })

    return query;
}
