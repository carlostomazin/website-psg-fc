import type { GamePlayerData } from "@/hooks/useGamePlayerData"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableRowActions } from "./data-table-row-actions";
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
      return <TableCellViewer item={row.original} />
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