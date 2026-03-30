# Better Auth Setup Guide

This project has been configured with Better Auth for comprehensive authentication and user management.

## ✅ **Completed Features**

### **1. Authentication System**
- **Email/Password Authentication**: Full login/register flow
- **Session Management**: Automatic session handling
- **Protected Routes**: Admin-only access
- **User Context**: Global auth state management

### **2. User Interface**
- **Login Page**: `/login` - Email/password authentication
- **Register Page**: `/register` - New user registration
- **Admin Dashboard**: `/admin` - User management (admin only)
- **Navigation**: Dynamic auth-aware navigation

### **3. Technical Stack**
- **Better Auth**: Authentication framework
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

## 🚀 **Getting Started**

### **1. Backend Setup**
You'll need to set up the Better Auth backend. Create a file `auth-server.ts`:

```typescript
import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
  database: {
    // Configure your database
    provider: "sqlite", // or "mongodb", "postgresql", etc.
    url: "./auth.db"
  },
  plugins: [
    admin({
      // Admin plugin configuration
      roles: ["user", "admin"],
      defaultRole: "user"
    })
  ],
  socialProviders: {
    // Add social providers if needed
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }
  }
})
```

### **2. Environment Variables**
Create `.env.local` file:
```bash
VITE_API_URL=http://localhost:3000
```

### **3. Database Configuration**
Better Auth supports multiple databases:
- **SQLite**: Perfect for development
- **PostgreSQL**: Production ready
- **MongoDB**: NoSQL option
- **MySQL**: Traditional SQL

### **4. Admin Plugin Features**
The admin plugin provides:
- **User Management**: CRUD operations on users
- **Role Management**: Assign and manage user roles
- **Session Management**: View and revoke user sessions
- **Permission System**: Granular access control

## 🔧 **Usage Examples**

### **Authentication Hook**
```typescript
import { useAuth } from '@/lib/auth-context'

function MyComponent() {
  const { user, signIn, signOut, isAdmin } = useAuth()
  
  if (!user) {
    return <button onClick={() => signIn('email@example.com', 'password')}>Login</button>
  }
  
  return <div>Welcome {user.name}!</div>
}
```

### **Protected Route**
```typescript
// Use the existing admin route as template
// Redirects non-admin users to login
```

### **API Integration**
```typescript
import { authClient } from '@/lib/auth-client'

// Get current session
const { data: session } = await authClient.getSession()

// Sign up new user
await authClient.signUp.email({
  email: "user@example.com",
  password: "securepassword",
  name: "John Doe"
})
```

## 📁 **File Structure**

```
src/
├── lib/
│   ├── auth-client.ts      # Better Auth client configuration
│   └── auth-context.tsx    # React context for auth state
├── routes/
│   ├── __root.tsx         # Root layout with auth navigation
│   ├── login.tsx          # Login page
│   ├── register.tsx       # Registration page
│   ├── admin.tsx          # Admin dashboard
│   └── index.tsx          # Home page
└── main.tsx               # App entry point with providers
```

## 🎯 **Next Steps**

1. **Set up backend**: Configure your Better Auth backend server
2. **Database**: Choose and configure your database
3. **Social Auth**: Add Google, GitHub, etc.
4. **Email Verification**: Set up email verification
5. **Password Reset**: Add password reset functionality
6. **Admin UI**: Complete user management interface

## 🔐 **Security Features**

- **Password hashing** with bcrypt/argon2
- **JWT tokens** for session management
- **CSRF protection**
- **Rate limiting**
- **Input validation**
- **Role-based access control**

## 📚 **Resources**

- [Better Auth Documentation](https://better-auth.com)
- [Admin Plugin Guide](https://better-auth.com/docs/plugins/admin)
- [React Integration](https://better-auth.com/docs/integrations/react)
- [Database Adapters](https://better-auth.com/docs/adapters)
