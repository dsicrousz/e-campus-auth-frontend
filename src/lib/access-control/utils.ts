import { type RoleName, USER_ROLE } from './roles';
import { type Resource } from './statements';

/**
 * Convertit un nom de rôle en valeur d'énumération
 */
export function getRoleEnum(roleName: RoleName): USER_ROLE {
  return USER_ROLE[roleName.toUpperCase() as keyof typeof USER_ROLE];
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
    user: ['rapport'],
    superadmin: [
      'user',
      'session',
      'ticket',
      'controle_acces',
      'planning_controle',
      'restauration',
      'caisse',
      'comptabilite',
      'recouvrement',
      'reprise',
      'rapport',
    ],
    admin: [
      'user',
      'session',
      'ticket',
      'controle_acces',
      'planning_controle',
      'restauration',
      'caisse',
      'comptabilite',
      'recouvrement',
      'reprise',
      'rapport',
    ],
    vendeur: ['ticket', 'rapport'],
    recouvreur: ['recouvrement', 'rapport'],
    caissier_principal: ['caisse', 'ticket', 'rapport'],
    acp: ['comptabilite', 'caisse', 'ticket', 'rapport'],
    controleur: ['ticket', 'controle_acces', 'rapport'],
    superviseur: ['ticket', 'controle_acces', 'planning_controle', 'restauration', 'rapport'],
    chef_div_restaurant: ['ticket', 'controle_acces', 'planning_controle', 'restauration', 'rapport'],
    repreneur: ['reprise', 'ticket', 'restauration', 'rapport'],
  };

  return resourceMap[role] || [];
}

/**
 * Matrice de permissions pour affichage dans l'UI
 */
export const permissionMatrix = {
  user: {
    description: 'Compte générique authentifié',
    level: 1,
  },
  vendeur: {
    description: 'Vente de tickets de restauration',
    level: 2,
  },
  recouvreur: {
    description: 'Recouvrement des créances',
    level: 2,
  },
  caissier_principal: {
    description: 'Gestion de la caisse physique',
    level: 2,
  },
  repreneur: {
    description: 'Facturation des restaurants assignés',
    level: 2,
  },
  acp: {
    description: 'Agent Comptable Principal — comptabilité',
    level: 3,
  },
  controleur: {
    description: "Contrôle d'accès — scanner/consommer les tickets",
    level: 3,
  },
  superviseur: {
    description: 'Supervision restaurants + planning de contrôle',
    level: 3,
  },
  chef_div_restaurant: {
    description: 'Restauration et contrôle (division)',
    level: 4,
  },
  admin: {
    description: 'Lecture globale, pas de modification',
    level: 4,
  },
  superadmin: {
    description: 'Accès complet à toutes les ressources',
    level: 5,
  },
} as const;
