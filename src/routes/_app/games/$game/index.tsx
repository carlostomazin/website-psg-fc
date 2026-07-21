import { Header } from '@/components/header'
import { useGameDataById } from '@/hooks/useGameData'
import { useGamePlayerDataByGameId, useGamePlayerUpdatePaymentStatus } from '@/hooks/useGamePlayerData'
import { Link, createFileRoute } from '@tanstack/react-router'
import { SectionHead } from './-components/section-head'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

export const Route = createFileRoute('/_app/games/$game/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { game } = Route.useParams()
  const { data: gameData } = useGameDataById(game)
  const { data: gamePlayerData, isLoading: isGamePlayerDataLoading, isError: isGamePlayerDataError } = useGamePlayerDataByGameId(game)
  const paymentStatusMutation = useGamePlayerUpdatePaymentStatus()
  const [processingPaymentId, setProcessingPaymentId] = React.useState<string | null>(null)
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())

  // normalize game date
  const gameDate = gameData ? new Date(gameData.game_date).toLocaleDateString() : null

  const toggleRowSelection = (playerId: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(playerId)) {
      newSelected.delete(playerId)
    } else {
      newSelected.add(playerId)
    }
    setSelectedRows(newSelected)
  }

  const totalPlayers = gamePlayerData?.length ?? 0

  const toggleAllRows = () => {
    if (selectedRows.size === totalPlayers) {
      setSelectedRows(new Set())
    } else {
      const allIds = gamePlayerData?.map(p => p.id) || []
      setSelectedRows(new Set(allIds))
    }
  }

  const isAllSelected = totalPlayers > 0 && selectedRows.size === totalPlayers

  return (
    <>
      <Header breadcrumbs={[{ label: "Jogos", href: "/games/" }, { label: `Jogo ${gameDate}` }]} />
      <div className="@container/main flex flex-1 flex-col gap-2 px-2 lg:px-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionHead 
            gameDate={gameDate} 
            gameId={game} 
            selectedRows={selectedRows}
            onDeleteComplete={() => setSelectedRows(new Set())}
          />
          <div className="p-4">
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={toggleAllRows}
                      />
                    </TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Convidado por</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isGamePlayerDataLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Carregando dados dos jogadores...
                      </TableCell>
                    </TableRow>
                  ) : isGamePlayerDataError ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Erro ao carregar dados dos jogadores.
                      </TableCell>
                    </TableRow>
                  ) :
                    gamePlayerData && gamePlayerData.length > 0 ? (
                      gamePlayerData.map(playerData => (
                        <TableRow key={playerData.id} className={selectedRows.has(playerData.id) ? 'bg-accent' : ''}>
                          <TableCell className="w-12">
                            <Checkbox
                              checked={selectedRows.has(playerData.id)}
                              onCheckedChange={() => toggleRowSelection(playerData.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Link to={"/players/$player"} params={{ player: playerData.player.id }}>
                              {playerData.player.name}
                              
                            </Link>
                            {playerData.is_goalkeeper && <Badge variant="default" className="ml-2">GK</Badge>}
                          </TableCell>
                          <TableCell>{playerData.invited_by ? playerData.invited_by.name : '-'}</TableCell>
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
                              <span className={playerData.paid ? 'text-green-500' : 'text-red-500'}>
                                {playerData.paid ? 'Pago' : 'Devendo'}
                              </span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
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
