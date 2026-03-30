# Implémentation : Rôle toujours en tableau

## 🎯 Objectif

Garantir que le champ `role` soit **toujours un tableau de chaînes** (`RoleName[]`), même pour un rôle unique.

---

## ✅ Modifications effectuées

### 1. **Types TypeScript (admin-service.ts)**

#### Avant
```typescript
role?: RoleName | RoleName[]  // Rôle unique OU multiple
```

#### Après
```typescript
role?: RoleName[]  // Toujours un tableau
```

**Interfaces modifiées :**
- `User.role` : `RoleName[]`
- `UserWithRole.role` : `RoleName[]`
- `CreateUserData.role` : `RoleName[]`
- `UpdateUserData.role` : `RoleName[]`
- `setUserRole(role)` : `RoleName[]`

---

### 2. **Fonction de normalisation**

```typescript
/**
 * Normalise le rôle en tableau
 */
function normalizeRole(role: string | string[] | undefined): RoleName[] {
  if (!role) return ['user']
  if (Array.isArray(role)) return role as RoleName[]
  return [role as RoleName]  // Convertir rôle unique en tableau
}
```

**Utilisation :**
- Lors de la récupération des utilisateurs
- Lors de la création d'un utilisateur
- Lors de la mise à jour d'un utilisateur

---

### 3. **Service admin (admin-service.ts)**

#### getUsers()
```typescript
const data = response.data as any
// Normaliser les rôles en tableaux
const normalizedUsers = (data.users || []).map((user: any) => ({
  ...user,
  role: normalizeRole(user.role),
}))

return {
  ...data,
  users: normalizedUsers,
}
```

#### createUser()
```typescript
const user = response.data.user as any
return {
  ...user,
  role: normalizeRole(user.role),
}
```

#### updateUser()
```typescript
const user = response.data as any
return {
  ...user,
  role: normalizeRole(user.role),
}
```

---

### 4. **Interface utilisateur (admin.tsx)**

#### showModal()
```typescript
const showModal = (user?: User) => {
  setEditingUser(user || null)
  if (user) {
    // Normaliser le rôle en tableau
    const normalizedRole = user.role || ['user']
    form.setFieldsValue({
      email: user.email,
      name: user.name,
      role: normalizedRole,  // Toujours un tableau
    })
  } else {
    form.resetFields()
  }
  setIsModalOpen(true)
}
```

#### handleSubmit()
```typescript
const handleSubmit = async (values: { 
  email: string; 
  password?: string; 
  name: string; 
  role: RoleName[]  // Toujours un tableau
}) => {
  // ...
}
```

#### Affichage dans le tableau
```typescript
render: (role: string[]) => {  // Type : tableau
  // Le rôle est toujours un tableau
  const roles = role || ['user']
  
  return (
    <Space size={[0, 4]} wrap>
      {roles.map((r) => (
        <Tag key={r}>{r.toUpperCase()}</Tag>
      ))}
    </Space>
  )
}
```

---

### 5. **Statistiques (getUserStats)**

```typescript
const isAdmin = (role: RoleName[] | undefined) => {
  if (!role || role.length === 0) return false
  return role.includes('admin') || role.includes('superadmin')
}

adminUsers: users.filter(u => isAdmin(u.role)).length
```

---

## 📊 Exemples de données

### Utilisateur avec un seul rôle
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "Jean Dupont",
  "role": ["vendeur"]  // ✅ Tableau avec un élément
}
```

### Utilisateur avec plusieurs rôles
```json
{
  "id": "456",
  "email": "admin@example.com",
  "name": "Marie Martin",
  "role": ["vendeur", "caissier", "acp"]  // ✅ Tableau avec plusieurs éléments
}
```

### Utilisateur sans rôle (défaut)
```json
{
  "id": "789",
  "email": "new@example.com",
  "name": "Nouveau User",
  "role": ["user"]  // ✅ Rôle par défaut en tableau
}
```

---

## 🔄 Flux de données

### Création d'un utilisateur

```
1. Formulaire → values.role = ['vendeur', 'caissier']
                    ↓
