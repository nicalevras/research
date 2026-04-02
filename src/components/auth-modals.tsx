import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useAuthModal } from '~/lib/auth-context'
import { authClient } from '~/lib/auth-client'
import { XIcon } from '~/components/icons'

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-white/[0.06] p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <XIcon className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

function InputField({ label, type, value, onChange, placeholder, autoComplete, maxLength }: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  maxLength?: number
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className="w-full rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10 transition-all"
      />
    </div>
  )
}

function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-200/60 dark:border-white/[0.06] bg-white dark:bg-white/[0.04] px-3.5 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continue with Google
    </button>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-neutral-200 dark:bg-white/[0.06]" />
      <span className="text-xs text-neutral-400 dark:text-neutral-500">or</span>
      <div className="h-px flex-1 bg-neutral-200 dark:bg-white/[0.06]" />
    </div>
  )
}

function ForgotPasswordForm() {
  const { closeModal, openSignIn } = useAuthModal()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Please enter your email'); return }
    setLoading(true)
    try {
      await authClient.forgetPassword({
        email,
        redirectTo: '/reset-password',
      })
    } catch {
      // Silently ignore — don't reveal whether the email exists
    } finally {
      // Always show "check your email" to prevent email enumeration
      setSent(true)
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Check your email</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            If an account exists for {email}, we sent a password reset link.
          </p>
        </div>
        <button
          type="button"
          onClick={openSignIn}
          className="text-sm font-medium text-neutral-900 dark:text-white hover:underline cursor-pointer"
        >
          Back to Sign In
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Reset Password</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Enter your email to receive a reset link</p>
      </div>

      <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-neutral-900 dark:bg-white px-3.5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        <button type="button" onClick={openSignIn} className="font-medium text-neutral-900 dark:text-white hover:underline cursor-pointer">
          Back to Sign In
        </button>
      </p>
    </form>
  )
}

function SignInForm() {
  const { closeModal, openSignUp, openForgotPassword } = useAuthModal()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: authError } = await authClient.signIn.email({
        email,
        password,
      })
      if (authError) {
        setError('Invalid email or password')
      } else {
        closeModal()
        router.invalidate()
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: window.location.pathname,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Sign In</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Welcome back</p>
      </div>

      <GoogleButton onClick={handleGoogle} />
      <Divider />

      <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
      <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="current-password" />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={openForgotPassword}
          className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
        >
          Forgot password?
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-neutral-900 dark:bg-white px-3.5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={openSignUp} className="font-medium text-neutral-900 dark:text-white hover:underline cursor-pointer">
          Sign Up
        </button>
      </p>
    </form>
  )
}

function SignUpForm() {
  const { closeModal, openSignIn } = useAuthModal()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Name is required'); return }
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) { setError('Name can only contain letters, spaces, hyphens, and apostrophes'); return }
    if (name.trim().length > 50) { setError('Name must be 50 characters or fewer'); return }
    if (!email.trim()) { setError('Email is required'); return }
    if (!username.trim()) { setError('Username is required'); return }
    if (username.trim().length < 2) { setError('Username must be at least 2 characters'); return }
    if (username.trim().length > 30) { setError('Username must be 30 characters or fewer'); return }
    if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) { setError('Username can only contain letters, numbers, hyphens, and underscores'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const { error: authError } = await authClient.signUp.email({
        name: name.trim(),
        email,
        password,
        username: username.trim(),
      })
      if (authError) {
        setError(authError.message ?? 'Sign up failed')
      } else {
        closeModal()
        router.invalidate()
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: window.location.pathname,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Sign Up</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Create your account</p>
      </div>

      <GoogleButton onClick={handleGoogle} />
      <Divider />

      <InputField label="Name" type="text" value={name} onChange={setName} placeholder="Your name" autoComplete="name" maxLength={50} />
      <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
      <InputField label="Username" type="text" value={username} onChange={setUsername} placeholder="your-username" autoComplete="username" maxLength={30} />
      <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="new-password" />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-neutral-900 dark:bg-white px-3.5 py-2.5 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>

      <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Already have an account?{' '}
        <button type="button" onClick={openSignIn} className="font-medium text-neutral-900 dark:text-white hover:underline cursor-pointer">
          Sign In
        </button>
      </p>
    </form>
  )
}

export function AuthModals() {
  const { modal, closeModal } = useAuthModal()

  if (!modal) return null

  return (
    <Overlay onClose={closeModal}>
      {modal === 'sign-in' ? <SignInForm /> : modal === 'sign-up' ? <SignUpForm /> : <ForgotPasswordForm />}
    </Overlay>
  )
}
