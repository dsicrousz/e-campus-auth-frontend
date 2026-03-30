import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Typography,
  Statistic,
  Row,
  Col,
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
} from 'antd'
import type { TablePaginationConfig } from 'antd/es/table'
import {
  UserOutlined,
  LockOutlined,
  TeamOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UnlockOutlined,
  BlockOutlined,
} from '@ant-design/icons'
import { adminService, type User, type CreateUserData, type UpdateUserData } from '@/lib/admin-service'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { UserRole, permissionMatrix, type RoleName } from '@/lib/access-control'
import { RolePermissionsTooltip } from '@/components/RolePermissionsTooltip'

const { Title, Text } = Typography
const { Option } = Select

export const Route = createFileRoute('/admin')({
  component: () => (
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  ),
})

function AdminDashboard() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form] = Form.useForm()
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  // Fetch user statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => adminService.getUserStats(),
  })

  // Fetch users with pagination
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users', pagination.current, pagination.pageSize],
    queryFn: () => adminService.getUsers(pagination.current, pagination.pageSize),
  })

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserData) => adminService.createUser(data),
    onSuccess: () => {
      message.success('Utilisateur créé avec succès')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['userStats'] })
      setIsModalOpen(false)
      form.resetFields()
    },
    onError: (error) => {
      message.error(`Erreur: ${error.message}`)
    },
  })

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      adminService.updateUser(id, data),
    onSuccess: () => {
      message.success('Utilisateur mis à jour avec succès')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      message.error(`Erreur: ${error.message}`)
    },
  })

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteUser(id),
    onSuccess: () => {
      message.success('Utilisateur supprimé avec succès')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['userStats'] })
    },
    onError: (error) => {
      message.error(`Erreur: ${error.message}`)
    },
  })

  // Ban/unban user mutation
  const banUserMutation = useMutation({
    mutationFn: ({ id, ban }: { id: string; ban: boolean }) =>
      ban ? adminService.banUser(id) : adminService.unbanUser(id),
    onSuccess: () => {
      message.success('Statut utilisateur mis à jour')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['userStats'] })
    },
    onError: (error) => {
      message.error(`Erreur: ${error.message}`)
    },
  })

  useEffect(() => {
    if (usersData) {
      setPagination(prev => ({ ...prev, total: usersData.total }))
    }
  }, [usersData])

  const showModal = (user?: User) => {
    setEditingUser(user || null)
    if (user) {
      // Normaliser le rôle en tableau
      const normalizedRole = user.role || ['user']
      form.setFieldsValue({
        email: user.email,
        name: user.name,
        role: normalizedRole,
      })
    } else {
      form.resetFields()
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (values: { email: string; password?: string; name: string; role: RoleName[] }) => {
    if (editingUser) {
      await updateUserMutation.mutateAsync({
        id: editingUser.id,
        data: {
          name: values.name,
          role: values.role,
        },
      })
    } else {
      await createUserMutation.mutateAsync({
        email: values.email,
        password: values.password!,
        name: values.name,
        role: values.role,
      })
    }
  }

  const handleDelete = async (id: string) => {
    await deleteUserMutation.mutateAsync(id)
  }

  const handleBanToggle = async (id: string, banned: boolean) => {
    await banUserMutation.mutateAsync({ id, ban: !banned })
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
      total: pagination.total || 0,
    })
  }

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: User) => name || record.email,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rôle(s)',
      dataIndex: 'role',
      key: 'role',
      render: (role: string[]) => {
        const colors: Record<number, string> = {
          1: 'default',
          2: 'blue',
          3: 'purple',
          4: 'orange',
          5: 'red',
        }
        
        // Le rôle est toujours un tableau
        const roles = role || ['user']
        
        return (
          <Space size={[0, 4]} wrap>
            {roles.map((r) => {
              const roleName = r as RoleName
              const roleInfo = permissionMatrix[roleName]
              return (
                <span key={roleName} className="inline-flex items-center">
                  <Tag color={colors[roleInfo?.level || 1]}>
                    {roleName.toUpperCase()}
                  </Tag>
                  <RolePermissionsTooltip role={roleName} />
                </span>
              )
            })}
          </Space>
        )
      },
    },
    {
      title: 'Statut',
      dataIndex: 'banned',
      key: 'banned',
      render: (banned: boolean) => (
        <Tag color={banned ? 'red' : 'green'}>
          {banned ? 'Banni' : 'Actif'}
        </Tag>
      ),
    },
    {
      title: 'Date de création',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: User) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Modifier
          </Button>
          <Button
            type="link"
            icon={record.banned ? <UnlockOutlined /> : <BlockOutlined />}
            danger={!record.banned}
            onClick={() => handleBanToggle(record.id, record.banned || false)}
          >
            {record.banned ? 'Débannir' : 'Bannir'}
          </Button>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Title level={2} className="!mb-1 gradient-text !font-bold">
              Gestion des utilisateurs
            </Title>
            <Text className="text-slate-500">
              Gérez les utilisateurs, leurs rôles et leurs permissions
            </Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            size="large"
            className="!rounded-xl !font-semibold !border-0 !shadow-md !h-11"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
          >
            Ajouter un utilisateur
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        {[
          { title: 'Total Utilisateurs', value: stats?.totalUsers || 0, icon: <TeamOutlined />, color: '#4f46e5', bg: '#eef2ff' },
          { title: 'Utilisateurs Actifs', value: stats?.activeUsers || 0, icon: <UserOutlined />, color: '#059669', bg: '#ecfdf5' },
          { title: 'Administrateurs', value: stats?.adminUsers || 0, icon: <LockOutlined />, color: '#7c3aed', bg: '#ede9fe' },
          { title: 'Utilisateurs Bannis', value: stats?.bannedUsers || 0, icon: <BlockOutlined />, color: '#dc2626', bg: '#fef2f2' },
        ].map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all duration-300 hover:border-slate-200">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: stat.bg, color: stat.color }}
                >
                  {stat.icon}
                </div>
                <Statistic
                  title={<span className="text-slate-500 font-semibold text-xs uppercase tracking-wide">{stat.title}</span>}
                  value={stat.value}
                  valueStyle={{ color: stat.color, fontWeight: 700, fontSize: '24px' }}
                  loading={statsLoading}
                />
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <Text className="!font-bold !text-lg !text-slate-800">Liste des utilisateurs</Text>
            <Text className="block text-slate-400 text-sm mt-0.5">
              {pagination.total} utilisateur{pagination.total > 1 ? 's' : ''} au total
            </Text>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={usersData?.users || []}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} sur ${total} utilisateurs`,
          }}
          loading={usersLoading}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
          rowKey="id"
          className="[&_.ant-table]:!rounded-none"
        />
      </div>

      {/* Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
              {editingUser ? <EditOutlined className="text-white" /> : <PlusOutlined className="text-white" />}
            </div>
            <div>
              <div className="font-bold text-slate-800">{editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</div>
              <div className="text-xs text-slate-400 font-normal">{editingUser ? 'Mettre à jour les informations' : 'Remplissez les informations ci-dessous'}</div>
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={520}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            name="email"
            label={<span className="font-semibold text-slate-700">Email</span>}
            rules={[
              { required: true, message: "L'email est requis" },
              { type: 'email', message: 'Email invalide' },
            ]}
          >
            <Input placeholder="email@example.com" className="!rounded-xl !h-11" />
          </Form.Item>

          <Form.Item
            name="name"
            label={<span className="font-semibold text-slate-700">Nom</span>}
            rules={[{ required: true, message: 'Le nom est requis' }]}
          >
            <Input placeholder="Nom complet" className="!rounded-xl !h-11" />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label={<span className="font-semibold text-slate-700">Mot de passe</span>}
              rules={[
                { required: true, message: 'Le mot de passe est requis' },
                { min: 6, message: 'Minimum 6 caractères' },
              ]}
            >
              <Input.Password placeholder="Mot de passe" className="!rounded-xl !h-11" />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label={<span className="font-semibold text-slate-700">Rôle(s)</span>}
            rules={[{ required: true, message: 'Au moins un rôle est requis' }]}
            tooltip="Vous pouvez sélectionner plusieurs rôles pour cet utilisateur"
          >
            <Select 
              mode="multiple"
              placeholder="Sélectionner un ou plusieurs rôles"
              showSearch
              optionFilterProp="children"
              maxTagCount="responsive"
              allowClear
              className="!rounded-xl"
            >
              <Option value={UserRole.USER}>
                <div className="flex items-center justify-between">
                  <span>Utilisateur</span>
                  <Tag color="default" className="ml-2">Niveau 1</Tag>
                </div>
              </Option>
              <Option value={UserRole.VENDEUR}>
                <div className="flex items-center justify-between">
                  <span>Vendeur</span>
                  <Tag color="blue" className="ml-2">Niveau 2</Tag>
                </div>
              </Option>
              <Option value={UserRole.CAISSIER}>
                <div className="flex items-center justify-between">
                  <span>Caissier</span>
                  <Tag color="blue" className="ml-2">Niveau 2</Tag>
                </div>
              </Option>
              <Option value={UserRole.RECOUVREUR}>
                <div className="flex items-center justify-between">
                  <span>Recouvreur</span>
                  <Tag color="blue" className="ml-2">Niveau 2</Tag>
                </div>
              </Option>
              <Option value={UserRole.REPREUNEUR}>
                <div className="flex items-center justify-between">
                  <span>Repreuneur</span>
                  <Tag color="blue" className="ml-2">Niveau 2</Tag>
                </div>
              </Option>
              <Option value={UserRole.ACP}>
                <div className="flex items-center justify-between">
                  <span>Agent Commercial Principal</span>
                  <Tag color="purple" className="ml-2">Niveau 3</Tag>
                </div>
              </Option>
              <Option value={UserRole.CONTROLEUR}>
                <div className="flex items-center justify-between">
                  <span>Contrôleur</span>
                  <Tag color="purple" className="ml-2">Niveau 3</Tag>
                </div>
              </Option>
              <Option value={UserRole.CHEF_RESTAURANT}>
                <div className="flex items-center justify-between">
                  <span>Chef Restaurant</span>
                  <Tag color="purple" className="ml-2">Niveau 3</Tag>
                </div>
              </Option>
              <Option value={UserRole.CHEF_CODIFICATION}>
                <div className="flex items-center justify-between">
                  <span>Chef Codification</span>
                  <Tag color="purple" className="ml-2">Niveau 3</Tag>
                </div>
              </Option>
              <Option value={UserRole.CHEF_SPORT}>
                <div className="flex items-center justify-between">
                  <span>Chef Sport</span>
                  <Tag color="purple" className="ml-2">Niveau 3</Tag>
                </div>
              </Option>
              <Option value={UserRole.ADMIN}>
                <div className="flex items-center justify-between">
                  <span>Administrateur</span>
                  <Tag color="orange" className="ml-2">Niveau 4</Tag>
                </div>
              </Option>
              <Option value={UserRole.SUPERADMIN}>
                <div className="flex items-center justify-between">
                  <span>Super Administrateur</span>
                  <Tag color="red" className="ml-2">Niveau 5</Tag>
                </div>
              </Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={() => setIsModalOpen(false)} className="!rounded-xl !h-10 !px-6">
              Annuler
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createUserMutation.isPending || updateUserMutation.isPending}
              className="!rounded-xl !h-10 !px-6 !font-semibold !border-0"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              {editingUser ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
