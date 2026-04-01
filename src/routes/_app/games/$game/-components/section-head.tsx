import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ButtonCreatePlayers } from './button-create-players'
import { useGamePlayerDataByGameId } from '@/hooks/useGamePlayerData'

export function SectionHead({ gameDate, gameId }: { gameDate: string | null, gameId: string }) {
  const { data: gamePlayerData, isLoading } = useGamePlayerDataByGameId(gameId)

  const debtors = useMemo(() => {
    if (!gamePlayerData) return []
    return gamePlayerData.filter((player) => !player.paid)
  }, [gamePlayerData])

  const copyDebtorsToClipboard = async () => {
    if (!debtors.length) {
      window.alert('Não há jogadores devendo neste jogo.')
      return
    }

    const textToCopy = debtors
      .map((player) => player.player.name)
      .join('\n')

    try {
      await navigator.clipboard.writeText(textToCopy)
      window.alert(`Copiado ${debtors.length} jogador(es) devendo para a área de transferência.`)
    } catch (error) {
      console.error('Erro ao copiar para a área de transferência', error)
      window.alert('Falha ao copiar para a área de transferência. Tente novamente.')
    }
  }

  return (
    <div className="flex flex-col gap-2 px-4 lg:px-6">
      <h1 className="text-2xl font-bold">Jogo {gameDate}</h1>
      <p className="text-sm text-gray-500">Detalhes do jogo e desempenho dos jogadores</p>
      <div>
        <Button variant="outline" size="sm" disabled>
          Editar Jogo
        </Button>
        <Button variant="outline" size="sm" disabled className="ml-2">
          Excluir Jogo
        </Button>
        <Button variant="outline" size="sm" disabled={isLoading || debtors.length === 0} className="ml-2"
          onClick={copyDebtorsToClipboard}
        >
          Copiar devedores ({debtors.length})
        </Button>
        <ButtonCreatePlayers gameId={gameId} />
      </div>
    </div>
  )
}
