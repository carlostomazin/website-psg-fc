import { Header } from '@/components/header'
import { useGameDataById } from '@/hooks/useGameData'
import { useGamePlayerDataByGameId } from '@/hooks/useGamePlayerData'
import { createFileRoute } from '@tanstack/react-router'
import { DataTable } from './-components/data-table'
import { columns } from './-components/columns'
import { SectionHead } from './-components/section-head'

export const Route = createFileRoute('/_app/games/$game/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { game } = Route.useParams()
  const { data: gameData } = useGameDataById(game)
  const { data: gamePlayerData, refetch: refetchGamePlayerData } = useGamePlayerDataByGameId(game)

  // normalize game date
  const gameDate = gameData ? new Date(gameData.game_date).toLocaleDateString() : null

  return (
    <>
      <Header breadcrumbs={[{ label: "Jogos", href: "/games/" }, { label: `Jogo ${gameDate}` }]} />
      <div className="@container/main flex flex-1 flex-col gap-2 px-2 lg:px-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionHead gameDate={gameDate} gameId={game} />
          <DataTable columns={columns} data={gamePlayerData ?? []} onReload={refetchGamePlayerData} />
        </div>
      </div>
    </>
  )
}
