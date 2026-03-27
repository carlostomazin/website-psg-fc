import {
  Card,
  CardHeader,
  CardAction,
  CardTitle,
} from "@/components/ui/card"

import { SquareArrowOutUpRight } from "lucide-react"

import type { GameData } from "@/hooks/useGameData"
import { Link } from "@tanstack/react-router"
import { Skeleton } from "@/components/ui/skeleton"

export function SectionCards({ games }: { games: GameData[] | null | undefined }) {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card">

      {games ? (
        games.map((game) => (
          <Card key={game.id} className="@container/card">
            <Link to={`/games/$game`} params={{ game: game.id }}>
              <CardHeader>
                <CardTitle>
                  {new Date(game.game_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </CardTitle>
                <CardAction>
                  <SquareArrowOutUpRight />
                </CardAction>
              </CardHeader>
            </Link>
          </Card>

        ))
      ) : (
        <Skeleton className="h-15 w-full rounded-md" />
      )}
    </div>
  )
}