import { Header } from '@/components/header'
import { useGameData, useGameMutate } from '@/hooks/useGameData'
import { createFileRoute } from '@tanstack/react-router'
import { SectionCards } from './-components/section-cards'
import { ButtonCreateGame } from './-components/button-create-game'

export const Route = createFileRoute('/_app/games/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: gameData } = useGameData()
  const { mutate: createGame } = useGameMutate()

  return (
    <>
      <Header breadcrumbs={[{ label: "Jogos" }]} />
      <div className="@container/main flex flex-1 flex-col gap-2 px-2 lg:px-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <ButtonCreateGame onCreate={createGame} />
          <SectionCards games={gameData} />
        </div>
      </div>
    </>
  )
}
