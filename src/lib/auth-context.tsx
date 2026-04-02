import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'

type AuthModal = 'sign-in' | 'sign-up' | 'forgot-password' | null

interface AuthModalContextValue {
  modal: AuthModal
  openSignIn: () => void
  openSignUp: () => void
  openForgotPassword: () => void
  closeModal: () => void
}

const AuthModalContext = createContext<AuthModalContextValue>({
  modal: null,
  openSignIn: () => {},
  openSignUp: () => {},
  openForgotPassword: () => {},
  closeModal: () => {},
})

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<AuthModal>(null)

  const openSignIn = useCallback(() => setModal('sign-in'), [])
  const openSignUp = useCallback(() => setModal('sign-up'), [])
  const openForgotPassword = useCallback(() => setModal('forgot-password'), [])
  const closeModal = useCallback(() => setModal(null), [])

  const value = useMemo(() => ({ modal, openSignIn, openSignUp, openForgotPassword, closeModal }), [modal, openSignIn, openSignUp, openForgotPassword, closeModal])

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  return useContext(AuthModalContext)
}
