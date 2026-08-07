import { createRootRoute, Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Layout, Button, Typography, Avatar, Dropdown, Badge, Menu } from 'antd'
import { useAuth } from '@/lib/use-auth'
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  SafetyOutlined,
  BellOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

const { Header, Sider, Content } = Layout
const { Text } = Typography

function RootLayout() {
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Tableau de bord',
    },
    ...(user && isAdmin ? [
      {
        key: '/admin',
        icon: <UserOutlined />,
        label: 'Utilisateurs',
      },
      {
        key: '/sessions',
        icon: <SafetyOutlined />,
        label: 'Sessions',
      },
    ] : []),
  ]

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined style={{ color: '#dc2626' }} />,
      label: <span className="text-red-600">Déconnexion</span>,
      onClick: signOut,
    },
  ]

  const handleMenuClick = (e: { key: string }) => {
    navigate({ to: e.key })
  }

  return (
    <Layout className="min-h-screen">
      {/* Header — solid, professional */}
      <Header
        className="header-bar px-6 flex items-center justify-between sticky top-0 z-50"
        style={{ height: 64, padding: 0 }}
      >
        <Link to="/" className="flex items-center gap-3 no-underline group focus-ring rounded-lg" aria-label="Accueil E-Campus">
          <img src="/logo_noir2.png" alt="E-Campus" className="h-9 w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-2">
          <Badge count={0} showZero={false}>
            <Button
              type="text"
              icon={<BellOutlined />}
              aria-label="Notifications"
              className="!text-slate-500 hover:!text-blue-700 hover:!bg-blue-50 !rounded-lg !w-10 !h-10 focus-ring"
            />
          </Badge>

          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <Button
                type="text"
                className="flex items-center gap-3 hover:!bg-slate-50 !rounded-lg !px-3 !h-11 !border !border-slate-200 focus-ring"
                aria-label="Menu utilisateur"
              >
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  className="!flex !items-center !justify-center"
                  style={{ background: '#1e40af' }}
                />
                <div className="hidden sm:flex flex-col items-start">
                  <Text className="!font-semibold !text-sm !text-slate-800 !leading-tight">{user.name || user.email}</Text>
                  {user.role && (
                    <Text className="!text-[11px] !text-slate-500 !leading-tight !font-medium">
                      {Array.isArray(user.role) ? user.role.join(', ') : user.role}
                    </Text>
                  )}
                </div>
              </Button>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button
                type="primary"
                size="large"
                className="!rounded-lg !font-semibold !h-10 focus-ring"
              >
                Connexion
              </Button>
            </Link>
          )}
        </div>
      </Header>

      <Layout style={{ background: 'transparent' }}>
        {/* Sidebar — clean, no blur */}
        {user && (
          <Sider
            width={248}
            style={{
              background: '#ffffff',
              position: 'sticky',
              top: 64,
              height: 'calc(100vh - 64px)',
              overflowY: 'auto',
              borderRight: '1px solid #e2e8f0',
            }}
          >
            <div className="px-5 pt-6 pb-3">
              <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'Lexend, sans-serif' }}>
                Navigation
              </Text>
            </div>
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              style={{ background: 'transparent' }}
            />

            {/* Sidebar footer — institutional badge */}
            <div className="absolute bottom-6 left-5 right-5">
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
                <div className="flex items-center gap-3">
                  <img src="/logo_noir2.png" alt="E-Campus" className="h-7 w-auto object-contain" />
                </div>
              </div>
            </div>
          </Sider>
        )}

        {/* Main Content */}
        <Content className="p-4 sm:p-6 lg:p-8 min-h-screen">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </Content>
      </Layout>

      <TanStackRouterDevtools />
    </Layout>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
