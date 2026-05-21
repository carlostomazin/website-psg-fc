import * as React from "react"
import { Link, createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/header'
import { usePlayerDataById } from '@/hooks/usePlayerData'
import { useGamePlayerDataByPlayerId, useGamePlayerUpdatePaymentStatus } from '@/hooks/useGamePlayerData'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const Route = createFileRoute('/_app/players/$player/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { player } = Route.useParams()
  const playerId = player

  const { data: playerData, isLoading: isPlayerLoading, isError: isPlayerError } = usePlayerDataById(playerId)
  const { data: playerGames, isLoading: isGamesLoading, isError: isGamesError } = useGamePlayerDataByPlayerId(playerId)
  const paymentStatusMutation = useGamePlayerUpdatePaymentStatus()
  const [processingPaymentId, setProcessingPaymentId] = React.useState<string | null>(null)

  const games = playerGames ?? []
  const owedGames = games.filter((game) => !game.paid)

  return (
    <>
      <Header breadcrumbs={[{ label: "Jogadores", href: "/players/" }, { label: "Detalhes" }]} />
      <div className="@container/main flex flex-1 flex-col gap-2 px-2 lg:px-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Informações do jogador</h1>
              <p className="text-sm text-muted-foreground">Visualize o perfil do jogador e os jogos pendentes.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild size="sm">
                <Link to="/players">Voltar</Link>
              </Button>
            </div>
          </div>

          <section className="grid gap-4 lg:grid-cols-[1.5fr,1fr]">
            <div className="rounded-3xl border border-border bg-background p-4 shadow-sm sm:p-6">
              <div className="flex flex-col gap-3">
                {isPlayerLoading ? (
                  <p>Carregando dados do jogador...</p>
                ) : isPlayerError ? (
                  <p className="text-destructive">Erro ao carregar dados do jogador.</p>
                ) : playerData ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Nome</p>
                      <p className="text-lg font-semibold text-foreground">{playerData.name}</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">ID</p>
                        <p className="text-sm text-foreground break-all">{playerData.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Cadastro</p>
                        <p className="text-sm text-foreground">{new Date(playerData.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>Jogador não encontrado.</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-background p-4 shadow-sm sm:p-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Total de jogos</p>
                    <p className="text-lg font-semibold text-foreground">{games.length}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-background p-4 shadow-sm sm:p-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Jogos devendo</p>
                    <p className="text-lg font-semibold text-foreground">{owedGames.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* <section className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-foreground">Jogos em aberto</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Veja apenas os jogos que este jogador ainda não pagou.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">Total em aberto: {owedGames.length}</p>
              </div>
            </div>

            <div className="p-4">
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Jogo</TableHead>
                      <TableHead>Pago</TableHead>
                      <TableHead>Convidado por</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isGamesLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          Carregando jogos...
                        </TableCell>
                      </TableRow>
                    ) : isGamesError ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-destructive">
                          Erro ao carregar jogos.
                        </TableCell>
                      </TableRow>
                    ) : owedGames.length > 0 ? (
                      owedGames.map((game) => (
                        <TableRow key={game.id}>
                          <TableCell>
                            <Link to="/games/$game" params={{ game: game.game_id }} className="font-medium text-primary hover:underline">
                              {new Date(game.game.game_date).toLocaleDateString('pt-BR')}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {game.amount_paid != null ? `R$ ${game.amount_paid.toFixed(2)}` : '-'}
                          </TableCell>
                          <TableCell>{game.invited_by?.name ?? '-'}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={paymentStatusMutation.isPending && processingPaymentId !== game.id}
                              onClick={() => {
                                setProcessingPaymentId(game.id)
                                paymentStatusMutation.mutate(
                                  { playerId: game.id, paid: true },
                                  {
                                    onSettled: () => setProcessingPaymentId(null),
                                  }
                                )
                              }}
                            >
                              {paymentStatusMutation.isPending && processingPaymentId === game.id ? 'Atualizando...' : 'Marcar pago'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          Não há jogos em aberto para este jogador.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </section> */}

          <section className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-foreground">Jogos do jogador</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Lista de todos os jogos em que o jogador participou.
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">Total de jogos: {games.length}</p>
              </div>
            </div>

            <div className="p-4">
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Jogo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Convidado por</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isGamesLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          Carregando jogos...
                        </TableCell>
                      </TableRow>
                    ) : isGamesError ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-destructive">
                          Erro ao carregar jogos.
                        </TableCell>
                      </TableRow>
                    ) : games.length > 0 ? (
                      games.map((game) => (
                        <TableRow key={game.id}>
                          <TableCell>
                            <Link to="/games/$game" params={{ game: game.game_id }} className="font-medium text-primary hover:underline">
                              {new Date(game.game.game_date).toLocaleDateString('pt-BR')}
                            </Link>
                          </TableCell>
                          <TableCell>{game.invited_by?.name ?? '-'}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={paymentStatusMutation.isPending && processingPaymentId !== game?.id}

                              onClick={() => {
                                setProcessingPaymentId(game?.id || null)
                                paymentStatusMutation.mutate(
                                  { playerId: game.id, paid: !game.paid },
                                  {
                                    onSettled: () => setProcessingPaymentId(null),
                                  }
                                )
                              }}
                            >
                              <span className={game.paid ? 'text-green-500' : 'text-red-500'}>
                                {game.paid ? 'Pago' : 'Devendo'}
                              </span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          Este jogador não possui jogos cadastrados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
