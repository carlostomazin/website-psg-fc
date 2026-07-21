import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { useAddPlayersToGame } from "@/hooks/useAddPlayersToGame";

export function ButtonCreatePlayers({ gameId }: { gameId: string }) {
  const [bulkOpen, setBulkOpen] = useState(false);
  const [singleOpen, setSingleOpen] = useState(false);
  const [singlePlayerName, setSinglePlayerName] = useState("");
  const [singleInvitedBy, setSingleInvitedBy] = useState("");
  const [singleIsGoalkeeper, setSingleIsGoalkeeper] = useState(false);
  const [singleIsVisitor, setSingleIsVisitor] = useState(false);
  const addPlayersMutation = useAddPlayersToGame();

  const handleAddPlayers = async () => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    const text = textarea?.value || "";

    if (!text.trim()) {
      return;
    }

    try {
      await addPlayersMutation.mutateAsync({ gameId, text });
      setBulkOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar jogadores", error);
    }
  };

  const handleAddSinglePlayer = async () => {
    if (!singlePlayerName.trim()) {
      return;
    }

    try {
      await addPlayersMutation.mutateAsync({
        gameId,
        singlePlayer: {
          name: singlePlayerName.trim(),
          is_goalkeeper: singleIsGoalkeeper,
          is_visitor: singleInvitedBy.trim() ? true : singleIsVisitor,
          invited_by_name: singleInvitedBy.trim() || null,
        },
      });

      setSingleOpen(false);
      setSinglePlayerName("");
      setSingleInvitedBy("");
      setSingleIsGoalkeeper(false);
      setSingleIsVisitor(false);
    } catch (error) {
      console.error("Erro ao adicionar jogador", error);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={addPlayersMutation.isPending}>
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

      <Dialog open={singleOpen} onOpenChange={setSingleOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={addPlayersMutation.isPending}>
            Adicionar Jogador
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Jogador</DialogTitle>
            <DialogDescription>
              Cadastre um jogador específico neste jogo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="single-player-name">Nome do jogador</Label>
              <Input
                id="single-player-name"
                value={singlePlayerName}
                onChange={(event) => setSinglePlayerName(event.target.value)}
                placeholder="Nome do jogador"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="single-player-invited-by">Convidado por (opcional)</Label>
              <Input
                id="single-player-invited-by"
                value={singleInvitedBy}
                onChange={(event) => setSingleInvitedBy(event.target.value)}
                placeholder="Nome de quem convidou"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="single-player-goalkeeper"
                checked={singleIsGoalkeeper}
                onCheckedChange={(checked) => setSingleIsGoalkeeper(checked === true)}
              />
              <Label htmlFor="single-player-goalkeeper">Goleiro</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="single-player-visitor"
                checked={singleIsVisitor}
                onCheckedChange={(checked) => setSingleIsVisitor(checked === true)}
              />
              <Label htmlFor="single-player-visitor">Visitante</Label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleAddSinglePlayer}
              disabled={addPlayersMutation.isPending || !singlePlayerName.trim()}
            >
              {addPlayersMutation.isPending ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>

          {addPlayersMutation.isError && (
            <p className="text-red-500 text-sm">Erro ao adicionar o jogador. Tente novamente.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}