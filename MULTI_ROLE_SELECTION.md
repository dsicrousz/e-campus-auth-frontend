# Sélection Multiple de Rôles

## 🎯 Fonctionnalité

Le système permet maintenant d'attribuer **plusieurs rôles simultanément** à un utilisateur.

---

## ✨ Modifications apportées

### 1. **Interface utilisateur (admin.tsx)**

#### Sélecteur de rôles
```tsx
<Select 
  mode="multiple"  // ✅ Mode multi-sélection activé
  placeholder="Sélectionner un ou plusieurs rôles"
  showSearch
  optionFilterProp="children"
  maxTagCount="responsive"  // Affichage adaptatif des tags
  allowClear  // Bouton pour tout effacer
>
```

**Caractéristiques :**
- ✅ Sélection multiple avec tags
- ✅ Recherche dans les rôles
- ✅ Affichage responsive (collapse automatique si trop de tags)
- ✅ Bouton de suppression rapide
- ✅ Tooltip explicatif

#### Affichage dans le tableau
```tsx
render: (role: string | string[]) => {
  const roles = Array.isArray(role) ? role : [role || 'user']
  
  return (
    <Space size={[0, 4]} wrap>
      {roles.map((r) => (
        <span key={roleName} className="inline-flex items-center">
          <Tag color={colors[roleInfo?.level || 1]}>
            {roleName.toUpperCase()}
          </Tag>
          <RolePermissionsTooltip role={roleName} />
        </span>
      ))}
    </Space>
  )
}
```

**Affichage :**
- Chaque rôle est affiché avec son tag coloré
- Tooltip informatif sur chaque rôle
- Wrapping automatique si plusieurs rôles

---

### 2. **Types TypeScript**

#### Signature de handleSubmit
```typescript
const handleSubmit = async (values: { 
  email: string; 
  password?: string; 
  name: string; 
  role: RoleName | RoleName[]  // ✅ Support des rôles multiples
}) => {
  // ...
}
```

#### Types dans admin-service.ts
```typescript
export interface User {
  role?: RoleName | RoleName[]  // ✅ Rôle unique ou multiple
}

export interface CreateUserData {
  role?: RoleName | RoleName[]
}

export interface UpdateUserData {
  role?: RoleName | RoleName[]
}
```

---

### 3. **Calcul des statistiques**

```typescript
const isAdmin = (role: RoleName | RoleName[] | undefined) => {
  if (!role) return false
  if (Array.isArray(role)) {
    return role.includes('admin') || role.includes('superadmin')
  }
  return role === 'admin' || role === 'superadmin'
}

adminUsers: users.filter(u => isAdmin(u.role)).length
```

**Logique :**
- Gère les rôles uniques et multiples
- Compte un utilisateur comme admin s'il a au moins un rôle admin

---

## 📋 Cas d'usage

### Exemple 1 : Vendeur + Caissier
Un employé peut gérer à la fois les ventes et la caisse :
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "role": ["vendeur", "caissier"]
}
```

**Permissions cumulées :**
- Vente : create, read, update, list
- Caisse : open, close, read, reconcile, list
- Rapport : read, generate

### Exemple 2 : Chef Restaurant + Contrôleur
Un responsable avec double casquette :
```json
{
  "name": "Marie Martin",
  "email": "marie@example.com",
  "role": ["chef_restaurant", "controleur"]
}
```

**Permissions cumulées :**
- Restaurant : CRUD complet + manage
- Contrôle : read, validate, reject, list
- Vente : read, list
- Caisse : read, list
- Rapport : generate, read, export, list

### Exemple 3 : Super Admin seul
Pour un administrateur système :
```json
{
  "name": "Admin Système",
  "email": "admin@example.com",
  "role": "superadmin"  // Rôle unique
}
```

---

## 🎨 Interface utilisateur

### Formulaire de création/modification
```
┌─────────────────────────────────────────┐
│ Rôle(s) *                         ℹ️    │
│ ┌─────────────────────────────────────┐ │
│ │ [VENDEUR ×] [CAISSIER ×]       ▼   │ │
│ └─────────────────────────────────────┘ │
│ Vous pouvez sélectionner plusieurs      │
│ rôles pour cet utilisateur               │
└─────────────────────────────────────────┘
```

### Tableau des utilisateurs
```
┌──────────────┬──────────────────────────────────┐
│ Nom          │ Rôle(s)                          │
├──────────────┼──────────────────────────────────┤
│ Jean Dupont  │ [VENDEUR] ℹ️ [CAISSIER] ℹ️      │
│ Marie Martin │ [CHEF_RESTAURANT] ℹ️             │
│              │ [CONTROLEUR] ℹ️                  │
│ Admin        │ [SUPERADMIN] ℹ️                  │
└──────────────┴──────────────────────────────────┘
```

---

## 🔐 Vérification des permissions

### Côté Backend (NestJS)

Avec Better Auth, la vérification se fait automatiquement :

```typescript
// Vérifier si l'utilisateur a AU MOINS UN des rôles
@Roles(UserRole.VENDEUR, UserRole.CAISSIER)
@Get('ventes')
getVentes() {
  // Accessible si l'utilisateur a vendeur OU caissier
}

