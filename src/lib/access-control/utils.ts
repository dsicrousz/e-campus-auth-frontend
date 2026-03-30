import { type RoleName, UserRole } from './roles';
import { type Resource } from './statements';

/**
 * Convertit un nom de rôle en valeur d'énumération
 */
export function getRoleEnum(roleName: RoleName): UserRole {
  return UserRole[roleName.toUpperCase() as keyof typeof UserRole];
}

/**
 * Vérifie si un rôle est un rôle administrateur
 */
export function isAdminRole(role: RoleName): boolean {
  return role === 'superadmin' || role === 'admin';
}

/**
 * Vérifie si un rôle est un rôle de chef (chef de département)
 */
export function isChefRole(role: RoleName): boolean {
  return role.startsWith('chef_');
}

/**
 * Obtient la liste des ressources accessibles par un rôle
 */
export function getRoleResources(role: RoleName): Resource[] {
  const resourceMap: Record<RoleName, Resource[]> = {
    user: ['vente', 'rapport'],
    superadmin: [
      'user',
      'session',
      'vente',
      'caisse',
      'restaurant',
      'codification',
      'sport',
      'recouvrement',
      'reprise',
      'controle',
      'rapport',
    ],
    admin: [
      'user',
      'session',
      'vente',
      'caisse',
      'restaurant',
      'codification',
      'sport',
      'recouvrement',
      'reprise',
      'controle',
      'rapport',
    ],
    vendeur: ['vente', 'rapport'],
    caissier: ['caisse', 'vente', 'rapport'],
    acp: ['vente', 'caisse', 'rapport'],
    controleur: ['controle', 'vente', 'caisse', 'rapport'],
    recouvreur: ['recouvrement', 'vente', 'rapport'],
    repreuneur: ['reprise', 'vente', 'rapport'],
    chef_restaurant: ['restaurant', 'vente', 'rapport'],
    chef_codification: ['codification', 'vente', 'rapport'],
    chef_sport: ['sport', 'vente', 'rapport'],
  };

  return resourceMap[role] || [];
}

/**
 * Matrice de permissions pour affichage dans l'UI
 */
export const permissionMatrix = {
  user: {
    description: 'Utilisateur standard - Lecture seule',
    level: 1,
  },
  vendeur: {
    description: 'Gestion des ventes',
    level: 2,
  },
  caissier: {
    description: 'Gestion de la caisse',
    level: 2,
  },
  recouvreur: {
    description: 'Gestion des recouvrements',
    level: 2,
  },
  repreuneur: {
    description: 'Gestion des reprises',
    level: 2,
  },
  acp: {
    description: 'Agent Commercial Principal',
    level: 3,
  },
  controleur: {
    description: 'Contrôle et validation',
    level: 3,
  },
  chef_restaurant: {
    description: 'Chef du restaurant',
    level: 3,
  },
  chef_codification: {
    description: 'Chef de la codification',
    level: 3,
  },
  chef_sport: {
    description: 'Chef du sport',
    level: 3,
  },
  admin: {
    description: 'Administrateur - Gestion des utilisateurs',
    level: 4,
  },
  superadmin: {
    description: 'Super Administrateur - Accès complet',
    level: 5,
  },
} as const;
