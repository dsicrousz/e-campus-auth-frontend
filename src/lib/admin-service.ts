import { authClient } from './auth-client'
import type { RoleName } from './access-control'

/**
 * Normalise le rôle en tableau
 */
function normalizeRole(role: string | string[] | undefined): RoleName[] {
  if (!role) return ['user']
  if (Array.isArray(role)) return role as RoleName[]
  return [role as RoleName]
}

export interface User {
  id: string
  email: string
  name?: string
  emailVerified: boolean
  image?: string
  createdAt: Date
  updatedAt: Date
  role?: RoleName[]
  banned?: boolean
  banReason?: string
  banExpires?: Date
}

export interface UserWithRole extends User {
  role: RoleName[]
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  adminUsers: number
  bannedUsers: number
}

export interface CreateUserData {
  email: string
  password: string
  name: string
  role?: RoleName[]
}

export interface UpdateUserData {
  name?: string
  role?: RoleName[]
  email?: string
}

export interface UserListResponse {
  users: User[]
  total: number
  limit: number
  offset: number
}

export const adminService = {
  // Get all users with pagination
  async getUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc'
  ): Promise<UserListResponse> {
    try {
      const offset = (page - 1) * limit
      const response = await authClient.admin.listUsers({
        query: {
          limit,
          offset,
          searchValue: search,
          searchField: search ? 'email' : undefined,
          searchOperator: search ? 'contains' : undefined,
          sortBy,
          sortDirection,
        }
      })
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = response.data as any
      // Normaliser les rôles en tableaux
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const normalizedUsers = (data.users || []).map((user: any) => ({
        ...user,
        role: normalizeRole(user.role),
      }))
      
      return {
        ...data,
        users: normalizedUsers,
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      return { users: [], total: 0, limit, offset: 0 }
    }
  },

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    try {
      // Get all users to calculate stats
      const response = await authClient.admin.listUsers({
        query: {
          limit: 1000, // Get all users
        }
      })
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      const users = response.data?.users || []
      
      const isAdmin = (role: RoleName[] | undefined) => {
        if (!role || role.length === 0) return false
        return role.includes('admin') || role.includes('superadmin')
      }

      return {
        totalUsers: users.length,
        activeUsers: users.filter(u => !u.banned).length,
        adminUsers: users.filter(u => isAdmin(u.role as RoleName[] | undefined)).length,
        bannedUsers: users.filter(u => u.banned).length,
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return {
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0,
        bannedUsers: 0,
      }
    }
  },

  // Create new user
  async createUser(userData: CreateUserData): Promise<UserWithRole> {
    const response = await authClient.admin.createUser(userData)
    
    if (response.error) {
      throw new Error(response.error.message)
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = response.data.user as any
    return {
      ...user,
      role: normalizeRole(user.role),
    }
  },

  // Update user
  async updateUser(id: string, userData: UpdateUserData): Promise<UserWithRole> {
    const response = await authClient.admin.updateUser({
      userId: id,
      data: userData,
    })
    
    if (response.error) {
      throw new Error(response.error.message)
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = response.data as any
    return {
      ...user,
      role: normalizeRole(user.role),
    }
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    const response = await authClient.admin.removeUser({
      userId: id,
    })
    
    if (response.error) {
      throw new Error(response.error.message)
    }
  },

  // Ban user
  async banUser(id: string, reason?: string): Promise<void> {
    const response = await authClient.admin.banUser({
      userId: id,
      banReason: reason,
    })
    
    if (response.error) {
      throw new Error(response.error.message)
    }
  },

  // Unban user
  async unbanUser(id: string): Promise<void> {
    const response = await authClient.admin.unbanUser({
      userId: id,
    })
    
    if (response.error) {
      throw new Error(response.error.message)
    }
  },

  // Set user role
  async setUserRole(id: string, role: RoleName[]): Promise<void> {
    const response = await authClient.admin.setRole({
      userId: id,
      role,
    })
    
    if (response.error) {
      throw new Error(response.error.message)
    }
  },

  // Set user password
  async setUserPassword(id: string, password: string): Promise<void> {
    const response = await authClient.admin.setUserPassword({
      userId: id,
      newPassword: password,
    })
    
    if (response.error) {
      throw new Error(response.error.message)
    }
  },
}
