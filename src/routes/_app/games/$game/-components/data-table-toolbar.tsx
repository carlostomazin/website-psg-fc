import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, RefreshCw } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onReload?: () => void
}

export function DataTableToolbar<TData>({
  table,
  onReload,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between px-4 lg:px-6 gap-2">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Filtrar nomes..."
          value={(table.getColumn("player.name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("player.name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}

        {onReload && (
          <Button variant="outline" size="sm" onClick={onReload}>
            <RefreshCw />
          </Button>
        )}
      </div>
    </div>
  )
}