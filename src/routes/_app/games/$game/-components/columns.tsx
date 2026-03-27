import type { GamePlayerData } from "@/hooks/useGamePlayerData"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<GamePlayerData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "player.name",
    header: "Nome",
    cell: ({ row }) => {
      const playerName = row.original.player?.name || "Desconecido";
      const isGoalkeeper = row.original.is_goalkeeper;
      const isVisitor = row.original.is_visitor;
      return (
        <div className="flex items-center gap-2">
          {playerName}
          {isGoalkeeper && <Badge variant="destructive">Goleiro</Badge>}
          {isVisitor && <Badge>Visitante</Badge>}
        </div>
      )
    }
  },
  {
    accessorKey: "invited_by.name",
    header: "Convidado por",
    cell: ({ row }) => {
      const invitedBy = row.original.invited_by;
      return invitedBy ? invitedBy.name : "-";
    }
  },
  {
    accessorKey: "acoes",
    header: "Ações",
    cell: () => {
      return (
        <div className="flex gap-2">
          {/* Aqui você pode adicionar botões ou links para ações específicas */}
          <button className="px-2 py-1 text-sm bg-blue-500 text-white rounded">Editar</button>
          <button className="px-2 py-1 text-sm bg-red-500 text-white rounded">Excluir</button>
        </div>
      )
    }
  },
]