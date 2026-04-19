import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/peptides')({
  component: PeptidesLayout,
})

function PeptidesLayout() {
  return <Outlet />
}
