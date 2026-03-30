import { createFileRoute, Link } from '@tanstack/react-router'
import { Typography, Row, Col, Button, Space, Tag } from 'antd'
import {
  SafetyOutlined,
  UserOutlined,
  LockOutlined,
  TeamOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
  ApiOutlined,
} from '@ant-design/icons'
import { useAuth } from '@/lib/use-auth'

const { Title, Paragraph, Text } = Typography

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { user, isAdmin } = useAuth()

  const features = [
    {
      icon: <SafetyOutlined className="text-2xl" />,
      title: 'Authentification sécurisée',
      description: 'Connexion par email/mot de passe ou via Google OAuth avec Better Auth',
      color: '#4f46e5',
      bgColor: '#eef2ff',
    },
    {
      icon: <TeamOutlined className="text-2xl" />,
      title: 'Gestion des utilisateurs',
      description: 'Interface admin complète pour créer, modifier et gérer les utilisateurs',
      color: '#7c3aed',
      bgColor: '#ede9fe',
    },
    {
      icon: <LockOutlined className="text-2xl" />,
      title: 'Gestion des sessions',
      description: 'Visualisation et révocation des sessions actives pour chaque utilisateur',
      color: '#059669',
      bgColor: '#ecfdf5',
    },
  ]

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)' }}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-2xl bg-white/5 rotate-45" />
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 rounded-full bg-white/5" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Text className="!text-white/80 !text-sm !font-medium">Système opérationnel</Text>
          </div>
          
          <Title level={1} className="!text-white !mb-4 !text-3xl sm:!text-4xl lg:!text-5xl !leading-tight !font-bold">
            Bienvenue sur <br className="hidden sm:block" />
            <span className="text-indigo-200">E-Campus Auth</span>
          </Title>
          <Paragraph className="!text-white/70 !text-base sm:!text-lg !mb-8 max-w-xl !leading-relaxed">
            Système d'authentification centralisé pour gérer les utilisateurs et les sessions de manière sécurisée
          </Paragraph>
          
          {user ? (
            <Space size="middle" wrap>
              <Tag className="!px-4 !py-2 !text-sm !font-semibold !border-0 !rounded-xl !bg-white/15 !text-white !backdrop-blur-sm">
                <CheckCircleOutlined className="mr-1" /> Connecté : {user.name || user.email}
              </Tag>
              {isAdmin && (
                <Tag className="!px-4 !py-2 !text-sm !font-semibold !border-0 !rounded-xl !bg-amber-500/20 !text-amber-200 !backdrop-blur-sm">
                  <ThunderboltOutlined className="mr-1" /> Administrateur
                </Tag>
              )}
            </Space>
          ) : (
            <Link to="/login">
              <Button 
                type="primary" 
                size="large" 
                icon={<RocketOutlined />}
                className="!h-13 !px-8 !rounded-xl !font-bold !text-base !border-0 !bg-white !text-indigo-700 hover:!bg-indigo-50 !shadow-xl hover:!shadow-2xl !transition-all"
              >
                Commencer
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div>
        <div className="text-center mb-8">
          <Text className="!text-indigo-600 !font-bold !text-sm !uppercase !tracking-widest">Fonctionnalités</Text>
          <Title level={2} className="!mt-2 !mb-0 !text-slate-900">
            Tout ce dont vous avez besoin
          </Title>
        </div>
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} md={8} key={index}>
              <div 
                className="h-full p-7 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-lg group cursor-default"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: feature.bgColor, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <Title level={4} className="!mb-2 !text-slate-900 !font-bold">{feature.title}</Title>
                <Paragraph className="!text-slate-500 !mb-0 !leading-relaxed">
                  {feature.description}
                </Paragraph>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Admin Quick Access */}
      {user && isAdmin && (
        <div className="rounded-2xl border border-indigo-100 overflow-hidden" style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #ede9fe 50%, #eef2ff 100%)' }}>
          <div className="p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                  <UserOutlined className="text-white text-lg" />
                </div>
                <div>
                  <Title level={4} className="!mb-1 !text-slate-900">Accès administrateur</Title>
                  <Text className="text-slate-500">Gérez les utilisateurs, rôles et sessions depuis un seul endroit</Text>
                </div>
              </div>
              <Space size="middle" wrap>
                <Link to="/admin">
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<TeamOutlined />}
                    className="!rounded-xl !h-11 !font-semibold !border-0 !shadow-md"
                    style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                  >
                    Utilisateurs <ArrowRightOutlined className="ml-1" />
                  </Button>
                </Link>
                <Link to="/sessions">
                  <Button 
                    size="large"
                    icon={<ApiOutlined />}
                    className="!rounded-xl !h-11 !font-semibold !border-indigo-200 !text-indigo-700 hover:!border-indigo-400 hover:!bg-indigo-50"
                  >
                    Sessions <ArrowRightOutlined className="ml-1" />
                  </Button>
                </Link>
              </Space>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
