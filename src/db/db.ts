import { supabase } from '../lib/supabaseClient';
import type { DossierEleve } from '../types/dossier';

const TABLE = 'dossiers';

// Données initiales réalistes pour la démonstration
export const INITIAL_DEMO_DOSSIERS: Omit<DossierEleve, 'id'>[] = [
  {
    ref: 'ED-2026-0417',
    recuLe: '2026-09-10T09:30:00.000Z',
    statut: 'recu',
    nom: 'KOUAME Koffi Jean-Eudes',
    niveau: '3ème',
    classe: '3ème 2',
    sexe: 'M',
    naissDate: '2011-04-14',
    naissLieu: 'Divo',
    nationalite: 'Ivoirienne',
    quartier: 'Bada',
    chezQui: 'Père',
    pereNom: 'KOUAME N’Dri Michel',
    pereProf: 'Enseignant',
    pereDom: 'Divo Bada',
    pereContact: '07 07 88 12 34',
    mereNom: 'KOUADIO Aya Thérèse',
    mereProf: 'Commerçante',
    mereDom: 'Divo Bada',
    mereContact: '05 05 44 22 11',
    parentsEnsemble: 'oui',
    nbFreres: 3,
    occupeScolarite: 'Père',
    orphelinPere: false,
    orphelinMere: false,
    tutNom: 'KOUAME N’Dri Michel',
    tutProf: 'Enseignant',
    tutQuartier: 'Bada',
    tutLien: 'Père',
    tutContact: '07 07 88 12 34',
    probSante: 'non',
    santePathologies: [],
    etabOrigine: 'Collège Moderne Divo',
    classeSuivie: '4ème',
    mga: '13.45',
    docsFournis: [
      'Acte de naissance',
      'Livret scolaire',
      'Chemise cartonnée',
      'Reçu inscription',
    ],
    notesAdmin: 'Dossier pré-enregistré en ligne. En attente de la CNI du parent.',
    montantTotal: 115000,
    montantPaye: 50000,
    prochainPaiementDate: '2026-10-15',
  },
  {
    ref: 'ED-2026-1042',
    recuLe: '2026-09-12T14:15:00.000Z',
    statut: 'verification',
    nom: 'BAMBA Fatou Estelle',
    niveau: '2nde',
    classe: '2nde C1',
    sexe: 'F',
    naissDate: '2010-09-22',
    naissLieu: 'Gagnoa',
    nationalite: 'Ivoirienne',
    quartier: 'Konankro',
    chezQui: 'Tuteur',
    pereNom: 'BAMBA Souleymane',
    pereProf: 'Planteur',
    pereDom: 'Gagnoa',
    pereContact: '01 02 33 44 55',
    mereNom: 'DIOMANDE Mariam',
    mereProf: 'Ménagère',
    mereDom: 'Gagnoa',
    mereContact: '07 48 55 66 77',
    parentsEnsemble: 'oui',
    nbFreres: 4,
    occupeScolarite: 'Autre',
    occupeScolaritePrecision: 'Tuteur à Divo',
    orphelinPere: false,
    orphelinMere: false,
    tutNom: 'TRAORE Bakary',
    tutProf: 'Fonctionnaire DRENA Divo',
    tutQuartier: 'Konankro',
    tutLien: 'Oncle maternel',
    tutContact: '07 59 11 22 33',
    probSante: 'oui',
    santePathologies: ['Yeux', 'Asthme'],
    santeAutre: 'Port de verres correcteurs obligatoires en classe',
    etabOrigine: 'Lycée Moderne 1 Divo',
    classeSuivie: '3ème',
    mga: '14.80',
    docsFournis: [
      'Acte de naissance',
      'Livret scolaire',
      'Chemise cartonnée',
      'CNI parent',
      'Reçu inscription',
      'Bulletin',
      'Macaron',
      'Carnet',
    ],
    notesAdmin: 'Pièces physiques déposées. Vérification de l’authentification du bulletin en cours.',
    montantTotal: 135000,
    montantPaye: 135000,
  },
  {
    ref: 'ED-2026-1893',
    recuLe: '2026-09-08T11:00:00.000Z',
    statut: 'valide',
    nom: 'KONAN Yao Christian',
    niveau: 'Terminale',
    classe: 'Tle D1',
    sexe: 'M',
    naissDate: '2008-01-05',
    naissLieu: 'Divo',
    nationalite: 'Ivoirienne',
    quartier: 'Libreville',
    chezQui: 'Mère',
    pereNom: 'KONAN Kouadio',
    pereProf: 'Décédé',
    pereDom: 'Divo',
    mereNom: 'AMANI Akissi Jeanne',
    mereProf: 'Infirmière',
    mereDom: 'Divo Libreville',
    mereContact: '07 08 99 00 11',
    parentsEnsemble: 'non',
    nbFreres: 2,
    occupeScolarite: 'Mère',
    orphelinPere: true,
    orphelinMere: false,
    tutNom: 'AMANI Akissi Jeanne',
    tutProf: 'Infirmière',
    tutQuartier: 'Libreville',
    tutLien: 'Mère',
    tutContact: '07 08 99 00 11',
    probSante: 'non',
    santePathologies: [],
    etabOrigine: 'Cours Secondaire Elites Divo',
    classeSuivie: '1ère D',
    mga: '15.20',
    docsFournis: [
      'Acte de naissance',
      'Livret scolaire',
      'Chemise cartonnée',
      'CNI parent',
      'Reçu inscription',
      'Bulletin',
      'Macaron',
      'Carnet',
      'T-shirt',
      'Carte acces',
    ],
    notesAdmin: 'Dossier complet et validé. Carte scolaire et macaron délivrés.',
    montantTotal: 165000,
    montantPaye: 100000,
    prochainPaiementDate: '2026-11-01',
  },
  {
    ref: 'ED-2026-2401',
    recuLe: '2026-09-14T16:40:00.000Z',
    statut: 'rejete',
    nom: 'TOURE Aminata Grace',
    niveau: '6ème',
    classe: '6ème 3',
    sexe: 'F',
    naissDate: '2014-11-18',
    naissLieu: 'Abidjan',
    nationalite: 'Ivoirienne',
    quartier: 'Plateau Divo',
    chezQui: 'Tuteur',
    pereNom: 'TOURE Brahima',
    pereProf: 'Commerçant',
    pereDom: 'Abidjan Adjamé',
    pereContact: '01 02 03 04 05',
    mereNom: 'KONE Fanta',
    mereProf: 'Couturière',
    mereDom: 'Abidjan',
    mereContact: '05 06 07 08 09',
    parentsEnsemble: 'oui',
    nbFreres: 5,
    occupeScolarite: 'Père',
    orphelinPere: false,
    orphelinMere: false,
    tutNom: 'KOUASSI Yao',
    tutProf: 'Mécanicien',
    tutQuartier: 'Plateau',
    tutLien: 'Connaissance famille',
    tutContact: '07 12 34 56 78',
    probSante: 'non',
    santePathologies: [],
    etabOrigine: 'EPP Plateau Divo',
    classeSuivie: 'CM2',
    mga: '132.5 pts CEPE',
    docsFournis: ['Acte de naissance'],
    notesAdmin:
      'Dossier incomplet : Manque la CNI du parent, le relevé de notes CEPE original et le livret scolaire.',
    montantTotal: 100000,
    montantPaye: 0,
    prochainPaiementDate: '2026-09-30',
  },
];

