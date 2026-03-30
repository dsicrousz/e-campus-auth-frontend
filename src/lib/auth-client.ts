import { createAuthClient } from "better-auth/client"
import { adminClient } from "better-auth/client/plugins"
import { ac, roles } from "./access-control"

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  plugins: [
    adminClient({
            ac,
            roles
        })
  ],
  socialProviders: {
    google: {
      enabled: true,
    },
  },
})
// Infer types from the auth client
export type Session = typeof authClient.$Infer.Session
export type User = typeof authClient.$Infer.Session.user