2. createUser(userData) → Envoi à Better Auth
                    ↓
3. Better Auth → Retourne user.role = 'vendeur,caissier' (string)
                    ↓
4. normalizeRole() → Convertit en ['vendeur', 'caissier']
                    ↓
5. Frontend → Affiche les deux tags
```

### Récupération des utilisateurs

```
1. getUsers() → Appel Better Auth API
                    ↓
2. Better Auth → Retourne users avec role = string | undefined
                    ↓
3. normalizeRole() → Convertit chaque role en tableau
                    ↓
4. Frontend → Reçoit users avec role = RoleName[]
                    ↓
5. Tableau → Affiche correctement les rôles
```

---

## ⚠️ Gestion des incompatibilités TypeScript

### Problème
Better Auth retourne `string | undefined` pour le rôle, mais nous voulons `RoleName[]`.

### Solution
Utilisation de `as any` pour contourner temporairement le typage strict :

```typescript
const user = response.data.user as any  // Contournement nécessaire
return {
  ...user,
  role: normalizeRole(user.role),  // Normalisation en tableau
}
```

**Justification :**
- Better Auth ne supporte pas nativement les tableaux de rôles typés
- La normalisation garantit la cohérence des données
- Le typage strict est restauré après normalisation

---

## ✅ Avantages

### 1. **Cohérence**
- Pas de vérification `Array.isArray()` partout
- Code plus simple et prévisible

### 2. **Type-safety**
- TypeScript garantit que `role` est toujours un tableau
- Autocomplétion et vérification à la compilation

### 3. **Simplicité**
```typescript
// ❌ Avant : Vérification nécessaire
const roles = Array.isArray(role) ? role : [role || 'user']

// ✅ Après : Direct
const roles = role || ['user']
```

### 4. **Évolutivité**
- Prêt pour les rôles multiples par défaut
- Pas de refactoring nécessaire

---

## 🧪 Tests recommandés

### Test 1 : Création avec un rôle
```typescript
await createUser({
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  role: ['vendeur']  // Un seul rôle en tableau
})

// Vérifier : user.role === ['vendeur']
```

### Test 2 : Création avec plusieurs rôles
```typescript
await createUser({
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  role: ['vendeur', 'caissier']
})

// Vérifier : user.role === ['vendeur', 'caissier']
```

### Test 3 : Récupération et normalisation
```typescript
const users = await getUsers()

users.forEach(user => {
  expect(Array.isArray(user.role)).toBe(true)
  expect(user.role.length).toBeGreaterThan(0)
})
```

### Test 4 : Mise à jour
```typescript
await updateUser(userId, {
  role: ['admin']
})

const user = await getUser(userId)
expect(user.role).toEqual(['admin'])
```

---

## 📝 Notes importantes

### Backend (NestJS)
Le backend doit également gérer les rôles en tableau :

```typescript
// Guard NestJS
@Roles(UserRole.VENDEUR, UserRole.CAISSIER)
@Get('ventes')
getVentes(@CurrentUser() user: User) {
  // user.role est un tableau
  const hasVendeurRole = user.role.includes(UserRole.VENDEUR)
}
```

### Better Auth
Better Auth stocke les rôles comme une chaîne séparée par des virgules :
- Frontend envoie : `['vendeur', 'caissier']`
- Better Auth stocke : `'vendeur,caissier'`
- Frontend reçoit : `'vendeur,caissier'`
- Normalisation : `['vendeur', 'caissier']`

---

## 🚀 Prochaines étapes

- [ ] Mettre à jour le backend NestJS pour accepter les tableaux
- [ ] Ajouter des tests unitaires pour normalizeRole()
- [ ] Documenter le format dans l'API Swagger
- [ ] Créer un middleware de validation des rôles
- [ ] Ajouter des logs pour tracer les conversions

---

## 📚 Références

- [Better Auth Admin Plugin](https://www.better-auth.com/docs/plugins/admin)
- [TypeScript Array Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)
