import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
  game_date: z.string().nonempty("A data do jogo é obrigatória."),
  game_price: z.number(),
  game_price_per_player: z.number(),
  game_goalkeepers_pay: z.boolean(),
})

export function ButtonCreateGame({ onCreate }: { onCreate: (data: any) => void }) {
  const [open, setOpen] = React.useState(false);

  const form = useForm({
    defaultValues: {
      game_date: "",
      game_price: 0,
      game_price_per_player: 12,
      game_goalkeepers_pay: false,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: (values) => {
      console.log(values);
      onCreate({
        game_date: values.value.game_date,
        game_price: values.value.game_price,
        price_per_player: values.value.game_price_per_player,
        goalkeepers_pay: values.value.game_goalkeepers_pay,
      });
      // close the dialog after submission
      <DialogClose>
      </DialogClose>
    }
  })

  return (
    <div className="flex items-center justify-between">
      <Dialog open={open} onOpenChange={setOpen}>

        <form
          id="create-game-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
            setOpen(false)
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline">Criar Jogo</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">

            <DialogHeader>
              <DialogTitle>Criar Jogo</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do novo jogo.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <form.Field
                name="game_date"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Data do Jogo</FieldLabel >
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="date"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="game_price"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Preço do Jogo</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        type="number"
                        step="0.01"
                        min="0"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <form.Field
                name="game_price_per_player"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Preço por Jogador</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                        type="number"
                        step="0.01"
                        min="0"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              <form.Field
                name="game_goalkeepers_pay"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field orientation="horizontal" data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Goleiro paga?</FieldLabel>
                      <Switch
                        id={field.name}
                        checked={field.state.value}
                        onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                      />
                    </Field>

                  )
                }}
              />
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" form="create-game-form">Criar Jogo</Button>
            </DialogFooter>

          </DialogContent>
        </form>
      </Dialog>
    </div>
  )
}