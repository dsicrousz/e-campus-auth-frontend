import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc } from 'better-auth/plugins/admin/access';
import { statement } from './statements';

/**
 * Création du contrôleur d'accès
 */
export const ac = createAccessControl(statement);

/**
 * Définition des rôles avec leurs permissions
 * Basé sur Better Auth Admin Plugin
 */

// Rôle USER - Utilisateur standard (lecture seule)
export const user = ac.newRole({
  vente: ['read', 'list'],
  rapport: ['read'],
});

// Rôle SUPERADMIN - Accès complet à toutes les ressources
export const superadmin = ac.newRole({
  ...adminAc.statements, // Permissions admin Better Auth
  user: [
    'create',
    'list',
    'set-role',
    'ban',
    'impersonate',
    'delete',
    'set-password',
  ],
  session: ['list', 'revoke', 'delete'],
  vente: ['create', 'read', 'update', 'delete', 'list', 'validate'],
  caisse: ['open', 'close', 'read', 'reconcile', 'list'],
  restaurant: ['create', 'read', 'update', 'delete', 'list', 'manage'],
  codification: ['create', 'read', 'update', 'delete', 'list'],
  sport: ['create', 'read', 'update', 'delete', 'list', 'manage'],
  recouvrement: ['create', 'read', 'update', 'list', 'validate'],
  reprise: ['create', 'read', 'update', 'list', 'validate'],
  controle: ['read', 'validate', 'reject', 'list'],
  rapport: ['generate', 'read', 'export', 'list'],
});

// Rôle ADMIN - Gestion des utilisateurs et accès étendu
export const admin = ac.newRole({
  ...adminAc.statements, // Permissions admin Better Auth
  user: ['create', 'list', 'set-role', 'ban', 'delete'],
  session: ['list', 'revoke'],
  vente: ['read', 'list', 'validate'],
  caisse: ['read', 'list'],
  restaurant: ['read', 'list'],
  codification: ['read', 'list'],
  sport: ['read', 'list'],
  recouvrement: ['read', 'list'],
  reprise: ['read', 'list'],
  controle: ['read', 'list'],
  rapport: ['generate', 'read', 'export', 'list'],
});

// Rôle VENDEUR - Gestion des ventes
export const vendeur = ac.newRole({
  vente: ['create', 'read', 'update', 'list'],
  rapport: ['read'],
});

// Rôle CAISSIER - Gestion de la caisse
export const caissier = ac.newRole({
  caisse: ['open', 'close', 'read', 'reconcile', 'list'],
  vente: ['read', 'list'],
  rapport: ['read', 'generate'],
});

// Rôle ACP - Agent Commercial Principal
export const acp = ac.newRole({
  vente: ['create', 'read', 'update', 'list', 'validate'],
  caisse: ['read', 'list'],
  rapport: ['generate', 'read', 'export', 'list'],
});

// Rôle CONTROLEUR - Contrôle et validation
export const controleur = ac.newRole({
  controle: ['read', 'validate', 'reject', 'list'],
  vente: ['read', 'list'],
  caisse: ['read', 'list'],
  rapport: ['generate', 'read', 'export', 'list'],
});

// Rôle RECOUVREUR - Gestion des recouvrements
export const recouvreur = ac.newRole({
  recouvrement: ['create', 'read', 'update', 'list', 'validate'],
  vente: ['read', 'list'],
  rapport: ['read', 'generate'],
});

// Rôle REPREUNEUR - Gestion des reprises
export const repreuneur = ac.newRole({
  reprise: ['create', 'read', 'update', 'list', 'validate'],
  vente: ['read', 'list'],
  rapport: ['read', 'generate'],
});

// Rôle CHEF_RESTAURANT - Gestion du restaurant
export const chef_restaurant = ac.newRole({
  restaurant: ['create', 'read', 'update', 'delete', 'list', 'manage'],
  vente: ['read', 'list'],
  rapport: ['generate', 'read', 'export', 'list'],
});

// Rôle CHEF_CODIFICATION - Gestion de la codification
export const chef_codification = ac.newRole({
  codification: ['create', 'read', 'update', 'delete', 'list'],
  vente: ['read', 'list'],
  rapport: ['generate', 'read', 'export', 'list'],
});

// Rôle CHEF_SPORT - Gestion du sport
export const chef_sport = ac.newRole({
  sport: ['create', 'read', 'update', 'delete', 'list', 'manage'],
  vente: ['read', 'list'],
  rapport: ['generate', 'read', 'export', 'list'],
});

/**
 * Export de tous les rôles pour utilisation dans le plugin Better Auth
 */
export const roles = {
  user,
  superadmin,
  admin,
  vendeur,
  caissier,
  acp,
  controleur,
  recouvreur,
  repreuneur,
  chef_restaurant,
  chef_codification,
  chef_sport,
} as const;

/**
 * Types dérivés pour utilisation TypeScript
 */
export type RoleName = keyof typeof roles;
export type RolePermissions<R extends RoleName> = typeof roles[R];

/**
 * Énumération des noms de rôles pour utilisation dans les guards NestJS
 */
export enum UserRole {
  USER = 'user',
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  VENDEUR = 'vendeur',
  CAISSIER = 'caissier',
  ACP = 'acp',
  CONTROLEUR = 'controleur',
  RECOUVREUR = 'recouvreur',
  REPREUNEUR = 'repreuneur',
  CHEF_RESTAURANT = 'chef_restaurant',
  CHEF_CODIFICATION = 'chef_codification',
  CHEF_SPORT = 'chef_sport',
}
