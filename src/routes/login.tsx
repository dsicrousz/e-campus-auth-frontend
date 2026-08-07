import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Form, Input, Button, Alert, Typography } from 'antd'
import { MailOutlined, SecurityScanOutlined, ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useAuth } from '@/lib/use-auth'

const { Title, Text } = Typography

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, user } = useAuth()

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError('')
    setIsLoading(true)

    try {
      await signIn(values.email, values.password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="surface-card p-10 max-w-md w-full text-center animate-fade-in-up shadow-sm">
          <div className="mb-5 inline-flex items-center justify-center w-16 h-16 rounded-xl tint-bg-accent">
            <CheckCircleOutlined className="text-3xl text-green-600" />
          </div>
          <Title level={3} className="!mb-2 !text-slate-900" style={{ fontFamily: 'Lexend, sans-serif' }}>
            Déjà connecté
          </Title>
          <Text className="text-slate-600 text-base">
            Vous êtes connecté en tant que <strong className="text-blue-700">{user.email}</strong>
          </Text>
          <div className="mt-6">
            <Link to="/">
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                className="!rounded-lg !h-11 !font-semibold focus-ring"
              >
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
      <div className="flex w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg animate-fade-in-up border border-slate-200">

        {/* Left Panel — Branding, solid institutional blue */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] p-10 text-white relative overflow-hidden primary-bg">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <img src="/logo_noir2.png" alt="E-Campus" className="h-10 w-auto object-contain brightness-0 invert" />
            </div>
            <Text className="!text-white/60 !text-xs !font-medium !uppercase !tracking-widest">
              Plateforme d'authentification
            </Text>
          </div>

          <div className="relative z-10 space-y-6">
            <Title level={2} className="!text-white !mb-0 !leading-tight !text-3xl" style={{ fontFamily: 'Lexend, sans-serif' }}>
              Gérez vos accès<br />en toute sécurité
            </Title>
            <div className="space-y-3">
              {[
                'Authentification centralisée',
                'Gestion des rôles et permissions',
                'Contrôle des sessions actives',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircleOutlined className="text-blue-200" />
                  <Text className="!text-white/80 !text-sm">{item}</Text>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <Text className="!text-white/40 !text-xs">© 2025 E-Campus Auth System</Text>
          </div>
        </div>

        {/* Right Panel — Login Form, clean white */}
        <div className="flex-1 bg-white p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-8">
              <img src="/logo_noir2.png" alt="E-Campus" className="h-14 w-auto object-contain mx-auto" />
            </div>

            <div className="mb-8">
              <Title level={2} className="!mb-2 !text-slate-900 !font-bold" style={{ fontFamily: 'Lexend, sans-serif' }}>
                Bon retour !
              </Title>
              <Text className="text-slate-600 text-base">Connectez-vous pour accéder à votre espace</Text>
            </div>

            {error && (
              <Alert
                message="Erreur de connexion"
                description={error}
                type="error"
                className="!mb-6 !rounded-lg"
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
                  { type: 'email', message: 'Email invalide' },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="!text-slate-400" />}
                  placeholder="votre@email.com"
                  type="email"
                  className="!rounded-lg !h-12 !bg-slate-50 hover:!bg-white focus:!bg-white !transition-colors"
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
                  prefix={<SecurityScanOutlined className="!text-slate-400" />}
                  placeholder="••••••••"
                  type="password"
                  className="!rounded-lg !h-12 !bg-slate-50 hover:!bg-white focus:!bg-white !transition-colors"
                />
              </Form.Item>
              <Form.Item className="!mb-3 !mt-2">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  block
                  size="large"
                  className="!rounded-lg !h-12 !font-bold !text-base !shadow-md hover:!shadow-lg !transition-all focus-ring"
                >
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </Form.Item>
            </Form>

          </div>
        </div>
      </div>
    </div>
  )
}
