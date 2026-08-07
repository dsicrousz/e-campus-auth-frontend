# Système de Contrôle d'Accès (Access Control)

Ce système est basé sur le plugin **Better Auth Admin** avec des rôles et permissions personnalisés.

Domaine : digitalisation du processus de ventes et consommation des tickets de restauration universitaire (CROUS).

## 📋 Rôles Disponibles (11)

### 1. **USER** (Utilisateur Standard)
- Compte générique authentifié, aucune permission métier

### 2. **VENDEUR**
- Vente de tickets de restauration
- Permissions : `ticket:create`, `ticket:read`, `ticket:update`, `ticket:list`

### 3. **RECOUVREUR**
- Recouvrement des créances
- Permissions : `recouvrement:CRUD+validate`, `rapport:read,generate`

### 4. **CAISSIER_PRINCIPAL**
- Gestion de la caisse physique
- Permissions : `caisse:open,close,read,reconcile,list`, `ticket:read,list`

### 5. **REPRENEUR**
- Restaurants assignés : produire les factures
- Permissions : `reprise:read,list,generate,export`, `ticket:read,list`, `restauration:read,list`

### 6. **ACP** (Agent Comptable Principal)
- Page comptabilité
- Permissions : `comptabilite:read,export,reconcile,list,validate`, `caisse:read,reconcile`, `ticket:read,list,validate`

### 7. **CONTROLEUR**
- Restaurants assignés : scanner et consommer les tickets
- Permissions : `ticket:read,list,consume`, `controle_acces:check,validate,reject,list`

### 8. **SUPERVISEUR**
- Restaurants supervisés + planning de contrôle
- Permissions : `ticket:read,list,consume`, `controle_acces:check,validate,reject,list`, `planning_controle:create,read,update,list,assign`, `restauration:read,list`

### 9. **CHEF_DIV_RESTAURANT**
- Tout ce qui touche la restauration et le contrôle
- Permissions : `ticket:read,list,validate`, `controle_acces:read,check,validate,reject,list,assign`, `planning_controle:CRUD+assign`, `restauration:manage,read,update,list`

### 10. **ADMIN** (Administrateur)
- Lecture globale, pas de modification ni suppression
- Permissions : lecture sur toutes les ressources + `rapport:read,list,generate,export`

### 11. **SUPERADMIN** (Super Administrateur)
- Accès complet à toutes les ressources
- Gestion complète des utilisateurs et sessions

## 🔐 Ressources et Actions

### Ressources système (Better Auth)
- **user** : `create`, `list`, `set-role`, `update`, `ban`, `impersonate`, `delete`, `set-password`
- **session** : `list`, `revoke`, `delete`

### Ressources métier
- **ticket** : `create`, `read`, `update`, `delete`, `list`, `consume`, `validate`
- **controle_acces** : `read`, `check`, `validate`, `reject`, `list`, `assign`
- **planning_controle** : `create`, `read`, `update`, `delete`, `list`, `assign`
- **restauration** : `manage`, `read`, `update`, `list`
- **caisse** : `open`, `close`, `read`, `reconcile`, `list`
- **comptabilite** : `read`, `export`, `reconcile`, `list`, `validate`
- **recouvrement** : `create`, `read`, `update`, `list`, `validate`
- **reprise** : `read`, `list`, `generate`, `export`
- **rapport** : `generate`, `read`, `export`, `list`

## 🏪 Assignation par restaurant

Les rôles `controleur`, `superviseur`, et `repreneur` sont filtrés selon les restaurants assignés à l'utilisateur en base (table user↔restaurant).

## 📚 Utilisation

### Vérifier les permissions côté serveur

```typescript
import { auth } from '@/lib/auth';

// Vérifier par userId
const hasPermission = await auth.api.userHasPermission({
  body: {
    userId: 'user-id',
    permissions: {
      ticket: ['create'],
    },
  },
});

// Vérifier par rôle
const hasPermission = await auth.api.userHasPermission({
  body: {
    role: 'vendeur',
    permissions: {
      ticket: ['create', 'update'],
    },
  },
});
```

### Vérifier les permissions côté client

```typescript
import { authClient } from '@/lib/auth-client';

// Vérifier les permissions de l'utilisateur connecté
const canCreateTicket = await authClient.admin.hasPermission({
  permissions: {
    ticket: ['create'],
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
import { USER_ROLE } from '@/lib/access-control';

@Controller('tickets')
@UseGuards(RolesGuard)
export class TicketsController {
  @Get()
  @Roles(USER_ROLE.VENDEUR, USER_ROLE.ACP, USER_ROLE.ADMIN)
  findAll() {
    return 'Liste des tickets';
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
    role: 'vendeur,controleur',
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
