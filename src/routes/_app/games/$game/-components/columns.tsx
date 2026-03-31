import type { GamePlayerData } from "@/hooks/useGamePlayerData"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { TableCellViewer } from "./data-table-cell-viewer";

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
    id: "player.name",
    accessorKey: "player.name",
    header: "Nome",
    cell: ({ row }) => {
      const playerName = row.original.player?.name || "Desconecido";
      const isGoalkeeper = row.original.is_goalkeeper;
      const isVisitor = row.original.is_visitor;
      return (
        <div className="flex items-center gap-2">
          <TableCellViewer item={row.original} />

        </div>
      )
    },
    enableHiding: false,
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
    accessorKey: "paid",
    header: "Pago",
    cell: ({ row }) => {
      // check box
      return (
        <Checkbox
          checked={row.original.paid}
          aria-label="Paid status"
        />
      )
    }
  },
  {
    accessorKey: "acoes",
    header: "Ações",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]