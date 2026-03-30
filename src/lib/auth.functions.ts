import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '~/lib/auth'

export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })
  if (!session) return null
  // Only return fields the client needs — strip tokens, IP, user agent
  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      username: (session.user as Record<string, unknown>).username as string | undefined,
    },
    session: {
      id: session.session.id,
      expiresAt: session.session.expiresAt,
    },
  }
})
