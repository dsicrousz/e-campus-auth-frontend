import { authClient } from './auth-client'

export interface UserSession {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
  userAgent?: string | null
  ipAddress?: string | null
  impersonatedBy?: string | null
}

export interface SessionListResponse {
  sessions: UserSession[]
  total: number
}

export const sessionService = {
  // Get all sessions for a user
  async getUserSessions(userId: string): Promise<UserSession[]> {
    try {
      const response = await authClient.admin.listUserSessions({
        userId,
      })
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      return response.data?.sessions || []
    } catch (error) {
      console.error('Error fetching user sessions:', error)
      return []
    }
  },

  // Revoke a specific session
  async revokeSession(sessionToken: string): Promise<void> {
    const response = await authClient.admin.revokeUserSession({
      sessionToken,
    })
    
    if (response.error) {
      throw new Error(response.error.message)
    }
  },

  // Revoke all sessions for a user
  async revokeAllUserSessions(userId: string): Promise<void> {
    const response = await authClient.admin.revokeUserSessions({
      userId,
    })
    
    if (response.error) {
      throw new Error(response.error.message)
    }
  },

  // Get all active sessions (admin only)
  async getAllSessions(): Promise<SessionListResponse> {
    try {
      // Note: This would require custom API endpoint or different approach
      // For now, we'll return empty as Better Auth doesn't provide direct all sessions endpoint
      return { sessions: [], total: 0 }
    } catch (error) {
      console.error('Error fetching all sessions:', error)
      return { sessions: [], total: 0 }
    }
  }
}
