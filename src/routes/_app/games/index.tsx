import { Header } from '@/components/header'
import { useGameData } from '@/hooks/useGameData'
import { createFileRoute } from '@tanstack/react-router'
import { SectionHead } from './-components/section-head'
import { SectionCards } from './-components/section-cards'

export const Route = createFileRoute('/_app/games/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: gameData } = useGameData()
  return (
    <>
      <Header name_page="Jogos" />
      <div className="@container/main flex flex-1 flex-col gap-2 px-2 lg:px-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionHead />
          <SectionCards games={gameData} />
        </div>
      </div>
    </>
  )
}
