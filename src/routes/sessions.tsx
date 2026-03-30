/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Typography,
  Table,
  Button,
  message,
  Popconfirm,
  Tag,
  Badge,
  Select,
} from 'antd'
import {
  DesktopOutlined,
  MobileOutlined,
  GlobalOutlined,
  CalendarOutlined,
  SafetyOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { sessionService, type UserSession } from '@/lib/session-service'
import { adminService } from '@/lib/admin-service'
import { ProtectedRoute } from '@/components/ProtectedRoute'

const { Title, Text } = Typography

export const Route = createFileRoute('/sessions')({
  component: () => (
    <ProtectedRoute requireAdmin>
      <SessionManagement />
    </ProtectedRoute>
  ),
})

function SessionManagement() {
  const queryClient = useQueryClient()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // Fetch all users for selection
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users', 1, 50],
    queryFn: () => adminService.getUsers(1, 50),
  })

  // Fetch sessions for selected user
  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions', selectedUserId],
    queryFn: () => selectedUserId ? sessionService.getUserSessions(selectedUserId) : Promise.resolve([]),
    enabled: !!selectedUserId,
  })

  // Revoke session mutation
  const revokeSessionMutation = useMutation({
    mutationFn: (sessionToken: string) => sessionService.revokeSession(sessionToken),
    onSuccess: () => {
      message.success('Session révoquée avec succès')
      queryClient.invalidateQueries({ queryKey: ['sessions', selectedUserId] })
    },
    onError: (error) => {
      message.error(`Erreur: ${error.message}`)
    },
  })

  // Revoke all sessions mutation
  const revokeAllSessionsMutation = useMutation({
    mutationFn: (userId: string) => sessionService.revokeAllUserSessions(userId),
    onSuccess: () => {
      message.success('Toutes les sessions ont été révoquées')
      queryClient.invalidateQueries({ queryKey: ['sessions', selectedUserId] })
    },
    onError: (error) => {
      message.error(`Erreur: ${error.message}`)
    },
  })

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId)
  }

  const handleRevokeSession = (sessionToken: string) => {
    revokeSessionMutation.mutate(sessionToken)
  }

  const handleRevokeAllSessions = (userId: string) => {
    revokeAllSessionsMutation.mutate(userId)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('fr-FR')
  }

  const formatUserAgent = (userAgent?: string | null) => {
    if (!userAgent) return 'Inconnu'
    if (userAgent.includes('Mobile')) return 'Mobile'
    if (userAgent.includes('Tablet')) return 'Tablette'
    return 'Desktop'
  }

  const columns = [
    {
      title: 'ID Session',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <span className="font-mono text-xs bg-slate-50 px-2 py-1 rounded-lg text-slate-600">
          {id.substring(0, 8)}...
        </span>
      ),
    },
    {
      title: 'Appareil',
      dataIndex: 'userAgent',
      key: 'userAgent',
      render: (userAgent?: string | null) => {
        const device = formatUserAgent(userAgent)
        const icon = device === 'Mobile' ? <MobileOutlined /> : <DesktopOutlined />
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
              {icon}
            </div>
            <Text className="font-medium">{device}</Text>
          </div>
        )
      },
    },
    {
      title: 'IP',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      render: (ip?: string | null) => (
        <div className="flex items-center gap-2">
          <GlobalOutlined className="text-slate-400" />
          <Text className="text-slate-600">{ip || 'Inconnue'}</Text>
        </div>
      ),
    },
    {
      title: 'Créée',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-slate-400" />
          <Text className="text-slate-600 text-sm">{formatDate(date)}</Text>
        </div>
      ),
    },
    {
      title: 'Expire',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (date: string) => {
        const isExpired = new Date(date) < new Date()
        return (
          <div className="flex items-center gap-2">
            <Badge status={isExpired ? 'error' : 'success'} />
            <Text className={`text-sm ${isExpired ? 'text-red-500' : 'text-slate-600'}`}>{formatDate(date)}</Text>
          </div>
        )
      },
    },
    {
      title: 'Statut',
      key: 'status',
      render: (_: any, record: UserSession) => {
        const isExpired = new Date(record.expiresAt) < new Date()
        return (
          <Tag 
            color={isExpired ? 'red' : 'green'}
            className="!rounded-lg !font-semibold !px-3"
          >
            {isExpired ? 'Expirée' : 'Active'}
          </Tag>
        )
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UserSession) => (
        <Popconfirm
          title="Êtes-vous sûr de vouloir révoquer cette session ?"
          onConfirm={() => handleRevokeSession(record.token)}
          okText="Oui"
          cancelText="Non"
        >
          <Button 
            type="text" 
            danger 
            icon={<CloseCircleOutlined />}
            className="!rounded-lg hover:!bg-red-50"
          >
            Révoquer
          </Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2} className="!mb-1 gradient-text !font-bold">
            Gestion des Sessions
          </Title>
          <Text className="text-slate-500">
            Visualisez et gérez les sessions actives des utilisateurs
          </Text>
        </div>
      </div>
      
      {/* User Selection */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <Text className="!font-bold !text-sm !text-slate-700 !uppercase !tracking-wide block mb-4">
          Sélectionner un utilisateur
        </Text>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            placeholder="Choisir un utilisateur"
            style={{ width: 320 }}
            size="large"
            onChange={handleUserSelect}
            value={selectedUserId}
            loading={usersLoading}
            className="!rounded-xl"
            showSearch
            optionFilterProp="children"
          >
            {usersData?.users?.map((user) => (
              <Select.Option key={user.id} value={user.id}>
                {user.name || user.email}
              </Select.Option>
            ))}
          </Select>
          {selectedUserId && (
            <Popconfirm
              title="Êtes-vous sûr de vouloir révoquer toutes les sessions de cet utilisateur ?"
              onConfirm={() => handleRevokeAllSessions(selectedUserId)}
              okText="Oui"
              cancelText="Non"
            >
              <Button 
                danger 
                icon={<SafetyOutlined />}
                size="large"
                className="!rounded-xl !font-semibold"
              >
                Révoquer toutes les sessions
              </Button>
            </Popconfirm>
          )}
        </div>
      </div>

      {/* Sessions Table */}
      {selectedUserId && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                <SafetyOutlined className="text-white" />
              </div>
              <div>
                <Text className="!font-bold !text-lg !text-slate-800 block">Sessions actives</Text>
                <Text className="text-slate-400 text-sm">{sessions?.length || 0} session(s) trouvée(s)</Text>
              </div>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={sessions || []}
            loading={sessionsLoading}
            rowKey="id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total: ${total} sessions`
            }}
            scroll={{ x: 800 }}
            locale={{
              emptyText: 'Aucune session active',
            }}
          />
        </div>
      )}

      {/* Empty State */}
      {!selectedUserId && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="text-center py-20 px-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6" style={{ background: 'linear-gradient(135deg, #eef2ff, #ede9fe)' }}>
              <DesktopOutlined className="text-3xl text-indigo-400" />
            </div>
            <Title level={3} className="!mb-2 !text-slate-800">
              Sélectionnez un utilisateur
            </Title>
            <Text className="text-slate-400 text-base max-w-md mx-auto block">
              Choisissez un utilisateur dans la liste ci-dessus pour afficher et gérer ses sessions actives
            </Text>
          </div>
        </div>
      )}
    </div>
  )
}
