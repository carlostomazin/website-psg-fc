import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_app/games/')({
  component: RouteComponent,
})

function RouteComponent() {
  // Mock data with React Query
  const { data } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return ['Game 1', 'Game 2', 'Game 3']
  },})

  return (
    <>
    <div>Hello "/games/"!</div>
    <div>Games: {data ? data.join(', ') : 'Loading...'}</div>
    </>
  )
}
