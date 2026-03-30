# Refonte du Système de Gestion des Rôles

## 📋 Résumé des modifications

Le système de gestion des rôles a été entièrement revu pour supporter **12 rôles** au lieu de 2, avec une architecture modulaire et extensible basée sur Better Auth Access Control.

---

## 🎯 Nouveaux Rôles Disponibles

### Niveau 1 - Utilisateur Standard
- **USER** : Lecture seule des ventes et rapports

### Niveau 2 - Opérateurs
- **VENDEUR** : Gestion des ventes
- **CAISSIER** : Gestion de la caisse
- **RECOUVREUR** : Gestion des recouvrements
- **REPREUNEUR** : Gestion des reprises

### Niveau 3 - Responsables
- **ACP** (Agent Commercial Principal) : Validation des ventes + rapports
- **CONTROLEUR** : Contrôle et validation des opérations
- **CHEF_RESTAURANT** : Gestion complète du restaurant
- **CHEF_CODIFICATION** : Gestion de la codification
- **CHEF_SPORT** : Gestion du sport

### Niveau 4 - Administration
- **ADMIN** : Gestion des utilisateurs + accès étendu

### Niveau 5 - Super Administration
- **SUPERADMIN** : Accès complet à toutes les ressources

---

## 📁 Fichiers Modifiés

### 1. **`src/lib/access-control/statements.ts`**
✅ Ajout de types TypeScript dérivés
✅ Utilisation de constantes pour les actions CRUD
✅ Export des types `Statement`, `Resource`, `Action`

### 2. **`src/lib/access-control/roles.ts`**
✅ Définition de 12 rôles avec permissions granulaires
✅ Ajout de l'énumération `UserRole` pour NestJS
✅ Export des types `RoleName`, `RolePermissions`
✅ Permissions cohérentes pour `restaurant` et `sport` (ajout de CRUD complet)

### 3. **`src/lib/access-control/utils.ts`** ⭐ NOUVEAU
✅ Fonctions utilitaires pour la gestion des rôles
✅ `getRoleEnum()` : Conversion nom → enum
✅ `isAdminRole()` : Vérification rôle admin
✅ `isChefRole()` : Vérification rôle chef
✅ `getRoleResources()` : Liste des ressources par rôle
✅ `permissionMatrix` : Matrice de permissions avec niveaux

### 4. **`src/lib/access-control/index.ts`**
✅ Export centralisé incluant les utilitaires

### 5. **`src/lib/admin-service.ts`**
✅ Mise à jour des types `User`, `CreateUserData`, `UpdateUserData`
✅ Support de tous les rôles via `RoleName`
✅ Calcul correct des statistiques admin (superadmin inclus)

### 6. **`src/routes/admin.tsx`**
✅ Import du système de rôles complet
✅ Sélecteur de rôles avec 12 options groupées par niveau
✅ Affichage des rôles avec code couleur par niveau
✅ Tooltip informatif sur chaque rôle (ressources + niveau)
✅ Typage strict avec `RoleName`

### 7. **`src/components/RolePermissionsTooltip.tsx`** ⭐ NOUVEAU
✅ Composant réutilisable pour afficher les détails d'un rôle
✅ Affiche : description, niveau, ressources accessibles
✅ Intégration avec Ant Design Tooltip

---

## 🎨 Améliorations UI/UX

### Sélecteur de rôles
- **Recherche** : Champ de recherche intégré
- **Groupement visuel** : Tags de niveau colorés
- **Hiérarchie claire** : 
  - Niveau 1 : Gris (default)
  - Niveau 2 : Bleu
  - Niveau 3 : Violet
  - Niveau 4 : Orange
  - Niveau 5 : Rouge

### Tableau des utilisateurs
- **Tags colorés** : Rôles affichés avec couleur selon le niveau
- **Tooltip informatif** : Icône ℹ️ au survol pour voir les permissions
- **Affichage cohérent** : Rôles en majuscules pour meilleure lisibilité

---

## 🔧 Utilisation

### Côté Frontend (React)

```typescript
import { UserRole, permissionMatrix, getRoleResources } from '@/lib/access-control'

// Vérifier le niveau d'un rôle
const roleLevel = permissionMatrix['vendeur'].level // 2

// Obtenir les ressources accessibles
const resources = getRoleResources('vendeur') // ['vente', 'rapport']

// Utiliser l'enum dans les composants
<Select value={UserRole.VENDEUR}>
  <Option value={UserRole.VENDEUR}>Vendeur</Option>
</Select>
```

### Côté Backend (NestJS)

```typescript
import { UserRole } from '@/lib/access-control'

@Controller('ventes')
@UseGuards(RolesGuard)
export class VentesController {
  @Get()
  @Roles(UserRole.VENDEUR, UserRole.ACP, UserRole.ADMIN)
  findAll() {
    return 'Liste des ventes'
  }
}
```

### Vérification des permissions avec Better Auth

```typescript
// Côté client
const canCreateVente = await authClient.admin.hasPermission({
  permissions: {
    vente: ['create'],
  },
})

// Côté serveur
const hasPermission = await auth.api.userHasPermission({
  body: {
    userId: 'user-id',
    permissions: {
      vente: ['create'],
    },
  },
})
```

---

## 🔐 Matrice de Permissions

| Rôle | Vente | Caisse | Restaurant | Codification | Sport | Recouvrement | Reprise | Contrôle | Rapport |
|------|-------|--------|------------|--------------|-------|--------------|---------|----------|---------|
| USER | R | - | - | - | - | - | - | - | R |
| VENDEUR | CRUD | - | - | - | - | - | - | - | R |
| CAISSIER | R | FULL | - | - | - | - | - | - | RG |
| RECOUVREUR | R | - | - | - | - | CRUDV | - | - | RG |
| REPREUNEUR | R | - | - | - | - | - | CRUDV | - | RG |
| ACP | CRUDV | R | - | - | - | - | - | - | FULL |
| CONTROLEUR | R | R | - | - | - | - | - | FULL | FULL |
| CHEF_RESTAURANT | R | - | FULL | - | - | - | - | - | FULL |
| CHEF_CODIFICATION | R | - | - | CRUD | - | - | - | - | FULL |
| CHEF_SPORT | R | - | - | - | FULL | - | - | - | FULL |
| ADMIN | RV | R | R | R | R | R | R | R | FULL |
| SUPERADMIN | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL | FULL |

**Légende :**
- R = Read/List
- C = Create
- U = Update
- D = Delete
- V = Validate
- G = Generate
- FULL = Toutes les actions

---

## ✅ Avantages de la nouvelle architecture

1. **Extensibilité** : Ajout facile de nouveaux rôles
2. **Type-safety** : TypeScript garantit la cohérence
3. **Maintenabilité** : Code modulaire et bien organisé
4. **Réutilisabilité** : Utilitaires partagés frontend/backend
5. **Documentation** : Types auto-documentés
6. **UX améliorée** : Interface claire et informative
7. **Conformité NestJS** : Enum compatible avec les guards

---

## 🚀 Prochaines étapes

- [ ] Implémenter les guards NestJS pour chaque ressource
- [ ] Ajouter des tests unitaires pour les permissions
- [ ] Créer un composant de visualisation de la matrice de permissions
- [ ] Documenter les endpoints protégés dans Swagger
- [ ] Ajouter la gestion des rôles multiples (array de rôles)

---

## 📚 Documentation Better Auth

- [Better Auth Admin Plugin](https://www.better-auth.com/docs/plugins/admin)
- [Access Control](https://www.better-auth.com/docs/plugins/admin#access-control)
