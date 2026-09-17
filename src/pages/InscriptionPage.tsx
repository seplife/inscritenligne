import React, { useState } from 'react';
import type {
  DossierEleve,
  NiveauScolaire,
} from '../types/dossier';
import {
  NIVEAUX_SCOLAIRES,
  PATHOLOGIES_LISTE,
  LISTE_DOCUMENTS_REQUIS,
  TARIFS_PAR_NIVEAU,
} from '../types/dossier';
import { addDossier, generateReference } from '../db/db';
import { ReceiptModal } from '../components/ReceiptModal';
import type { PageId } from '../components/Header';
import confetti from 'canvas-confetti';
import {
  User,
  MapPin,
  Users,
  HeartPulse,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Camera,
  Upload,
  AlertCircle,
  Printer,
  Search,
} from 'lucide-react';

interface InscriptionPageProps {
  onNavigate: (page: PageId) => void;
}

export const InscriptionPage: React.FC<InscriptionPageProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Form State
  const [nom, setNom] = useState('');
  const [niveau, setNiveau] = useState<NiveauScolaire>('6ème');
  const [classe, setClasse] = useState('');
  const [sexe, setSexe] = useState<'M' | 'F'>('M');
  const [naissDate, setNaissDate] = useState('');
  const [naissLieu, setNaissLieu] = useState('');
  const [nationalite, setNationalite] = useState('Ivoirienne');
  const [quartier, setQuartier] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  // Résidence & Antécédents
  const [chezQui, setChezQui] = useState<'Père' | 'Mère' | 'Tuteur' | 'Seul'>('Père');
  const [autrePersonne, setAutrePersonne] = useState<'oui' | 'non'>('non');
  const [autrePersonneNom, setAutrePersonneNom] = useState('');
  const [autrePersonneClasse, setAutrePersonneClasse] = useState('');
  const [etabOrigine, setEtabOrigine] = useState('');
  const [classeSuivie, setClasseSuivie] = useState('');
  const [mga, setMga] = useState('');

  // Parents
  const [pereNom, setPereNom] = useState('');
  const [pereProf, setPereProf] = useState('');
  const [pereDom, setPereDom] = useState('');
  const [pereContact, setPereContact] = useState('');
  const [mereNom, setMereNom] = useState('');
  const [mereProf, setMereProf] = useState('');
  const [mereDom, setMereDom] = useState('');
  const [mereContact, setMereContact] = useState('');
  const [parentsEnsemble, setParentsEnsemble] = useState<'oui' | 'non'>('oui');
  const [nbFreres, setNbFreres] = useState<number>(0);
  const [occupeScolarite, setOccupeScolarite] = useState<'Père' | 'Mère' | 'Autre'>('Père');
  const [occupeScolaritePrecision, setOccupeScolaritePrecision] = useState('');
  const [orphelinPere, setOrphelinPere] = useState(false);
  const [orphelinMere, setOrphelinMere] = useState(false);

  // Tuteur Divo
  const [tutNom, setTutNom] = useState('');
  const [tutProf, setTutProf] = useState('');
  const [tutQuartier, setTutQuartier] = useState('');
  const [tutLien, setTutLien] = useState('');
  const [tutContact, setTutContact] = useState('');

  // Santé
  const [probSante, setProbSante] = useState<'oui' | 'non'>('non');
  const [santePathologies, setSantePathologies] = useState<string[]>([]);
  const [santeAutre, setSanteAutre] = useState('');

  // Documents cochés
  const [docsFournis, setDocsFournis] = useState<string[]>([
    'Acte de naissance',
    'Reçu inscription',
  ]);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdDossier, setCreatedDossier] = useState<DossierEleve | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Photo Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("L'image est trop volumineuse. Veuillez choisir une photo de moins de 2 Mo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        setPhotoUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Pathologies toggle
  const togglePathologie = (pat: string) => {
    setSantePathologies(prev =>
      prev.includes(pat) ? prev.filter(p => p !== pat) : [...prev, pat]
    );
  };

  // Documents toggle
  const toggleDoc = (docId: string) => {
    setDocsFournis(prev =>
      prev.includes(docId) ? prev.filter(d => d !== docId) : [...prev, docId]
    );
  };

  // Validation step check
  const validateStep = (step: number): boolean => {
    setErrorMsg(null);
    if (step === 1) {
      if (!nom.trim()) {
        setErrorMsg('Le nom et prénoms de l’élève sont obligatoires.');
        return false;
      }
      if (!naissDate) {
        setErrorMsg('La date de naissance est obligatoire.');
        return false;
      }
      if (!naissLieu.trim()) {
        setErrorMsg('Le lieu de naissance est obligatoire.');
        return false;
      }
      if (!nationalite.trim()) {
        setErrorMsg('La nationalité est obligatoire.');
        return false;
      }
    } else if (step === 3) {
      if (!pereContact && !mereContact && !tutContact) {
        setErrorMsg('Veuillez renseigner au moins un numéro de téléphone de contact (Père ou Mère).');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Final submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const ref = generateReference();
      const newDossier: DossierEleve = {
        ref,
        recuLe: new Date().toISOString(),
        statut: 'recu',
        nom: nom.trim(),
        niveau,
        classe: classe.trim(),
        sexe,
        naissDate,
        naissLieu: naissLieu.trim(),
        nationalite: nationalite.trim(),
        quartier: quartier.trim(),
        photoUrl,
        chezQui,
        autrePersonneNom: autrePersonne === 'oui' ? autrePersonneNom.trim() : undefined,
        autrePersonneClasse: autrePersonne === 'oui' ? autrePersonneClasse.trim() : undefined,
        etabOrigine: etabOrigine.trim(),
        classeSuivie: classeSuivie.trim(),
        mga: mga.trim(),
        pereNom: pereNom.trim(),
        pereProf: pereProf.trim(),
        pereDom: pereDom.trim(),
        pereContact: pereContact.trim(),
        mereNom: mereNom.trim(),
        mereProf: mereProf.trim(),
        mereDom: mereDom.trim(),
        mereContact: mereContact.trim(),
        parentsEnsemble,
        nbFreres: Number(nbFreres) || 0,
        occupeScolarite,
        occupeScolaritePrecision: occupeScolarite === 'Autre' ? occupeScolaritePrecision.trim() : undefined,
        orphelinPere,
        orphelinMere,
        tutNom: tutNom.trim(),
        tutProf: tutProf.trim(),
        tutQuartier: tutQuartier.trim(),
        tutLien: tutLien.trim(),
        tutContact: tutContact.trim(),
        probSante,
        santePathologies: probSante === 'oui' ? santePathologies : [],
        santeAutre: probSante === 'oui' ? santeAutre.trim() : undefined,
        docsFournis,
        notesAdmin: 'Fiche soumise via le portail web ElitesEduca+.',
        montantTotal: TARIFS_PAR_NIVEAU[niveau],
        montantPaye: 0,
      };

      const id = await addDossier(newDossier);
      newDossier.id = id;

      setCreatedDossier(newDossier);
      setShowReceiptModal(true);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6E1423', '#D9A61E', '#2F6B3A'],
        });
      } catch (err) {
        // Safe fallback
      }
    } catch (err) {
      console.error('Erreur enregistrement dossier:', err);
      setErrorMsg("Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCreatedDossier(null);
    setCurrentStep(1);
    setNom('');
    setClasse('');
    setNaissDate('');
    setNaissLieu('');
    setQuartier('');
    setPhotoUrl(undefined);
    setEtabOrigine('');
    setClasseSuivie('');
    setMga('');
    setPereNom('');
    setPereProf('');
    setPereDom('');
    setPereContact('');
    setMereNom('');
    setMereProf('');
    setMereDom('');
    setMereContact('');
    setTutNom('');
    setTutProf('');
    setTutQuartier('');
    setTutLien('');
    setTutContact('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header title */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-[#D9A61E] bg-[#D9A61E]/10 px-3 py-1 rounded-full border border-[#D9A61E]/30">
          Année scolaire 2026 – 2027
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#450C15]">
          Fiche d'inscription et de suivi individuel
        </h1>
        <p className="text-sm text-[#6B5B4E] max-w-xl mx-auto">
          Remplissez les informations de l'élève ci-dessous. Les champs signalés par un astérisque (*)
          sont obligatoires.
        </p>
      </div>

      {/* If dossier was just created successfully */}
      {createdDossier ? (
        <div className="bg-white rounded-lg border-2 border-[#2F6B3A] p-8 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-[#2F6B3A]/10 text-[#2F6B3A] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-serif font-bold text-[#1E4A28]">
              Fiche d'inscription enregistrée avec succès !
            </h2>
            <p className="text-sm text-[#6B5B4E]">
              Le dossier de l'élève <strong>{createdDossier.nom}</strong> a été enregistré sous le numéro officiel :
            </p>
          </div>

          <div className="inline-block bg-[#FBF6EA] border-2 border-[#D9A61E] px-6 py-3 rounded-sm">
            <div className="text-xs uppercase text-gray-500 font-semibold tracking-wider">
              Votre Numéro de dossier
            </div>
            <div className="font-mono text-3xl font-bold text-[#6E1423] tracking-widest mt-0.5">
              {createdDossier.ref}
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="max-w-md mx-auto pt-4">
            <div className="flex items-center justify-between text-xs font-semibold text-[#6B5B4E] mb-2">
              <span className="text-[#2F6B3A] font-bold">1. Reçu en ligne ✓</span>
              <span className="text-gray-400">2. Dépôt physique</span>
              <span className="text-gray-400">3. Validé</span>
            </div>
            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#2F6B3A] h-full w-1/3 rounded-full" />
            </div>
          </div>

          <p className="text-xs text-[#6B5B4E] max-w-lg mx-auto leading-relaxed bg-[#FFFDF8] p-4 rounded-sm border border-[#E7DCC7]">
            <strong>Prochaine étape :</strong> Imprimez le récépissé officiel ou notez soigneusement
            votre numéro. Présentez-vous ensuite au secrétariat du <strong>Cours Secondaire Elites Divo</strong>
            muni des pièces requises pour la validation définitive.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setShowReceiptModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#6E1423] hover:bg-[#450C15] text-[#F4D889] font-bold text-sm rounded-sm shadow-md transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Afficher & Imprimer le récépissé</span>
            </button>

            <button
              onClick={() => onNavigate('suivi')}
              className="inline-flex items-center gap-2 px-5 py-3 border border-[#6E1423] text-[#6E1423] hover:bg-[#FBF6EA] font-semibold text-sm rounded-sm transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Accéder au suivi en ligne</span>
            </button>

            <button
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-gray-800 underline block w-full mt-2 cursor-pointer"
            >
              Inscrire un autre élève
            </button>
          </div>
        </div>
      ) : (
        /* Stepper Form */
        <div className="bg-white rounded-lg border border-[#E7DCC7] shadow-xl overflow-hidden">
          {/* Stepper Tabs Header */}
          <div className="bg-[#450C15] text-white p-4 sm:p-6 border-b border-[#D9A61E]/40">
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 sm:pb-0">
              {[
                { step: 1, label: 'Élève', icon: User },
                { step: 2, label: 'Résidence', icon: MapPin },
                { step: 3, label: 'Parents', icon: Users },
                { step: 4, label: 'Tuteur & Santé', icon: HeartPulse },
                { step: 5, label: 'Pièces & Validation', icon: FileCheck },
              ].map(item => {
                const isDone = currentStep > item.step;
                const isCurrent = currentStep === item.step;

                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => {
                      if (item.step < currentStep) setCurrentStep(item.step);
                    }}
                    className={`flex items-center gap-2 text-xs font-semibold py-1.5 px-3 rounded-sm transition-all whitespace-nowrap ${
                      isCurrent
                        ? 'bg-[#D9A61E] text-[#450C15] font-bold shadow-xs'
                        : isDone
                        ? 'text-[#F4D889] hover:text-white cursor-pointer'
                        : 'text-white/40 cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-[#450C15] text-[#F4D889]'
                          : isDone
                          ? 'bg-[#2F6B3A] text-white'
                          : 'bg-white/20 text-white/60'
                      }`}
                    >
                      {isDone ? '✓' : item.step}
                    </span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
            {/* Progress bar */}
            <div className="w-full bg-black/30 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-[#D9A61E] h-full transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Error notice */}
          {errorMsg && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xs flex items-center gap-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* STEP 1: IDENTITÉ DE L'ÉLÈVE */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in-50 duration-150">
                <div className="border-b border-[#E7DCC7] pb-3">
                  <h2 className="text-xl font-serif font-bold text-[#450C15]">
                    1. Identité de l'élève
                  </h2>
                  <p className="text-xs text-[#6B5B4E]">
                    Renseignez scrupuleusement les informations conformes à l'extrait d'acte de naissance.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-[#450C15] uppercase">
                      Nom et prénoms de l'élève *
                    </label>
                    <input
                      type="text"
                      required
                      value={nom}
                      onChange={e => setNom(e.target.value)}
                      placeholder="Ex : KOUAME Koffi Jean-Eudes"
                      className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9A61E] focus:border-[#6E1423]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#450C15] uppercase">
                      Niveau d'inscription *
                    </label>
                    <select
                      value={niveau}
                      onChange={e => setNiveau(e.target.value as NiveauScolaire)}
                      className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9A61E]"
                    >
                      {NIVEAUX_SCOLAIRES.map(n => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#450C15] uppercase">
                      Classe souhaitée / Série
                    </label>
                    <input
                      type="text"
                      value={classe}
                      onChange={e => setClasse(e.target.value)}
                      placeholder="Ex : 3ème 2, 2nde C, Tle D"
                      className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9A61E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#450C15] uppercase">Sexe *</label>
                    <div className="flex gap-6 pt-2">
                      <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="sexe"
                          value="M"
                          checked={sexe === 'M'}
                          onChange={() => setSexe('M')}
                          className="accent-[#6E1423] w-4 h-4"
                        />
                        <span>Masculin (Garçon)</span>
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="sexe"
                          value="F"
                          checked={sexe === 'F'}
                          onChange={() => setSexe('F')}
                          className="accent-[#6E1423] w-4 h-4"
                        />
                        <span>Féminin (Fille)</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#450C15] uppercase">
                      Date de naissance *
                    </label>
                    <input
                      type="date"
                      required
                      value={naissDate}
                      onChange={e => setNaissDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9A61E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#450C15] uppercase">
                      Lieu de naissance *
                    </label>
                    <input
                      type="text"
                      required
                      value={naissLieu}
                      onChange={e => setNaissLieu(e.target.value)}
                      placeholder="Ex : Divo, Gagnoa, Abidjan"
                      className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9A61E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#450C15] uppercase">
                      Nationalité *
                    </label>
                    <input
                      type="text"
                      required
                      value={nationalite}
                      onChange={e => setNationalite(e.target.value)}
                      placeholder="Ex : Ivoirienne"
                      className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9A61E]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#450C15] uppercase">
                      Quartier de résidence à Divo
                    </label>
                    <input
                      type="text"
                      value={quartier}
                      onChange={e => setQuartier(e.target.value)}
                      placeholder="Ex : Bada, Libreville, Konankro, Plateau"
                      className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9A61E]"
                    />
                  </div>

                  {/* Photo de l'élève */}
                  <div className="sm:col-span-2 pt-2">
                    <label className="text-xs font-bold text-[#450C15] uppercase block mb-2">
                      Photo d'identité de l'élève (facultatif mais recommandé)
                    </label>
                    <div className="flex items-center gap-5 p-4 bg-[#FBF6EA] border border-dashed border-[#E7DCC7] rounded-sm">
                      <div className="w-24 h-28 bg-white border border-gray-300 rounded-sm flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                        {photoUrl ? (
                          <img
                            src={photoUrl}
                            alt="Aperçu photo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#6E1423] hover:bg-[#450C15] text-[#F4D889] text-xs font-semibold rounded-sm cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choisir une photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                        {photoUrl && (
                          <button
                            type="button"
                            onClick={() => setPhotoUrl(undefined)}
                            className="text-xs text-red-600 hover:underline block cursor-pointer"
                          >
                            Supprimer la photo
                          </button>
                        )}
                        <p className="text-[11px] text-[#6B5B4E]">
                          Formats acceptés : JPG, PNG (Max 2 Mo). Format type photo d'identité.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: RÉSIDENCE & SCOLARITÉ ANTÉRIEURE */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in-50 duration-150">
                <div className="border-b border-[#E7DCC7] pb-3">
                  <h2 className="text-xl font-serif font-bold text-[#450C15]">
                    2. Résidence à Divo & Scolarité antérieure
                  </h2>
                  <p className="text-xs text-[#6B5B4E]">
                    Le suivi du domicile à Divo est obligatoire pour tout élève inscrit.
                  </p>
                </div>

                <div className="space-y-4 bg-[#FBF6EA] p-4 rounded-sm border border-[#E7DCC7]">
                  <label className="text-xs font-bold text-[#450C15] uppercase block">
                    Chez qui vivez-vous à Divo ? *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(['Père', 'Mère', 'Tuteur', 'Seul'] as const).map(option => (
                      <label
                        key={option}
                        className={`p-3 rounded-sm border text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors ${
                          chezQui === option
                            ? 'bg-[#6E1423] text-[#F4D889] border-[#450C15]'
                            : 'bg-white text-[#221812] border-[#E7DCC7] hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="chezQui"
                          value={option}
                          checked={chezQui === option}
                          onChange={() => setChezQui(option)}
                          className="accent-[#D9A61E]"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#450C15] uppercase block">
                    Une autre personne, en dehors de vous, connaît-elle votre domicile ?
                  </label>
                  <div className="flex gap-6">
                    <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="autrePersonne"
                        value="non"
                        checked={autrePersonne === 'non'}
                        onChange={() => setAutrePersonne('non')}
                        className="accent-[#6E1423]"
                      />
                      <span>Non</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="autrePersonne"
                        value="oui"
                        checked={autrePersonne === 'oui'}
                        onChange={() => setAutrePersonne('oui')}
                        className="accent-[#6E1423]"
                      />
                      <span>Oui</span>
                    </label>
                  </div>

                  {autrePersonne === 'oui' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-sm">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">
                          Nom et prénoms de cette personne
                        </label>
                        <input
                          type="text"
                          value={autrePersonneNom}
                          onChange={e => setAutrePersonneNom(e.target.value)}
                          placeholder="Nom complet"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700">
                          Classe de cette personne (si élève)
                        </label>
                        <input
                          type="text"
                          value={autrePersonneClasse}
                          onChange={e => setAutrePersonneClasse(e.target.value)}
                          placeholder="Ex : 4ème 1"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Scolarité antérieure */}
                <div className="pt-4 border-t border-[#E7DCC7] space-y-4">
                  <h3 className="font-serif font-bold text-base text-[#450C15]">
                    Scolarité antérieure (année 2025 – 2026)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-[#450C15] uppercase">
                        Établissement d'origine
                      </label>
                      <input
                        type="text"
                        value={etabOrigine}
                        onChange={e => setEtabOrigine(e.target.value)}
                        placeholder="Ex : Collège Moderne Divo, EPP Plateau..."
                        className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#450C15] uppercase">
                        Classe suivie l'an passé
                      </label>
                      <input
                        type="text"
                        value={classeSuivie}
                        onChange={e => setClasseSuivie(e.target.value)}
                        placeholder="Ex : 5ème, 3ème, CM2"
                        className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#450C15] uppercase">
                        Moyenne Générale Annuelle (M.G.A.)
                      </label>
                      <input
                        type="text"
                        value={mga}
                        onChange={e => setMga(e.target.value)}
                        placeholder="Ex : 13.50 ou 125 pts CEPE"
                        className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: IDENTIFICATION DES PARENTS */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in-50 duration-150">
                <div className="border-b border-[#E7DCC7] pb-3">
                  <h2 className="text-xl font-serif font-bold text-[#450C15]">
                    3. Identification des parents
                  </h2>
                  <p className="text-xs text-[#6B5B4E]">
                    Ces contacts sont utilisés par le secrétariat pour les convocations et les urgences.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Père */}
                  <div className="p-4 bg-[#FFFDF8] border border-[#E7DCC7] rounded-sm space-y-3">
                    <h3 className="font-serif font-bold text-base text-[#6E1423] border-b border-[#E7DCC7] pb-1">
                      Père
                    </h3>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Nom et prénoms</label>
                      <input
                        type="text"
                        value={pereNom}
                        onChange={e => setPereNom(e.target.value)}
                        placeholder="Nom complet du père"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Profession</label>
                      <input
                        type="text"
                        value={pereProf}
                        onChange={e => setPereProf(e.target.value)}
                        placeholder="Ex : Enseignant, Commerçant, Planteur"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Domicile</label>
                      <input
                        type="text"
                        value={pereDom}
                        onChange={e => setPereDom(e.target.value)}
                        placeholder="Ville et quartier de résidence"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Contact téléphonique *</label>
                      <input
                        type="tel"
                        value={pereContact}
                        onChange={e => setPereContact(e.target.value)}
                        placeholder="Ex : 07 07 00 00 00"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                      />
                    </div>
                  </div>

                  {/* Mère */}
                  <div className="p-4 bg-[#FFFDF8] border border-[#E7DCC7] rounded-sm space-y-3">
                    <h3 className="font-serif font-bold text-base text-[#6E1423] border-b border-[#E7DCC7] pb-1">
                      Mère
                    </h3>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Nom et prénoms</label>
                      <input
                        type="text"
                        value={mereNom}
                        onChange={e => setMereNom(e.target.value)}
                        placeholder="Nom complet de la mère"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Profession</label>
                      <input
                        type="text"
                        value={mereProf}
                        onChange={e => setMereProf(e.target.value)}
                        placeholder="Ex : Ménagère, Couturière, Infirmière"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Domicile</label>
                      <input
                        type="text"
                        value={mereDom}
                        onChange={e => setMereDom(e.target.value)}
                        placeholder="Ville et quartier de résidence"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Contact téléphonique</label>
                      <input
                        type="tel"
                        value={mereContact}
                        onChange={e => setMereContact(e.target.value)}
                        placeholder="Ex : 05 05 00 00 00"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#E7DCC7]">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#450C15] uppercase block">
                      Vos deux parents vivent-ils ensemble ?
                    </label>
                    <div className="flex gap-6">
                      <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="parentsEnsemble"
                          value="oui"
                          checked={parentsEnsemble === 'oui'}
                          onChange={() => setParentsEnsemble('oui')}
                          className="accent-[#6E1423]"
                        />
                        <span>Oui</span>
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="parentsEnsemble"
                          value="non"
                          checked={parentsEnsemble === 'non'}
                          onChange={() => setParentsEnsemble('non')}
                          className="accent-[#6E1423]"
                        />
                        <span>Non</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#450C15] uppercase block">
                      Situation particulière (Orphelin)
                    </label>
                    <div className="flex gap-6">
                      <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={orphelinPere}
                          onChange={e => setOrphelinPere(e.target.checked)}
                          className="accent-[#6E1423] w-4 h-4 rounded-xs"
                        />
                        <span>Orphelin de père</span>
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={orphelinMere}
                          onChange={e => setOrphelinMere(e.target.checked)}
                          className="accent-[#6E1423] w-4 h-4 rounded-xs"
                        />
                        <span>Orphelin de mère</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#450C15] uppercase">
                      Nombre de frères et sœurs
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={nbFreres}
                      onChange={e => setNbFreres(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#450C15] uppercase">
                      Qui s'occupe de la scolarité ?
                    </label>
                    <div className="flex gap-4 pt-1">
                      {(['Père', 'Mère', 'Autre'] as const).map(p => (
                        <label key={p} className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="occupeScolarite"
                            value={p}
                            checked={occupeScolarite === p}
                            onChange={() => setOccupeScolarite(p)}
                            className="accent-[#6E1423]"
                          />
                          <span>{p}</span>
                        </label>
                      ))}
                    </div>
                    {occupeScolarite === 'Autre' && (
                      <input
                        type="text"
                        value={occupeScolaritePrecision}
                        onChange={e => setOccupeScolaritePrecision(e.target.value)}
                        placeholder="Précisez qui (ex : Oncle, Tuteur)"
                        className="w-full mt-2 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xs"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: TUTEUR DIVO & SANTÉ */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in-50 duration-150">
                <div className="border-b border-[#E7DCC7] pb-3">
                  <h2 className="text-xl font-serif font-bold text-[#450C15]">
                    4. Tuteur à Divo & État de santé
                  </h2>
                  <p className="text-xs text-[#6B5B4E]">
                    Le tuteur ou correspondant doit <strong>résider absolument à Divo</strong>.
                  </p>
                </div>

                {/* Tuteur */}
                <div className="bg-[#FFFDF8] p-5 border border-[#E7DCC7] rounded-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-[#450C15]">
                      Tuteur / Correspondant à Divo
                    </h3>
                    <span className="text-xs text-[#2F6B3A] font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Résidence Divo exigée
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Nom et prénoms</label>
                      <input
                        type="text"
                        value={tutNom}
                        onChange={e => setTutNom(e.target.value)}
                        placeholder="Nom complet du tuteur (laisser vide si c'est le père ou la mère)"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Profession</label>
                      <input
                        type="text"
                        value={tutProf}
                        onChange={e => setTutProf(e.target.value)}
                        placeholder="Profession du tuteur"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Quartier à Divo</label>
                      <input
                        type="text"
                        value={tutQuartier}
                        onChange={e => setTutQuartier(e.target.value)}
                        placeholder="Ex : Bada, Libreville, Konankro"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Lien de parenté</label>
                      <input
                        type="text"
                        value={tutLien}
                        onChange={e => setTutLien(e.target.value)}
                        placeholder="Ex : Oncle, Tante, Frère aîné"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700">Contact téléphonique</label>
                      <input
                        type="tel"
                        value={tutContact}
                        onChange={e => setTutContact(e.target.value)}
                        placeholder="Ex : 07 00 00 00 00"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* État de santé */}
                <div className="p-5 bg-[#FBF6EA] border border-[#E7DCC7] rounded-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#450C15] uppercase">
                      L'élève a-t-il un problème de santé connu ?
                    </label>
                    <div className="flex gap-4">
                      <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="probSante"
                          value="non"
                          checked={probSante === 'non'}
                          onChange={() => setProbSante('non')}
                          className="accent-[#6E1423]"
                        />
                        <span>Non</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="probSante"
                          value="oui"
                          checked={probSante === 'oui'}
                          onChange={() => setProbSante('oui')}
                          className="accent-[#6E1423]"
                        />
                        <span>Oui</span>
                      </label>
                    </div>
                  </div>

                  {probSante === 'oui' && (
                    <div className="space-y-3 pt-3 border-t border-[#E7DCC7]">
                      <p className="text-xs text-[#6B5B4E]">Cochez la ou les pathologies concernées :</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {PATHOLOGIES_LISTE.map(pat => (
                          <label
                            key={pat}
                            className={`p-2 rounded-xs border text-xs font-medium flex items-center gap-2 cursor-pointer transition-colors ${
                              santePathologies.includes(pat)
                                ? 'bg-[#6E1423] text-white border-[#450C15]'
                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={santePathologies.includes(pat)}
                              onChange={() => togglePathologie(pat)}
                              className="accent-[#D9A61E]"
                            />
                            <span>{pat}</span>
                          </label>
                        ))}
                      </div>

                      <div className="space-y-1 pt-2">
                        <label className="text-xs font-medium text-gray-700">
                          Autre problème médical / Précisions particulières :
                        </label>
                        <input
                          type="text"
                          value={santeAutre}
                          onChange={e => setSanteAutre(e.target.value)}
                          placeholder="Allergies, traitement médical permanent, etc."
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xs text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: PIÈCES & VALIDATION */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in-50 duration-150">
                <div className="border-b border-[#E7DCC7] pb-3">
                  <h2 className="text-xl font-serif font-bold text-[#450C15]">
                    5. Contrôle des pièces & Validation finale
                  </h2>
                  <p className="text-xs text-[#6B5B4E]">
                    Vérifiez le récapitulatif ci-dessous avant d'enregistrer la fiche.
                  </p>
                </div>

                {/* Checklist des pièces */}
                <div className="space-y-3 bg-[#FFFDF8] p-5 border border-[#E7DCC7] rounded-sm">
                  <h3 className="font-serif font-bold text-sm text-[#450C15] uppercase tracking-wide">
                    Pièces à joindre au dossier physique (à cocher si déjà préparées) :
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {LISTE_DOCUMENTS_REQUIS.map(doc => {
                      const isChecked = docsFournis.includes(doc.id);
                      return (
                        <label
                          key={doc.id}
                          className={`p-2.5 rounded-sm border text-xs flex items-center gap-2.5 cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleDoc(doc.id)}
                            className="accent-[#2F6B3A] w-4 h-4 rounded-xs"
                          />
                          <span>{doc.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Recapitulatif Card */}
                <div className="bg-[#FBF6EA] p-5 rounded-sm border border-[#E7DCC7] space-y-3 text-xs">
                  <h3 className="font-serif font-bold text-base text-[#450C15] uppercase">
                    Récapitulatif de la fiche
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#6B5B4E]">
                    <div>
                      <strong>Élève :</strong> {nom} ({sexe === 'M' ? 'Garçon' : 'Fille'})
                    </div>
                    <div>
                      <strong>Niveau demandé :</strong>{' '}
                      <span className="text-[#6E1423] font-bold">
                        {niveau} {classe ? `(${classe})` : ''}
                      </span>
                    </div>
                    <div>
                      <strong>Né(e) le :</strong> {naissDate} à {naissLieu}
                    </div>
                    <div>
                      <strong>Résidence à Divo :</strong> {quartier || 'Divo'} (chez {chezQui})
                    </div>
                    <div>
                      <strong>Contact principal :</strong> {pereContact || mereContact || tutContact || '—'}
                    </div>
                    <div>
                      <strong>Tuteur à Divo :</strong> {tutNom || 'Parent'} ({tutQuartier || 'Divo'})
                    </div>
                  </div>
                </div>

                {/* Engagement sur l'honneur */}
                <div className="bg-[#FFF9E6] border-l-4 border-[#D9A61E] p-4 text-xs text-[#6B5B4E] leading-relaxed">
                  <p>
                    <strong>Déclaration sur l'honneur :</strong> En cliquant sur « Enregistrer
                    l'inscription », je certifie l'exactitude des renseignements portés sur cette
                    fiche et m'engage à déposer les pièces justificatives requises au secrétariat du
                    Cours Secondaire Elites Divo.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons (Stepper Footer) */}
            <div className="pt-6 border-t border-[#E7DCC7] flex items-center justify-between gap-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-[#6E1423] hover:bg-[#450C15] text-[#F4D889] rounded-sm shadow-sm transition-colors cursor-pointer"
                >
                  <span>Étape suivante</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-7 py-3 text-base font-bold bg-[#2F6B3A] hover:bg-[#1E4A28] text-white rounded-sm shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#F4D889]" />
                  <span>{isSubmitting ? 'Enregistrement en cours...' : "Enregistrer l'inscription"}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && createdDossier && (
        <ReceiptModal
          dossier={createdDossier}
          onClose={() => setShowReceiptModal(false)}
        />
      )}
    </div>
  );
};
