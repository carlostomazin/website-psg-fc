import { useState } from "react"
import type { GamePlayerData } from "@/hooks/useGamePlayerData"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { DataTableRowActions } from "./data-table-row-actions"
import { TableCellViewer } from "./data-table-cell-viewer"
import { useGamePlayerUpdatePaymentStatus } from "@/hooks/useGamePlayerData"
import { Button } from "@/components/ui/button"

function RowActionCell({ row }: { row: Row<GamePlayerData> }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const updatePaymentStatus = useGamePlayerUpdatePaymentStatus()
  const item = row.original

  const isPending = updatePaymentStatus.isPending && isProcessing

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={item.paid || isPending}
        onClick={() => {
          setIsProcessing(true)
          updatePaymentStatus.mutate(
            { playerId: item.id, paid: true },
            {
              onSettled: () => setIsProcessing(false),
            }
          )
        }}
      >
        {isPending ? "Atualizando..." : item.paid ? "Pago" : "Marcar pago"}
      </Button>
      <DataTableRowActions row={row} />
    </div>
  )
}

export const columns: ColumnDef<GamePlayerData>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <div className="flex items-center justify-center">
  //       <Checkbox
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex items-center justify-center">
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     </div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
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
    id: "acoes",
    header: "Ações",
    cell: ({ row }) => <RowActionCell row={row} />,
  },
]