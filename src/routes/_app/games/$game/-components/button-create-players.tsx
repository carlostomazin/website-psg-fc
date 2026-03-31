import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { parseListaFutebol } from "@/lib/utils";

export function ButtonCreatePlayers() {
  const handleAddPlayers = () => {
    // Lógica para adicionar jogadores (exemplo: abrir um modal ou redirecionar para outra página)
    console.log("Adicionar jogadores");
    // print the list of players from the textarea
    const textarea = document.querySelector("textarea");
    const lista = parseListaFutebol(textarea?.value || "");
    console.log("Lista de jogadores:", lista);

  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          Adicionar Jogadores
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Jogadores</DialogTitle>
          <DialogDescription>
            Insira a lista de jogadores para este jogo.
          </DialogDescription>
        </DialogHeader>
        <InputGroup>
          <InputGroupTextarea
            placeholder="Lista de jogadores"
            rows={6}
            className="min-h-24 resize-none"
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton className="ml-auto" size="sm" variant="default" onClick={handleAddPlayers}>
              Adicionar
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </DialogContent>
    </Dialog>
  )
}