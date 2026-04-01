import { createRouter, ErrorComponent } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStaleTime: 5 * 60_000,
    defaultGcTime: 5 * 60_000,
    defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  })
  return router
}
