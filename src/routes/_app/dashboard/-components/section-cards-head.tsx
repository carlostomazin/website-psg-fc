import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { GameData } from "@/hooks/useGameData"

export function SectionCardsHead( { games, players }: { games: GameData[] | null | undefined, players: any[] | null | undefined }) {
  return (
    <div className="grid grid-cols-3 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Jogos</CardDescription>
        </CardHeader>
        <CardContent className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {games ? games.length : <Skeleton className="h-5 w-25 rounded-full" />}
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Jogadores</CardDescription>
        </CardHeader>
        <CardContent className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {players ? players.length : <Skeleton className="h-5 w-25 rounded-full" />}
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Caixa</CardDescription>
        </CardHeader>
        <CardContent className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            R$ 0,00
        </CardContent>
      </Card>
    </div>
  )
}