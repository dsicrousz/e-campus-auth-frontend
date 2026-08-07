import { defaultStatements } from 'better-auth/plugins/admin/access';

/**
 * Actions CRUD standard
 */
const crudActions = ['create', 'read', 'update', 'delete', 'list'] as const;

/**
 * Définition des ressources et actions disponibles
 * Basé sur Better Auth Access Control
 */
export const statement = {
  ...defaultStatements, // user, session permissions par défaut

  // Tickets de restauration
  ticket: [...crudActions, 'consume', 'validate'],

  // Contrôle d'accès aux restaurants
  controle_acces: ['read', 'check', 'validate', 'reject', 'list', 'assign'],

  // Planning des contrôleurs
  planning_controle: [...crudActions, 'assign'],

  // Service de restauration (menus, plats, fréquentation)
  restauration: ['manage', 'read', 'update', 'list'],

  // Caisse physique
  caisse: ['open', 'close', 'read', 'reconcile', 'list'],

  // Comptabilité (réconciliation, exports financiers)
  comptabilite: ['read', 'export', 'reconcile', 'list', 'validate'],

  // Recouvrement des créances
  recouvrement: ['create', 'read', 'update', 'list', 'validate'],

  // Reprise / facturation des restaurants assignés
  reprise: ['read', 'list', 'generate', 'export'],

  // Rapports transverses
  rapport: ['generate', 'read', 'export', 'list'],
} as const;

/**
 * Types dérivés pour utilisation TypeScript
 */
export type Statement = typeof statement;
export type Resource = keyof Statement;
export type Action<R extends Resource> = Statement[R][number];
