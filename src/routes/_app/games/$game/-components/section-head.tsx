import { Button } from '@/components/ui/button'
import { ButtonCreatePlayers } from './button-create-players'


export function SectionHead({ gameDate, gameId }: { gameDate: string | null, gameId: string }) {

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
        <ButtonCreatePlayers gameId={gameId} />
      </div>
    </div>
  )
}
