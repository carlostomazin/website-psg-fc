import { useState } from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGamePlayerUpdatePaymentStatus } from "@/hooks/useGamePlayerData"
import { Switch } from "@/components/ui/switch"

interface TableCellViewerProps {
  item: any
  open?: boolean
  onClose?: () => void
  showTrigger?: boolean
}

export function TableCellViewer({ item, open, onClose, showTrigger = true }: TableCellViewerProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [nome, setNome] = useState(item.player.name)
  const [convidadoPor, setConvidadoPor] = useState(item.invited_by?.name || "-")
  const [confirmado, setConfirmado] = useState(item.paid ? "sim" : "não")
  const isMobile = useIsMobile()

  // Se open for passado como prop, usa o valor externo; senão usa estado interno
  const isOpen = open !== undefined ? open : internalOpen
  const handleOpenChange = (newOpen: boolean) => {
    if (open === undefined) {
      setInternalOpen(newOpen)
    }
    if (!newOpen && onClose) {
      onClose()
    }
  }

  const updatePaymentStatus = useGamePlayerUpdatePaymentStatus()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onOpenChange={handleOpenChange}>
      {showTrigger && (
        <DrawerTrigger asChild>
          <Button variant="link" className="w-fit px-0 text-left text-foreground">
            {item.player.name}
            {item.is_goalkeeper && <Badge variant="destructive">Goleiro</Badge>}
            {item.is_visitor && <Badge>Visitante</Badge>}
          </Button>
        </DrawerTrigger>
      )}
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Detalhes do convidado</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="convidadoPor">Convidado por</Label>
              <Input
                id="convidadoPor"
                value={convidadoPor}
                onChange={(e) => setConvidadoPor(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="confirmado">Pagou</Label>
              <Switch
                id="confirmado"
                checked={confirmado === "sim"}
                onCheckedChange={(value) => setConfirmado(value ? "sim" : "não")}
              />
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button type="submit" onClick={() => {
            const paid = confirmado === "sim"
            updatePaymentStatus.mutate({ playerId: item.id, paid })
            handleOpenChange(false)
          }
          }>
            Salvar
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Fechar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
