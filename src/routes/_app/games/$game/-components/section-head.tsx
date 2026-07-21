import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ButtonCreatePlayers } from './button-create-players'
import { useGamePlayerDataByGameId, useDeleteGamePlayer } from '@/hooks/useGamePlayerData'
import { useDeleteGame } from '@/hooks/useGameData'
import { useNavigate } from '@tanstack/react-router'
import { Trash2 } from "lucide-react"
import { generateTeams } from '@/lib/utils'

export function SectionHead({ gameDate, gameId, selectedRows, onDeleteComplete }: { gameDate: string | null, gameId: string, selectedRows: Set<string>, onDeleteComplete?: () => void }) {
  const navigate = useNavigate()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isGeneratingTeams, setIsGeneratingTeams] = useState(false)
  const { data: gamePlayerData, isLoading } = useGamePlayerDataByGameId(gameId)
  const deleteGameMutation = useDeleteGame()
  const deleteGamePlayerMutation = useDeleteGamePlayer()

  const debtors = useMemo(() => {
    if (!gamePlayerData) return []
    return gamePlayerData.filter((player) => !player.paid)
  }, [gamePlayerData])

  const handleDeleteSelectedPlayers = async () => {
    if (selectedRows.size === 0) return

    const playerIds = Array.from(selectedRows)
    const selectedCount = playerIds.length

    if (!window.confirm(`Tem certeza que deseja excluir ${selectedCount} jogador(es) selecionado(s)? Essa ação não pode ser desfeita.`)) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteGamePlayerMutation.mutateAsync(playerIds)
      window.alert(`${selectedCount} jogador(es) excluído(s) com sucesso.`)
      onDeleteComplete?.()
    } catch (error) {
      console.error('Erro ao excluir jogador(es)', error)
      window.alert('Falha ao excluir o(s) jogador(es). Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  const copyDebtorsToClipboard = async () => {
    if (!debtors.length) {
      window.alert('Não há jogadores devendo neste jogo.')
      return
    }

    const textToCopy = `Data do jogo: ${gameDate || 'N/A'}\n\n${debtors.map((player) => player.invited_by?.name ? `- ${player.player.name} (${player.invited_by.name})` : `- ${player.player.name}`).join('\n')}`

    try {
      await navigator.clipboard.writeText(textToCopy)
      window.alert(`Copiado ${debtors.length} jogador(es) devendo para a área de transferência.`)
    } catch (error) {
      console.error('Erro ao copiar para a área de transferência', error)
      window.alert('Falha ao copiar para a área de transferência. Tente novamente.')
    }
  }

  const handleGenerateTeams = async () => {
    if (!gamePlayerData?.length) {
      window.alert('Não há jogadores suficientes para montar os times.')
      return
    }

    setIsGeneratingTeams(true)

    try {
      const generatedTeams = generateTeams(gamePlayerData.map((player) => ({
        name: player.player.name,
        is_goalkeeper: player.is_goalkeeper,
      })))

      const teamSummary = generatedTeams.teams
        .map((team) => `${team.name}\n${team.players.length > 0 ? team.players.map((player) => player.name).join('\n') : 'Sem jogadores'}`)
        .join('\n\n')

      await navigator.clipboard.writeText(teamSummary)
      window.alert(`Times montados e copiados para a área de transferência.\n\n${teamSummary}`)
    } catch (error) {
      console.error('Erro ao montar os times', error)
      window.alert('Falha ao montar os times. Tente novamente.')
    } finally {
      setIsGeneratingTeams(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 px-4 lg:px-6">
      <h1 className="text-2xl font-bold">Jogo {gameDate}</h1>
      <p className="text-sm text-gray-500">Detalhes do jogo e desempenho dos jogadores</p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="destructive"
          size="sm"
          disabled={isDeleting}
          onClick={async () => {
            if (!window.confirm('Tem certeza que deseja excluir este jogo? Essa ação não pode ser desfeita.')) {
              return
            }

            setIsDeleting(true)

            try {
              await deleteGameMutation.mutateAsync(gameId)
              window.alert('Jogo excluído com sucesso.')
              navigate({ to: '/games' })
            } catch (error) {
              console.error('Erro ao excluir jogo', error)
              window.alert('Falha ao excluir o jogo. Tente novamente.')
            } finally {
              setIsDeleting(false)
            }
          }}
        >
          <Trash2 className="inline-block" />
          Excluir Jogo
        </Button>

        <Button
          variant="destructive"
          size="sm"
          disabled={selectedRows.size === 0 || isDeleting}
          onClick={handleDeleteSelectedPlayers}
        >
          <Trash2 className="inline-block" />
          Excluir Jogador ({selectedRows.size})
        </Button>

        <Button variant="outline" size="sm" disabled={isLoading || debtors.length === 0}
          onClick={copyDebtorsToClipboard}
        >
          Copiar devedores ({debtors.length})
        </Button>

        <ButtonCreatePlayers gameId={gameId} />

        <Button variant="outline" size="sm" disabled={isLoading || isGeneratingTeams} onClick={handleGenerateTeams}>
          {isGeneratingTeams ? 'Montando times...' : 'Gerar times'}
        </Button>
      </div>
    </div>
  )
}