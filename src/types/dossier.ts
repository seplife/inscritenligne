export type NiveauScolaire = '6ème' | '5ème' | '4ème' | '3ème' | '2nde' | '1ère' | 'Terminale';

export type StatutDossier = 'recu' | 'verification' | 'valide' | 'rejete';

export interface DossierEleve {
  id?: number;
  ref: string; // Ex: ED-2026-1042
  recuLe: string; // Date ISO
  statut: StatutDossier;
  notesAdmin?: string;

  // Identité Élève
  nom: string;
  niveau: NiveauScolaire;
  classe?: string; // Ex: 3ème 1, Tle D2
  sexe: 'M' | 'F';
  naissDate: string;
  naissLieu: string;
  nationalite: string;
  quartier?: string;
  photoUrl?: string; // Image base64 ou URL

  // Résidence Divo
  chezQui: 'Père' | 'Mère' | 'Tuteur' | 'Seul';
  autrePersonneNom?: string;
  autrePersonneClasse?: string;

  // Scolarité antérieure
  etabOrigine?: string;
  classeSuivie?: string;
  mga?: string; // Moyenne Générale Annuelle

  // Parents
  pereNom?: string;
  mereNom?: string;
  pereProf?: string;
  mereProf?: string;
  pereDom?: string;
  mereDom?: string;
  pereContact?: string;
  mereContact?: string;
  parentsEnsemble?: 'oui' | 'non';
  nbFreres?: number;
  occupeScolarite?: 'Père' | 'Mère' | 'Autre';
  occupeScolaritePrecision?: string;
  orphelinPere: boolean;
  orphelinMere: boolean;

  // Tuteur Divo (résidant obligatoirement à Divo)
  tutNom?: string;
  tutProf?: string;
  tutQuartier?: string;
  tutLien?: string;
  tutContact?: string;

  // Santé
  probSante: 'oui' | 'non';
  santePathologies: string[]; // Yeux, Hernie, Epilepsie, Oreille, Coeur, Asthme, Drepanocytose
  santeAutre?: string;

  // Contrôle pièces physiques
  docsFournis: string[];

  // Situation financière (frais de scolarité)
  montantTotal?: number; // Montant total dû pour l'année (FCFA)
  montantPaye?: number; // Montant déjà versé (FCFA)
  prochainPaiementDate?: string; // Date ISO du prochain versement attendu
}

// Grille tarifaire indicative par niveau (droits + scolarité annuelle), en FCFA
export const TARIFS_PAR_NIVEAU: Record<NiveauScolaire, number> = {
  '6ème': 100000,
  '5ème': 100000,
  '4ème': 115000,
  '3ème': 115000,
  '2nde': 135000,
  '1ère': 145000,
  Terminale: 165000,
};

// Montant restant à payer (jamais négatif)
export function getMontantRestant(dossier: Pick<DossierEleve, 'montantTotal' | 'montantPaye'>): number {
  const total = dossier.montantTotal ?? 0;
  const paye = dossier.montantPaye ?? 0;
  return Math.max(total - paye, 0);
}

// Un dossier est considéré "soldé" si un montant total a été fixé et intégralement payé
export function isDossierSolde(dossier: Pick<DossierEleve, 'montantTotal' | 'montantPaye'>): boolean {
  const total = dossier.montantTotal ?? 0;
  const paye = dossier.montantPaye ?? 0;
  return total > 0 && paye >= total;
}

// Formatage d'un montant en FCFA (Ex: 1 000 000 FCFA)
export function formatFCFA(montant: number | undefined | null): string {
  const valeur = montant ?? 0;
  return `${valeur.toLocaleString('fr-FR')} FCFA`;
}

export const LISTE_DOCUMENTS_REQUIS = [
  { id: 'Acte de naissance', label: "Extrait d'acte de naissance" },
  { id: 'Livret scolaire', label: 'Livret scolaire' },
  { id: 'Chemise cartonnée', label: 'Une chemise cartonnée' },
  { id: 'CNI parent', label: 'Photocopie de la CNI du parent résidant à Divo' },
  { id: 'Reçu inscription', label: "Photocopie du reçu de l'inscription en ligne" },
  { id: 'Bulletin', label: 'Un bulletin de notes et sa photocopie' },
  { id: 'Macaron', label: 'Macaron de l’établissement' },
  { id: 'Carnet', label: 'Carnet de correspondance' },
  { id: 'T-shirt', label: 'T-shirt de l’établissement' },
  { id: 'Affecte', label: "Fiche d'affecté(e) d'État (le cas échéant)" },
  { id: 'Carte acces', label: "Carte d'accès scolaire" },
];

export const NIVEAUX_SCOLAIRES: NiveauScolaire[] = [
  '6ème',
  '5ème',
  '4ème',
  '3ème',
  '2nde',
  '1ère',
  'Terminale',
];

export const PATHOLOGIES_LISTE = [
  'Yeux',
  'Hernie',
  'Epilepsie',
  'Oreille',
  'Coeur',
  'Asthme',
  'Drepanocytose',
];