// Vérifier une permission spécifique
const hasPermission = await auth.api.userHasPermission({
  body: {
    userId: 'user-id',
    permissions: {
      vente: ['create'],
    },
  },
})
// Retourne true si l'utilisateur a au moins un rôle avec cette permission
```

### Côté Frontend

```typescript
// Vérifier les permissions de l'utilisateur connecté
const canCreateVente = await authClient.admin.hasPermission({
  permissions: {
    vente: ['create'],
  },
})

// Affichage conditionnel
{canCreateVente && (
  <Button>Créer une vente</Button>
)}
```

---

## ⚠️ Bonnes pratiques

### ✅ À FAIRE
- Attribuer des rôles complémentaires (vendeur + caissier)
- Utiliser un seul rôle admin pour éviter les conflits
- Documenter les combinaisons de rôles courantes
- Tester les permissions cumulées

### ❌ À ÉVITER
- Attribuer plusieurs rôles admin (superadmin + admin)
- Combiner des rôles contradictoires (user + superadmin)
- Attribuer trop de rôles à un seul utilisateur (> 3)
- Oublier de vérifier les permissions côté backend

---

## 🧪 Tests recommandés

### Test 1 : Création avec rôles multiples
```typescript
await createUser({
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  role: ['vendeur', 'caissier']
})

// Vérifier que l'utilisateur a bien les deux rôles
// Vérifier que les permissions sont cumulées
```

### Test 2 : Mise à jour des rôles
```typescript
// Ajouter un rôle
await updateUser(userId, {
  role: ['vendeur', 'caissier', 'recouvreur']
})

// Retirer un rôle
await updateUser(userId, {
  role: ['vendeur']
})
```

### Test 3 : Affichage dans le tableau
```typescript
// Vérifier que les tags s'affichent correctement
// Vérifier que les tooltips fonctionnent
// Vérifier le wrapping avec plusieurs rôles
```

---

## 📊 Impact sur les statistiques

Le comptage des administrateurs prend en compte les rôles multiples :

```typescript
adminUsers: users.filter(u => {
  const role = u.role
  if (Array.isArray(role)) {
    return role.includes('admin') || role.includes('superadmin')
  }
  return role === 'admin' || role === 'superadmin'
}).length
```

**Exemple :**
- User 1 : `['vendeur', 'admin']` → Compté comme admin ✅
- User 2 : `'admin'` → Compté comme admin ✅
- User 3 : `['vendeur', 'caissier']` → Non compté comme admin ❌

---

## 🚀 Évolutions futures

- [ ] Ajouter des groupes de rôles prédéfinis (ex: "Équipe Vente")
- [ ] Créer un visualiseur de permissions cumulées
- [ ] Implémenter des rôles temporaires avec expiration
- [ ] Ajouter un historique des changements de rôles
- [ ] Créer des templates de rôles par département

---

## 📚 Documentation Better Auth

Better Auth supporte nativement les rôles multiples via le plugin Admin :

- [Admin Plugin - Roles](https://www.better-auth.com/docs/plugins/admin#roles)
- [Access Control](https://www.better-auth.com/docs/plugins/admin#access-control)
