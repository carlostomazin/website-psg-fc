import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/games/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/games/"!</div>
}
