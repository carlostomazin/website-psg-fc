import * as React from "react"
import { Link, createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/header'
import { usePlayerData, usePlayerMutate } from '@/hooks/usePlayerData'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export const Route = createFileRoute('/_app/players/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: playerData, isLoading, isError } = usePlayerData()
  const playerMutate = usePlayerMutate()
  const [name, setName] = React.useState("")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()

    if (!trimmedName) {
      setErrorMessage("Informe o nome do jogador.")
      return
    }

    playerMutate.mutate(
      { name: trimmedName },
      {
        onSuccess: () => {
          setName("")
          setErrorMessage(null)
        },
        onError: (error) => {
          setErrorMessage(
            error instanceof Error ? error.message : "Erro ao salvar jogador."
          )
        },
      }
    )
  }

  return (
    <>
      <Header breadcrumbs={[{ label: "Jogadores" }]} />
      <div className="@container/main flex flex-1 flex-col gap-2 px-2 lg:px-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <section className="rounded-3xl border border-border bg-background p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Adicionar jogador</p>
                <p className="text-sm text-muted-foreground">
                  Crie um jogador novo para usar nos jogos.
                </p>
              </div>
              <form className="flex flex-col gap-2 sm:flex-row sm:items-end" onSubmit={handleSubmit}>
                <div className="min-w-0 flex-1">
                  <label className="sr-only" htmlFor="player-name">
                    Nome do jogador
                  </label>
                  <Input
                    id="player-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nome do jogador"
                  />
                </div>
                <Button type="submit" disabled={playerMutate.isPending}>
                  {playerMutate.isPending ? "Salvando..." : "Adicionar"}
                </Button>
              </form>
            </div>
            {errorMessage ? (
              <p className="mt-3 text-sm text-destructive">{errorMessage}</p>
            ) : null}
            {playerMutate.isError && !errorMessage ? (
              <p className="mt-3 text-sm text-destructive">
                Ocorreu um erro ao adicionar o jogador.
              </p>
            ) : null}
          </section>

          <section className="overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-base font-semibold leading-7 text-foreground">
                Lista de jogadores
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Todos os jogadores cadastrados no banco de dados.
              </p>
            </div>

            <div className="p-4">
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cadastro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">
                          Carregando...
                        </TableCell>
                      </TableRow>
                    ) : isError ? (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">
                          Erro ao carregar jogadores.
                        </TableCell>
                      </TableRow>
                    ) : playerData && playerData.length > 0 ? (
                      playerData.map((player) => (
                        <TableRow key={player.id}>
                          <TableCell>
                            <Link
                              to="/players/$player"
                              params={{ player: player.id }}
                              className="font-medium text-primary hover:underline"
                            >
                              {player.name}
                            </Link>
                          </TableCell>
                          <TableCell>
                            {new Date(player.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="h-24 text-center">
                          Nenhum jogador encontrado.
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
