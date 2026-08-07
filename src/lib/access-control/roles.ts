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
 *
 * Domaine : digitalisation du processus de ventes et consommation
 * des tickets de restauration universitaire (CROUS).
 *
 * Hiérarchie :
 *   superadmin          — accès complet à toutes les ressources
 *   admin               — lecture globale, pas de modification/suppression
 *
 *   chef_div_restaurant — tout ce qui touche la restauration et le contrôle
 *   superviseur         — restaurants supervisés + planning de contrôle
 *   controleur          — restaurants assignés : scanner/consommer les tickets
 *
 *   vendeur             — page de vente des tickets
 *   caissier_principal  — page de caisse
 *   acp                 — page comptabilité (agent comptable principal)
 *   recouvreur          — page de recouvrement
 *   repreneur           — restaurants assignés : produire les factures
 *
 *   user                — compte générique, aucune permission métier
 *
 * Assignation par restaurant (gérée en base, table user↔restaurant) :
 *   controleur, superviseur, repreneur sont filtrés selon les restaurants
 *   qui leur sont assignés par l'administrateur.
 */

// Rôle USER - Compte générique authentifié sans permission métier.
// Note: `rapport: ['read']` est requis pour éviter que le type générique de `authorize`
// ne collapse vers `never` (Better Auth / TypeScript). La lecture des rapports est
// la permission minimale accordée à tout utilisateur authentifié.
export const user = ac.newRole({
  rapport: ['read'],
});

// Rôle SUPERADMIN - Accès complet à toutes les ressources
export const superadmin = ac.newRole({
  ...adminAc.statements, // Permissions admin Better Auth
  user: [
    'create',
    'list',
    'set-role',
    'update',
    'ban',
    'impersonate',
    'delete',
    'set-password',
  ],
  session: ['list', 'revoke', 'delete'],
  ticket: ['create', 'read', 'update', 'delete', 'list', 'consume', 'validate'],
  controle_acces: ['read', 'check', 'validate', 'reject', 'list', 'assign'],
  planning_controle: [
    'create',
    'read',
    'update',
    'delete',
    'list',
    'assign',
  ],
  restauration: ['manage', 'read', 'update', 'list'],
  caisse: ['open', 'close', 'read', 'reconcile', 'list'],
  comptabilite: ['read', 'export', 'reconcile', 'list', 'validate'],
  recouvrement: ['create', 'read', 'update', 'list', 'validate'],
  reprise: ['read', 'list', 'generate', 'export'],
  rapport: ['generate', 'read', 'export', 'list'],
});

// Rôle ADMIN - Lecture globale, pas de modification ni suppression
export const admin = ac.newRole({
  user: ['list'],
  session: ['list'],
  ticket: ['read', 'list'],
  controle_acces: ['read', 'list'],
  planning_controle: ['read', 'list'],
  restauration: ['read', 'list'],
  caisse: ['read', 'list'],
  comptabilite: ['read', 'list'],
  recouvrement: ['read', 'list'],
  reprise: ['read', 'list'],
  rapport: ['read', 'list', 'generate', 'export'],
});

// Rôle VENDEUR - Accès à sa page : vente de tickets
export const vendeur = ac.newRole({
  ticket: ['create', 'read', 'update', 'list'],
  rapport: ['read'],
});

// Rôle RECOUVREUR - Accès à sa page : recouvrement
export const recouvreur = ac.newRole({
  recouvrement: ['create', 'read', 'update', 'list', 'validate'],
  rapport: ['read', 'generate'],
});

// Rôle CAISSIER_PRINCIPAL - Accès à sa page : caisse
export const caissier_principal = ac.newRole({
  caisse: ['open', 'close', 'read', 'reconcile', 'list'],
  ticket: ['read', 'list'],
  rapport: ['read', 'generate'],
});

// Rôle ACP - Agent Comptable Principal, accès à sa page : comptabilité
export const acp = ac.newRole({
  comptabilite: ['read', 'export', 'reconcile', 'list', 'validate'],
  caisse: ['read', 'reconcile'],
  ticket: ['read', 'list', 'validate'],
  rapport: ['generate', 'read', 'export', 'list'],
});

// Rôle CONTROLEUR - Restaurants assignés : scanner et consommer les tickets
// (filtrage par restaurant assigné géré en base)
export const controleur = ac.newRole({
  ticket: ['read', 'list', 'consume'],
  controle_acces: ['check', 'validate', 'reject', 'list'],
  rapport: ['read'],
});

// Rôle SUPERVISEUR - Restaurants supervisés + planning de contrôle
// (filtrage par restaurant supervisé géré en base)
export const superviseur = ac.newRole({
  ticket: ['read', 'list', 'consume'],
  controle_acces: ['check', 'validate', 'reject', 'list'],
  planning_controle: ['create', 'read', 'update', 'list', 'assign'],
  restauration: ['read', 'list'],
  rapport: ['read', 'generate'],
});

// Rôle CHEF_DIV_RESTAURANT - Tout ce qui touche la restauration et le contrôle
export const chef_div_restaurant = ac.newRole({
  ticket: ['read', 'list', 'validate'],
  controle_acces: ['read', 'check', 'validate', 'reject', 'list', 'assign'],
  planning_controle: ['create', 'read', 'update', 'delete', 'list', 'assign'],
  restauration: ['manage', 'read', 'update', 'list'],
  rapport: ['generate', 'read', 'export', 'list'],
});

// Rôle REPRENEUR - Restaurants assignés : produire les factures
// (filtrage par restaurant assigné géré en base)
export const repreneur = ac.newRole({
  reprise: ['read', 'list', 'generate', 'export'],
  ticket: ['read', 'list'],
  restauration: ['read', 'list'],
  rapport: ['read', 'generate', 'export'],
});

/**
 * Export de tous les rôles pour utilisation dans le plugin Better Auth
 */
export const roles = {
  user,
  superadmin,
  admin,
  vendeur,
  recouvreur,
  caissier_principal,
  acp,
  controleur,
  superviseur,
  chef_div_restaurant,
  repreneur,
} as const;

/**
 * Types dérivés pour utilisation TypeScript
 */
export type RoleName = keyof typeof roles;
export type RolePermissions<R extends RoleName> = typeof roles[R];

/**
 * Énumération des noms de rôles pour utilisation dans les guards NestJS
 */
export enum USER_ROLE {
  USER = 'user',
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  VENDEUR = 'vendeur',
  RECOUVREUR = 'recouvreur',
  CAISSIER_PRINCIPAL = 'caissier_principal',
  ACP = 'acp',
  CONTROLEUR = 'controleur',
  SUPERVISEUR = 'superviseur',
  CHEF_DIV_RESTAURANT = 'chef_div_restaurant',
  REPRENEUR = 'repreneur',
}
