import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/use-auth'
import { Spin, Button, Typography } from 'antd'
import { LockOutlined, ArrowLeftOutlined, SafetyOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/login' })
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{ background: 'linear-gradient(135deg, #eef2ff, #ede9fe)' }}>
            <SafetyOutlined className="text-2xl text-indigo-500" />
          </div>
          <Spin size="large" className="block mb-4" />
          <Text className="text-slate-400 text-sm font-medium">Vérification des accès...</Text>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 bg-red-50">
            <LockOutlined className="text-3xl text-red-400" />
          </div>
          <Title level={3} className="!mb-2 !text-slate-800">Accès refusé</Title>
          <Text className="text-slate-500 block mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page. Seuls les administrateurs peuvent y accéder.
          </Text>
          <Button 
            type="primary" 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate({ to: '/' })}
            size="large"
            className="!rounded-xl !h-11 !font-semibold !border-0"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
