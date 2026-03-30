import { createContext, useEffect, useState } from 'react'
import { authClient, type Session, type User } from './auth-client'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string,password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: sessionData } = await authClient.getSession()
      setSession(sessionData)
      setUser(sessionData?.user || null)
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string,password: string) => {
    const result = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/", // Password will be handled by SSO
    })
    
    if (result.error) {
      throw new Error(result.error.message)
    }
    
    await checkAuth()
  }

  const signUp = async (email: string, password: string, name: string) => {
    const result = await authClient.signUp.email({
      email,
      password,
      name,
    })
    
    if (result.error) {
      throw new Error(result.error.message)
    }
    
    await checkAuth()
  }

  const signOut = async () => {
    await authClient.signOut()
    setUser(null)
    setSession(null)
  }

  const signInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: 'google',
      requestSignUp:false,
      
      callbackURL: "http://localhost:5173",
    })
  }

  const isAdmin = Boolean(user?.role === 'superadmin' || (Array.isArray(user?.role) && user?.role.includes('superadmin')))

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Export AuthContext for useAuth hook in separate file
export { AuthContext }
