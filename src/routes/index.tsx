import { createFileRoute, Link } from '@tanstack/react-router'
import { Typography, Button, Space, Tag } from 'antd'
import {
  UserOutlined,
  TeamOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  ThunderboltOutlined,
  ApiOutlined,
  SafetyOutlined,
} from '@ant-design/icons'
import { useAuth } from '@/lib/use-auth'

const { Title, Paragraph, Text } = Typography

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { user, isAdmin } = useAuth()

  return (
    <div className="space-y-8">
      {/* Hero Section — institutional, solid, no decorative blobs */}
      <div className="relative overflow-hidden rounded-2xl p-8 sm:p-12 lg:p-16 primary-bg">
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 mb-6">
            <span className="status-dot status-active" />
            <Text className="!text-white/80 !text-sm !font-medium">Système opérationnel</Text>
          </div>

          <Title level={1} className="!text-white !mb-4 !text-3xl sm:!text-4xl lg:!text-5xl !leading-tight !font-bold">
            Bienvenue sur{' '}
            <span className="text-blue-200">E-Campus Auth</span>
          </Title>
          <Paragraph className="!text-white/70 !text-base sm:!text-lg !mb-8 max-w-xl !leading-relaxed">
            Système d'authentification centralisé pour gérer les utilisateurs et les sessions de manière sécurisée
          </Paragraph>

          {user ? (
            <Space size="middle" wrap>
              <Tag className="!px-4 !py-2 !text-sm !font-semibold !border-0 !rounded-lg !bg-white/15 !text-white">
                <CheckCircleOutlined className="mr-1" /> Connecté : {user.name || user.email}
              </Tag>
              {isAdmin && (
                <Tag className="!px-4 !py-2 !text-sm !font-semibold !border-0 !rounded-lg !bg-amber-500/25 !text-amber-100">
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
                className="!h-12 !px-8 !rounded-lg !font-bold !text-base !bg-white !text-blue-800 hover:!bg-blue-50 !shadow-lg hover:!shadow-xl !transition-all !border-0 focus-ring"
              >
                Commencer
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Feature cards — clean, institutional */}
      {!user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <SafetyOutlined />,
              title: 'Sécurisé',
              desc: 'Authentification chiffrée et gestion fine des permissions',
              color: '#1e40af',
              bg: '#eff6ff',
            },
            {
              icon: <UserOutlined />,
              title: 'Centralisé',
              desc: 'Gérez tous vos utilisateurs depuis une interface unique',
              color: '#16a34a',
              bg: '#f0fdf4',
            },
            {
              icon: <ApiOutlined />,
              title: 'Sessions',
              desc: 'Contrôle complet des sessions actives et appareils',
              color: '#d97706',
              bg: '#fffbeb',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="surface-card-hover p-6 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-xl mb-4"
                style={{ backgroundColor: feature.bg, color: feature.color }}
              >
                {feature.icon}
              </div>
              <Title level={4} className="!mb-2 !text-slate-900 !text-lg" style={{ fontFamily: 'Lexend, sans-serif' }}>
                {feature.title}
              </Title>
              <Text className="text-slate-600 text-sm leading-relaxed block">
                {feature.desc}
              </Text>
            </div>
          ))}
        </div>
      )}

      {/* Admin Quick Access */}
      {user && isAdmin && (
        <div className="surface-card overflow-hidden">
          <div className="p-8 sm:p-10 tint-bg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 primary-bg">
                  <UserOutlined className="text-white text-lg" />
                </div>
                <div>
                  <Title level={4} className="!mb-1 !text-slate-900" style={{ fontFamily: 'Lexend, sans-serif' }}>
                    Accès administrateur
                  </Title>
                  <Text className="text-slate-600">Gérez les utilisateurs, rôles et sessions depuis un seul endroit</Text>
                </div>
              </div>
              <Space size="middle" wrap>
                <Link to="/admin">
                  <Button
                    type="primary"
                    size="large"
                    icon={<TeamOutlined />}
                    className="!rounded-lg !h-11 !font-semibold focus-ring"
                  >
                    Utilisateurs <ArrowRightOutlined className="ml-1" />
                  </Button>
                </Link>
                <Link to="/sessions">
                  <Button
                    size="large"
                    icon={<ApiOutlined />}
                    className="!rounded-lg !h-11 !font-semibold !border-blue-200 !text-blue-700 hover:!border-blue-400 hover:!bg-blue-50 focus-ring"
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