// Générateur de référence unique au format ED-2026-XXXX
export function generateReference(): string {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `ED-2026-${randNum}`;
}

// Récupère tous les dossiers, triés du plus récent au plus ancien
export async function getAllDossiers(): Promise<DossierEleve[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('recuLe', { ascending: false });

  if (error) {
    console.error('Erreur chargement dossiers (Supabase):', error);
    throw error;
  }
  return (data ?? []) as DossierEleve[];
}

// Ajoute un nouveau dossier et retourne son id généré par la base
export async function addDossier(dossier: Omit<DossierEleve, 'id'>): Promise<number> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(dossier)
    .select('id')
    .single();

  if (error) {
    console.error('Erreur ajout dossier (Supabase):', error);
    throw error;
  }
  return data.id as number;
}

// Met à jour un ou plusieurs champs d'un dossier
export async function updateDossier(
  id: number,
  changes: Partial<DossierEleve>
): Promise<void> {
  const { error } = await supabase.from(TABLE).update(changes).eq('id', id);
  if (error) {
    console.error('Erreur mise à jour dossier (Supabase):', error);
    throw error;
  }
}

// Supprime définitivement un dossier
export async function deleteDossier(id: number): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) {
    console.error('Erreur suppression dossier (Supabase):', error);
    throw error;
  }
}

