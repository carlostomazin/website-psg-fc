import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { useAddPlayersToGame } from "@/hooks/useAddPlayersToGame";
import { useGamePlayerDataByGameId } from "@/hooks/useGamePlayerData";

export function ButtonCreatePlayers({ gameId }: { gameId: string }) {
  const [open, setOpen] = useState(false);
  const addPlayersMutation = useAddPlayersToGame();
  const { data: gamePlayerData } = useGamePlayerDataByGameId(gameId);

  useEffect(() => {
    if (addPlayersMutation.isSuccess) {
      setOpen(false);
    }
  }, [addPlayersMutation.isSuccess]);

  const handleAddPlayers = () => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    const text = textarea?.value || "";
    if (text.trim()) {
      addPlayersMutation.mutate({ gameId, text });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2" disabled={!!(gamePlayerData?.length)}>
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
            <InputGroupButton
              className="ml-auto"
              size="sm"
              variant="default"
              onClick={handleAddPlayers}
              disabled={addPlayersMutation.isPending}
            >
              {addPlayersMutation.isPending ? "Adicionando..." : "Adicionar"}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {addPlayersMutation.isError && (
          <p className="text-red-500 text-sm">Erro ao adicionar jogadores. Tente novamente.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}