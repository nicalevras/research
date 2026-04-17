import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'

type AuthModal = 'sign-in' | 'sign-up' | 'forgot-password' | null
type AuthModalOptions = { message?: string }

interface AuthModalContextValue {
  modal: AuthModal
  message: string | null
  openSignIn: (options?: AuthModalOptions) => void
  openSignUp: (options?: AuthModalOptions) => void
  openForgotPassword: (options?: AuthModalOptions) => void
  closeModal: () => void
}

const AuthModalContext = createContext<AuthModalContextValue>({
  modal: null,
  message: null,
  openSignIn: () => {},
  openSignUp: () => {},
  openForgotPassword: () => {},
  closeModal: () => {},
})

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<AuthModal>(null)
  const [message, setMessage] = useState<string | null>(null)

  const openSignIn = useCallback((options?: AuthModalOptions) => {
    setMessage(options?.message ?? null)
    setModal('sign-in')
  }, [])
  const openSignUp = useCallback((options?: AuthModalOptions) => {
    setMessage(options?.message ?? null)
    setModal('sign-up')
  }, [])
  const openForgotPassword = useCallback((options?: AuthModalOptions) => {
    setMessage(options?.message ?? null)
    setModal('forgot-password')
  }, [])
  const closeModal = useCallback(() => {
    setModal(null)
    setMessage(null)
  }, [])

  const value = useMemo(() => ({ modal, message, openSignIn, openSignUp, openForgotPassword, closeModal }), [modal, message, openSignIn, openSignUp, openForgotPassword, closeModal])

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  return useContext(AuthModalContext)
}