// Récupère un dossier par sa référence EXACTE, avec uniquement les champs
// nécessaires à la page publique de vérification (scan du QR code).
// Volontairement limité : ne renvoie ni les contacts des parents/tuteur,
// ni les notes internes du secrétariat.
export type DossierVerification = Pick<
  DossierEleve,
  | 'ref'
  | 'nom'
  | 'niveau'
  | 'classe'
  | 'statut'
  | 'montantTotal'
  | 'montantPaye'
  | 'prochainPaiementDate'
>;

export async function getDossierForVerification(
  ref: string
): Promise<DossierVerification | null> {
  const q = ref.trim();
  if (!q) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .select('ref, nom, niveau, classe, statut, montantTotal, montantPaye, prochainPaiementDate')
    .ilike('ref', q)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Erreur vérification dossier (Supabase):', error);
    throw error;
  }
  return (data as DossierVerification) ?? null;
}

// Recherche par référence exacte ou par nom (utilisé par la page Suivi)
export async function findDossier(query: string): Promise<DossierEleve | null> {
  const q = query.trim();
  if (!q) return null;

  // 1. Recherche exacte par référence (insensible à la casse)
  const { data: byRef, error: errRef } = await supabase
    .from(TABLE)
    .select('*')
    .ilike('ref', q)
    .limit(1)
    .maybeSingle();

  if (errRef) {
    console.error('Erreur recherche par référence (Supabase):', errRef);
  }
  if (byRef) return byRef as DossierEleve;

  // 2. Recherche par nom (contient)
  const { data: byNom, error: errNom } = await supabase
    .from(TABLE)
    .select('*')
    .ilike('nom', `%${q}%`)
    .limit(1)
    .maybeSingle();

  if (errNom) {
    console.error('Erreur recherche par nom (Supabase):', errNom);
    return null;
  }
  return (byNom as DossierEleve) ?? null;
}

// Réinitialisation avec les dossiers d'exemple (efface tout puis réinsère les démos)
export async function resetDatabaseWithSamples(): Promise<void> {
  const { error: delError } = await supabase.from(TABLE).delete().gte('id', 0);
  if (delError) {
    console.error('Erreur réinitialisation (suppression) Supabase:', delError);
    throw delError;
  }
  const { error: insError } = await supabase.from(TABLE).insert(INITIAL_DEMO_DOSSIERS);
  if (insError) {
    console.error('Erreur réinitialisation (insertion) Supabase:', insError);
    throw insError;
  }
}

// Initialise la base avec les dossiers démo si elle est vide (ne s'exécute qu'une fois globalement)
export async function initDatabase(): Promise<void> {
  const { count, error } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Erreur vérification base Supabase:', error);
    return;
  }
  if (count === 0) {
    const { error: insError } = await supabase.from(TABLE).insert(INITIAL_DEMO_DOSSIERS);
    if (insError) {
      console.error('Erreur initialisation dossiers démo (Supabase):', insError);
    } else {
      console.log('Base de données Supabase initialisée avec les dossiers démo.');
    }
  }
}
