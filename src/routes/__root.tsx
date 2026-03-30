import { createRootRoute, Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Layout, Button, Typography, Avatar, Dropdown, Badge, Menu } from 'antd'
import { useAuth } from '@/lib/use-auth'
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  SafetyOutlined,
  SettingOutlined,
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
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profil',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Paramètres',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined style={{ color: '#ef4444' }} />,
      label: <span className="text-red-500">Déconnexion</span>,
      onClick: signOut,
    },
  ]

  const handleMenuClick = (e: { key: string }) => {
    navigate({ to: e.key })
  }

  return (
    <Layout className="min-h-screen">
      {/* Header */}
      <Header 
        className="glass-strong px-6 flex items-center justify-between sticky top-0 z-50"
        style={{ background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(226,232,240,0.6)' }}
      >
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <SafetyOutlined className="text-white text-lg" />
          </div>
          <div className="hidden sm:flex flex-col">
            <Text className="font-bold text-base leading-tight gradient-text">E-Campus</Text>
            <Text className="text-[10px] text-slate-400 leading-tight font-medium tracking-wider uppercase">Auth System</Text>
          </div>
        </Link>
        
        <div className="flex items-center gap-2">
          <Badge count={0} showZero={false}>
            <Button 
              type="text" 
              icon={<BellOutlined />} 
              className="!text-slate-500 hover:!text-indigo-600 hover:!bg-indigo-50 !rounded-xl !w-10 !h-10" 
            />
          </Badge>
          
          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <Button 
                type="text" 
                className="flex items-center gap-3 hover:!bg-indigo-50 !rounded-xl !px-3 !h-11 !border !border-slate-100"
              >
                <Avatar 
                  size={32} 
                  icon={<UserOutlined />} 
                  className="gradient-bg !flex !items-center !justify-center"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                />
                <div className="hidden sm:flex flex-col items-start">
                  <Text className="!font-semibold !text-sm !text-slate-800 !leading-tight">{user.name || user.email}</Text>
                  {user.role && (
                    <Text className="!text-[11px] !text-slate-400 !leading-tight !font-medium">
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
                className="!rounded-xl gradient-bg !border-0 !font-semibold !shadow-md hover:!shadow-lg !transition-all"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
              >
                Connexion
              </Button>
            </Link>
          )}
        </div>
      </Header>

      <Layout style={{ background: 'transparent' }}>
        {/* Sidebar */}
        {user && (
          <Sider 
            width={250} 
            style={{ 
              background: 'rgba(255,255,255,0.6)', 
              backdropFilter: 'blur(20px)',
              position: 'sticky', 
              top: 64, 
              height: 'calc(100vh - 64px)', 
              overflowY: 'auto',
              borderRight: '1px solid rgba(226,232,240,0.4)',
            }}
          >
            <div className="px-5 pt-6 pb-3">
              <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Navigation</Text>
            </div>
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              style={{ background: 'transparent' }}
            />
            
            {/* Sidebar decoration */}
            <div className="absolute bottom-6 left-5 right-5">
              <div className="rounded-2xl gradient-bg-soft p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                    <SafetyOutlined className="text-white text-xs" />
                  </div>
                  <div>
                    <Text className="!text-xs !font-bold !text-indigo-900 block">E-Campus Auth</Text>
                    <Text className="!text-[10px] !text-indigo-500">v1.0.0</Text>
                  </div>
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
