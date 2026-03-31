import { createFileRoute } from '@tanstack/react-router'
import { useGameData } from '@/hooks/useGameData'
import { usePlayerData } from '@/hooks/usePlayerData'
import { useGamesPendingPayments } from '@/hooks/useGamePlayerData'
import { SectionCardsHead } from './-components/section-cards-head'
import { SectionCardsMid } from './-components/section-cards-mid'
import { Header } from '@/components/header'

export const Route = createFileRoute('/_app/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: gameData } = useGameData()
  const { data: playerData } = usePlayerData()
  const { data: gamesPendingPaymentsData } = useGamesPendingPayments()

  return (
    <>
      <Header breadcrumbs={[{ label: "Dashboard" }]} />
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCardsHead games={gameData} players={playerData} />
        <SectionCardsMid gamesPendingPayments={gamesPendingPaymentsData} />
      </div>
    </div>
    </>
  )
}
