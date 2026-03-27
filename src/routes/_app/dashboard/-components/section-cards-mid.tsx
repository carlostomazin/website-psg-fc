import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SectionCardsMid({ gamesPendingPayments }: { gamesPendingPayments: any[] | null | undefined }) {

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Jogos com pendência de pagamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {gamesPendingPayments ? (
            gamesPendingPayments.length > 0 ? (
              <div className="space-y-2">
                {gamesPendingPayments.map((game) => (
                  <div
                    key={game.gameId}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{game.gameDate}</span>
                    <span className="font-semibold text-orange-500">
                      {game.unpaidCount} {game.unpaidCount === 1 ? 'jogador' : 'jogadores'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum jogo com pendência de pagamento.</p>
            )
          ) : (
            <Skeleton className="h-[80px] w-full rounded-md" />
          )}
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Jogadores com mais tempo de inatividade</CardDescription>
        </CardHeader>
        <CardContent className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">

        </CardContent>
      </Card>
    </div>
  )
}