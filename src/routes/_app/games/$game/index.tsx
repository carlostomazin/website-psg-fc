import { Header } from '@/components/header'
import { useGameDataById } from '@/hooks/useGameData'
import { useGamePlayerDataByGameId, useGamePlayerUpdatePaymentStatus } from '@/hooks/useGamePlayerData'
import { Link, createFileRoute } from '@tanstack/react-router'
import { SectionHead } from './-components/section-head'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_app/games/$game/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { game } = Route.useParams()
  const { data: gameData } = useGameDataById(game)
  const { data: gamePlayerData, isLoading: isGamePlayerDataLoading, isError: isGamePlayerDataError } = useGamePlayerDataByGameId(game)
  const paymentStatusMutation = useGamePlayerUpdatePaymentStatus()
  const [processingPaymentId, setProcessingPaymentId] = React.useState<string | null>(null)

  // normalize game date
  const gameDate = gameData ? new Date(gameData.game_date).toLocaleDateString() : null

  return (
    <>
      <Header breadcrumbs={[{ label: "Jogos", href: "/games/" }, { label: `Jogo ${gameDate}` }]} />
      <div className="@container/main flex flex-1 flex-col gap-2 px-2 lg:px-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionHead gameDate={gameDate} gameId={game} />
          <div className="p-4">
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Convidado por</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isGamePlayerDataLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Carregando dados dos jogadores...
                      </TableCell>
                    </TableRow>
                  ) : isGamePlayerDataError ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Erro ao carregar dados dos jogadores.
                      </TableCell>
                    </TableRow>
                  ) :
                    gamePlayerData && gamePlayerData.length > 0 ? (
                      gamePlayerData.map(playerData => (
                        <TableRow key={playerData.id}>
                          <TableCell>
                            <Link to={"/players/$player"} params={{ player: playerData.player.id }}>
                              {playerData.player.name}
                            </Link>
                          </TableCell>
                          <TableCell>{playerData.invited_by ? playerData.invited_by.name : '-'}</TableCell>
                          <TableCell>
                            {playerData.paid ? 'Pago' : 'Devendo'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={paymentStatusMutation.isPending && processingPaymentId !== gameData?.id}

                              onClick={() => {
                                setProcessingPaymentId(gameData?.id || null)
                                paymentStatusMutation.mutate(
                                  { playerId: playerData.id, paid: !playerData.paid },
                                  {
                                    onSettled: () => setProcessingPaymentId(null),
                                  }
                                )
                              }}
                            >
                              {paymentStatusMutation.isPending && processingPaymentId === gameData?.id ? 'Atualizando...' : playerData.paid ? 'Marcar como devendo' : 'Marcar como pago'}
                            </Button>

                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          Nenhum jogador encontrado.
                        </TableCell>
                      </TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
