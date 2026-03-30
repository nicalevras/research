import { createContext, useContext, useState, useCallback } from 'react'
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

  return (
    <AuthModalContext.Provider value={{ modal, openSignIn, openSignUp, openForgotPassword, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  return useContext(AuthModalContext)
}
