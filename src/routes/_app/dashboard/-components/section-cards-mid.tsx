import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "@tanstack/react-router"
import { ExternalLink } from "lucide-react"

export function SectionCardsMid({ gamesPendingPayments }: { gamesPendingPayments: any[] | null | undefined }) {
  const navigate = useNavigate()

  const handleGameClick = (gameId: string) => {
    navigate({ to: `/games/$game`, params: { game: gameId } })
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Jogos com pendência de pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {gamesPendingPayments ? (
            gamesPendingPayments.length > 0 ? (
              <div className="space-y-5">
                {gamesPendingPayments.map((game) => (
                  <div>
                    <div
                      key={game.gameId}
                      className="flex items-center justify-between text-sm"
                    >
                      <button
                        onClick={() => handleGameClick(game.gameId)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      >
                        <span>{game.gameDate}</span>
                        <ExternalLink size={16} className="opacity-60" />
                      </button>
                      <span className="font-semibold text-orange-500">
                        {game.unpaidCount}
                      </span>
                    </div>
                    <div className="border-t border-muted my-3" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum jogo com pendência de pagamento.</p>
            )
          ) : (
            <Skeleton className="h-20 w-full rounded-md" />
          )}
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Jogadores com mais tempo de inatividade</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">

        </CardContent>
      </Card>
    </div>
  )
}