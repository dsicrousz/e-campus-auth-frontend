import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Form, Input, Button, Alert, Typography, Divider } from 'antd'
import { MailOutlined, SecurityScanOutlined, GoogleOutlined, ArrowRightOutlined, CheckCircleOutlined, SafetyOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons'
import { useAuth } from '@/lib/use-auth'

const { Title, Text } = Typography

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signInWithGoogle, user } = useAuth()

  const handleSubmit = async (values: { email: string,password: string }) => {
    setError('')
    setIsLoading(true)

    try {
     await signIn(values.email,values.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed')
    }
  }

  if (user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="glass-strong rounded-3xl p-10 max-w-md w-full text-center animate-fade-in-up shadow-xl">
          <div className="mb-5 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-50">
            <CheckCircleOutlined className="text-4xl text-emerald-500" />
          </div>
          <Title level={3} className="!mb-2 !text-slate-800">Déjà connecté</Title>
          <Text className="text-slate-500 text-base">
            Vous êtes connecté en tant que <strong className="text-indigo-600">{user.email}</strong>
          </Text>
          <div className="mt-6">
            <Link to="/">
              <Button type="primary" size="large" icon={<ArrowRightOutlined />} className="!rounded-xl !h-11 !font-semibold" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                Aller au tableau de bord
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
        
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] p-10 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)' }}>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 right-10 w-24 h-24 rounded-2xl bg-white/5 rotate-45" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <SafetyOutlined className="text-white text-lg" />
              </div>
              <Text className="!text-white !font-bold !text-xl">E-Campus</Text>
            </div>
            <Text className="!text-white/60 !text-xs !font-medium !uppercase !tracking-widest">Plateforme d'authentification</Text>
          </div>
          
          <div className="relative z-10 space-y-6">
            <Title level={2} className="!text-white !mb-0 !leading-tight !text-3xl">
              Gérez vos accès<br />en toute sécurité
            </Title>
            <div className="space-y-4">
              {[
                { icon: <LockOutlined />, text: 'Authentification sécurisée multi-facteurs' },
                { icon: <TeamOutlined />, text: 'Gestion des rôles et permissions' },
                { icon: <SafetyOutlined />, text: 'Contrôle des sessions en temps réel' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/80">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <Text className="!text-white/80 !text-sm">{item.text}</Text>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative z-10">
            <Text className="!text-white/40 !text-xs">© 2025 E-Campus Auth System</Text>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 bg-white p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                <SafetyOutlined className="text-white text-xl" />
              </div>
            </div>

            <div className="mb-8">
              <Title level={2} className="!mb-2 !text-slate-900 !font-bold">Bon retour !</Title>
              <Text className="text-slate-500 text-base">Connectez-vous pour accéder à votre espace</Text>
            </div>
            
            {error && (
              <Alert
                message="Erreur de connexion"
                description={error}
                type="error"
                className="!mb-6 !rounded-xl"
                closable
                showIcon
                onClose={() => setError('')}
              />
            )}

            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              className="space-y-1"
            >
              <Form.Item
                name="email"
                label={<span className="font-semibold text-slate-700 text-sm">Adresse email</span>}
                rules={[
                  { required: true, message: 'Veuillez saisir votre email' },
                  { type: 'email', message: 'Email invalide' }
                ]}
              >
                <Input
                  prefix={<MailOutlined className="!text-slate-300" />}
                  placeholder="votre@email.com"
                  type="email"
                  className="!rounded-xl !h-12 !bg-slate-50 hover:!bg-white focus:!bg-white !transition-colors"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label={<span className="font-semibold text-slate-700 text-sm">Mot de passe</span>}
                rules={[
                  { required: true, message: 'Veuillez saisir votre mot de passe' },
                ]}
              >
                <Input.Password
                  prefix={<SecurityScanOutlined className="!text-slate-300" />}
                  placeholder="••••••••"
                  type="password"
                  className="!rounded-xl !h-12 !bg-slate-50 hover:!bg-white focus:!bg-white !transition-colors"
                />
              </Form.Item>
              <Form.Item className="!mb-3 !mt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  block
                  size="large"
                  className="!rounded-xl !h-12 !font-bold !text-base !border-0 !shadow-lg hover:!shadow-xl !transition-all"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                >
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </Form.Item>
            </Form>

            <Divider plain className="!text-slate-300">
              <span className="text-slate-400 text-sm font-medium">ou</span>
            </Divider>

            <Button
              icon={<GoogleOutlined />}
              onClick={handleGoogleSignIn}
              block
              size="large"
              className="!rounded-xl !h-12 !font-semibold !border-slate-200 !text-slate-600 hover:!border-indigo-300 hover:!text-indigo-600 hover:!bg-indigo-50 !transition-all !flex !items-center !justify-center !gap-2"
            >
              Continuer avec Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
