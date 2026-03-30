# Système de Contrôle d'Accès (Access Control)

Ce système est basé sur le plugin **Better Auth Admin** avec des rôles et permissions personnalisés.

## 📋 Rôles Disponibles

### 1. **USER** (Utilisateur Standard)
- Accès en lecture seule aux ventes et rapports
- Permissions : `vente:read`, `rapport:read`

### 2. **SUPERADMIN** (Super Administrateur)
- Accès complet à toutes les ressources
- Gestion complète des utilisateurs et sessions
- Toutes les permissions sur toutes les ressources

### 3. **ADMIN** (Administrateur)
- Gestion des utilisateurs (création, bannissement, attribution de rôles)
- Accès en lecture à toutes les ressources
- Génération et export de rapports

### 4. **VENDEUR**
- Création et gestion des ventes
- Permissions : `vente:create`, `vente:read`, `vente:update`, `vente:list`

### 5. **CAISSIER**
- Gestion de la caisse (ouverture, fermeture, réconciliation)
- Lecture des ventes
- Génération de rapports de caisse

### 6. **ACP** (Agent Commercial Principal)
- Gestion et validation des ventes
- Consultation de la caisse
- Génération et export de rapports

### 7. **CONTROLEUR**
- Contrôle et validation des opérations
- Lecture des ventes et caisses
- Génération de rapports de contrôle

### 8. **RECOUVREUR**
- Gestion des recouvrements
- Consultation des ventes
- Génération de rapports de recouvrement

### 9. **REPREUNEUR**
- Gestion des reprises
- Consultation des ventes
- Génération de rapports de reprise

### 10. **CHEF_RESTAURANT**
- Gestion complète du restaurant
- Consultation des ventes
- Génération et export de rapports

### 11. **CHEF_CODIFICATION**
- Gestion de la codification (CRUD complet)
- Consultation des ventes
- Génération et export de rapports

### 12. **CHEF_SPORT**
- Gestion du sport
- Consultation des ventes
- Génération et export de rapports

## 🔐 Ressources et Actions

### Ressources Better Auth (par défaut)
- **user** : `create`, `list`, `set-role`, `ban`, `impersonate`, `delete`, `set-password`
- **session** : `list`, `revoke`, `delete`

### Ressources Métier Personnalisées
- **vente** : `create`, `read`, `update`, `delete`, `list`, `validate`
- **caisse** : `open`, `close`, `read`, `reconcile`, `list`
- **restaurant** : `manage`, `read`, `update`, `list`
- **codification** : `create`, `read`, `update`, `delete`, `list`
- **sport** : `manage`, `read`, `update`, `list`
- **recouvrement** : `create`, `read`, `update`, `list`, `validate`
- **reprise** : `create`, `read`, `update`, `list`, `validate`
- **controle** : `read`, `validate`, `reject`, `list`
- **rapport** : `generate`, `read`, `export`, `list`

## 📚 Utilisation

### Vérifier les permissions côté serveur

```typescript
import { auth } from '@/lib/auth';

// Vérifier par userId
const hasPermission = await auth.api.userHasPermission({
  body: {
    userId: 'user-id',
    permissions: {
      vente: ['create'],
    },
  },
});

// Vérifier par rôle
const hasPermission = await auth.api.userHasPermission({
  body: {
    role: 'vendeur',
    permissions: {
      vente: ['create', 'update'],
    },
  },
});
```

### Vérifier les permissions côté client

```typescript
import { authClient } from '@/lib/auth-client';

// Vérifier les permissions de l'utilisateur connecté
const canCreateVente = await authClient.admin.hasPermission({
  permissions: {
    vente: ['create'],
  },
});

// Vérifier les permissions d'un rôle spécifique
const canDeleteUser = authClient.admin.checkRolePermission({
  role: 'admin',
  permissions: {
    user: ['delete'],
  },
});
```

### Protéger les routes NestJS

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { USER_ROLE } from '@/auth/enums/user-role.enum';

@Controller('ventes')
@UseGuards(RolesGuard)
export class VentesController {
  @Get()
  @Roles(USER_ROLE.VENDEUR, USER_ROLE.ACP, USER_ROLE.ADMIN)
  findAll() {
    return 'Liste des ventes';
  }
}
```

## 🔄 Attribution de rôles

### Côté serveur

```typescript
import { auth } from '@/lib/auth';

// Attribuer un rôle à un utilisateur
await auth.api.setRole({
  body: {
    userId: 'user-id',
    role: 'vendeur',
  },
});

// Attribuer plusieurs rôles (séparés par des virgules)
await auth.api.setRole({
  body: {
    userId: 'user-id',
    role: 'vendeur,caissier',
  },
});
```

### Côté client

```typescript
import { authClient } from '@/lib/auth-client';

// Attribuer un rôle
await authClient.admin.setRole({
  userId: 'user-id',
  role: 'vendeur',
});
```

## 📖 Documentation Better Auth

Pour plus d'informations, consultez la documentation officielle :
- [Better Auth Admin Plugin](https://www.better-auth.com/docs/plugins/admin)
- [Access Control](https://www.better-auth.com/docs/plugins/admin#access-control)
