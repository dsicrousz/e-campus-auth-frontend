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
  
  // Ressources métier personnalisées
  vente: [...crudActions, 'validate'],
  caisse: ['open', 'close', 'read', 'reconcile', 'list'],
  restaurant: [...crudActions, 'manage'],
  codification: [...crudActions],
  sport: [...crudActions, 'manage'],
  recouvrement: ['create', 'read', 'update', 'list', 'validate'],
  reprise: ['create', 'read', 'update', 'list', 'validate'],
  controle: ['read', 'validate', 'reject', 'list'],
  rapport: ['generate', 'read', 'export', 'list'],
} as const;

/**
 * Types dérivés pour utilisation TypeScript
 */
export type Statement = typeof statement;
export type Resource = keyof Statement;
export type Action<R extends Resource> = Statement[R][number];
