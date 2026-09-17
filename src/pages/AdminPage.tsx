import React, { useState, useEffect } from 'react';
import type {
  DossierEleve,
  StatutDossier,
  NiveauScolaire,
} from '../types/dossier';
import {
  NIVEAUX_SCOLAIRES,
  LISTE_DOCUMENTS_REQUIS,
  TARIFS_PAR_NIVEAU,
  getMontantRestant,
  isDossierSolde,
  formatFCFA,
} from '../types/dossier';
import {
  getAllDossiers,
  updateDossier,
  deleteDossier,
  addDossier,
  resetDatabaseWithSamples,
  generateReference,
} from '../db/db';
import { StatusBadge } from '../components/StatusBadge';
import { ReceiptModal } from '../components/ReceiptModal';
import type { PageId } from '../components/Header';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Search,
  Filter,
  RotateCcw,
  Plus,
  Trash2,
  Printer,
  Eye,
  X,
  FileSpreadsheet,
  Wallet,
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (page: PageId) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate: _onNavigate }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('elites_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState(false);

  // Dossiers State
  const [dossiers, setDossiers] = useState<DossierEleve[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | StatutDossier>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | NiveauScolaire>('all');

  // Modal State
  const [selectedDossier, setSelectedDossier] = useState<DossierEleve | null>(null);
  const [receiptDossier, setReceiptDossier] = useState<DossierEleve | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Formulaire "Situation financière" (synchronisé avec le dossier ouvert)
  const [paymentTotal, setPaymentTotal] = useState<string>('');
  const [paymentPaye, setPaymentPaye] = useState<string>('');
  const [paymentDate, setPaymentDate] = useState<string>('');
  const [savingPayment, setSavingPayment] = useState(false);

  useEffect(() => {
    if (selectedDossier) {
      setPaymentTotal(
        String(selectedDossier.montantTotal ?? TARIFS_PAR_NIVEAU[selectedDossier.niveau] ?? '')
      );
      setPaymentPaye(String(selectedDossier.montantPaye ?? 0));
      setPaymentDate(selectedDossier.prochainPaiementDate?.slice(0, 10) ?? '');
    }
  }, [selectedDossier?.id]);

  const handleSavePayment = async () => {
    if (!selectedDossier?.id) return;
    setSavingPayment(true);
    try {
      const changes = {
        montantTotal: paymentTotal.trim() === '' ? undefined : Number(paymentTotal),
        montantPaye: paymentPaye.trim() === '' ? 0 : Number(paymentPaye),
        prochainPaiementDate: paymentDate.trim() === '' ? undefined : paymentDate,
      };
      await updateDossier(selectedDossier.id, changes);
      setSelectedDossier(prev => (prev ? { ...prev, ...changes } : null));
      await loadDossiers();
      alert('Situation financière mise à jour avec succès.');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du paiement.");
    } finally {
      setSavingPayment(false);
    }
  };

  // New Dossier Form (Quick Counter Registration)
  const [newNom, setNewNom] = useState('');
  const [newNiveau, setNewNiveau] = useState<NiveauScolaire>('6ème');
  const [newSexe, setNewSexe] = useState<'M' | 'F'>('M');
  const [newNaissDate, setNewNaissDate] = useState('2014-05-10');
  const [newNaissLieu, setNewNaissLieu] = useState('Divo');
  const [newQuartier, setNewQuartier] = useState('Bada');
  const [newContact, setNewContact] = useState('');
  const [newPereNom, setNewPereNom] = useState('');
  const [newTutNom, setNewTutNom] = useState('');

  // Load dossiers from IndexedDB
  const loadDossiers = async () => {
    setLoading(true);
    try {
      const all = await getAllDossiers();
      setDossiers(all);
    } catch (err) {
      console.error('Erreur chargement dossiers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDossiers();
    }
  }, [isAuthenticated]);

  // Auth Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default pass: admin123 (or "admin" or "divo")
    if (
      passwordInput === 'admin123' ||
      passwordInput === 'admin' ||
      passwordInput === 'divo' ||
      passwordInput === 'elites'
    ) {
      sessionStorage.setItem('elites_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('elites_admin_auth');
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // Status quick update
  const handleStatusChange = async (id: number, newStatut: StatutDossier) => {
    await updateDossier(id, { statut: newStatut });
    await loadDossiers();
    if (selectedDossier && selectedDossier.id === id) {
      setSelectedDossier(prev => (prev ? { ...prev, statut: newStatut } : null));
    }
  };

  // Toggle document validation in modal
  const handleToggleDoc = async (dossier: DossierEleve, docId: string) => {
    const current = dossier.docsFournis || [];
    const updated = current.includes(docId)
      ? current.filter(d => d !== docId)
      : [...current, docId];

    await updateDossier(dossier.id!, { docsFournis: updated });
    setSelectedDossier({ ...dossier, docsFournis: updated });
    await loadDossiers();
  };

  // Update admin note in modal
  const handleSaveNote = async (id: number, note: string) => {
    await updateDossier(id, { notesAdmin: note });
    await loadDossiers();
    alert('Remarque du secrétariat enregistrée avec succès.');
  };

  // Delete dossier
  const handleDelete = async (id: number, nomEleve: string) => {
    if (confirm(`Confirmez-vous la suppression définitive du dossier de ${nomEleve} ?`)) {
      await deleteDossier(id);
      await loadDossiers();
      if (selectedDossier?.id === id) setSelectedDossier(null);
    }
  };

  // Reset database with samples
  const handleResetWithSamples = async () => {
    if (
      confirm(
        'Voulez-vous réinitialiser la base de données avec les dossiers de démonstration officiels ?'
      )
    ) {
      await resetDatabaseWithSamples();
      await loadDossiers();
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (dossiers.length === 0) return;

    const headers = [
      'N° Dossier',
      'Nom et Prénoms',
      'Niveau',
      'Classe',
      'Sexe',
      'Date Naissance',
      'Lieu Naissance',
      'Quartier',
      'Père',
      'Contact Père',
      'Mère',
      'Tuteur Divo',
      'Contact Tuteur',
      'Statut',
      'Date Enregistrement',
    ];

    const rows = dossiers.map(d => [
      `"${d.ref}"`,
      `"${d.nom}"`,
      `"${d.niveau}"`,
      `"${d.classe || ''}"`,
      `"${d.sexe}"`,
      `"${d.naissDate}"`,
      `"${d.naissLieu}"`,
      `"${d.quartier || ''}"`,
      `"${d.pereNom || ''}"`,
      `"${d.pereContact || ''}"`,
      `"${d.mereNom || ''}"`,
      `"${d.tutNom || ''}"`,
      `"${d.tutContact || ''}"`,
      `"${d.statut}"`,
      `"${d.recuLe}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ElitesDivo_Dossiers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create Quick Manual Dossier
  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNom.trim()) return;

    const ref = generateReference();
    const dossier: DossierEleve = {
      ref,
      recuLe: new Date().toISOString(),
      statut: 'recu',
      nom: newNom.trim(),
      niveau: newNiveau,
      sexe: newSexe,
      naissDate: newNaissDate,
      naissLieu: newNaissLieu.trim(),
      nationalite: 'Ivoirienne',
      quartier: newQuartier.trim(),
      chezQui: 'Père',
      pereNom: newPereNom.trim(),
      pereContact: newContact.trim(),
      tutNom: newTutNom.trim(),
      tutContact: newContact.trim(),
      probSante: 'non',
      santePathologies: [],
      orphelinPere: false,
      orphelinMere: false,
      docsFournis: ['Acte de naissance'],
      notesAdmin: 'Dossier créé manuellement au guichet par le secrétariat.',
      montantTotal: TARIFS_PAR_NIVEAU[newNiveau],
      montantPaye: 0,
    };

    await addDossier(dossier);
    setIsCreatingNew(false);
    setNewNom('');
    await loadDossiers();
  };

  // Filtered List
  const filteredDossiers = dossiers.filter(d => {
    const matchesSearch =
      !searchFilter.trim() ||
      d.nom.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.ref.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (d.quartier && d.quartier.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (d.pereContact && d.pereContact.includes(searchFilter)) ||
      (d.tutContact && d.tutContact.includes(searchFilter));

    const matchesStatus = statusFilter === 'all' || d.statut === statusFilter;
    const matchesLevel = levelFilter === 'all' || d.niveau === levelFilter;

    return matchesSearch && matchesStatus && matchesLevel;
  });

  // KPI Calculations
  const stats = {
    total: dossiers.length,
    recu: dossiers.filter(d => d.statut === 'recu').length,
    verification: dossiers.filter(d => d.statut === 'verification').length,
    valide: dossiers.filter(d => d.statut === 'valide').length,
    rejete: dossiers.filter(d => d.statut === 'rejete').length,
    garcons: dossiers.filter(d => d.sexe === 'M').length,
    filles: dossiers.filter(d => d.sexe === 'F').length,
  };

  // Login Gate View
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 space-y-6">
        <div className="bg-white p-8 rounded-lg border border-[#E7DCC7] shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#6E1423]/10 text-[#6E1423] rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-bold text-[#450C15]">
              Espace Secrétariat & Administration
            </h1>
            <p className="text-xs text-[#6B5B4E]">
              Accès réservé au personnel du Cours Secondaire Elites Divo.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#450C15] uppercase">Mot de passe admin</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Entrez le mot de passe..."
                className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9A61E]"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-medium">
                Mot de passe incorrect. Astuce démo : tapez <strong>admin123</strong>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#6E1423] hover:bg-[#450C15] text-[#F4D889] font-bold text-sm rounded-sm transition-colors shadow-sm cursor-pointer"
            >
              Déverrouiller l'espace administration
            </button>
          </form>

          <div className="text-[11px] text-[#6B5B4E] pt-2 border-t border-gray-100">
            Mot de passe prédéfini pour le test : <code>admin123</code>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-[#E7DCC7] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#6E1423] text-[#F4D889] flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#450C15]">
              Administration des Inscriptions
            </h1>
            <p className="text-xs text-[#6B5B4E]">
              Cours Secondaire Elites Divo &middot; Session active Secrétariat
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsCreatingNew(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#2F6B3A] hover:bg-[#1E4A28] text-white text-xs font-bold rounded-sm shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau dossier</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#6E1423] hover:bg-[#450C15] text-[#F4D889] text-xs font-bold rounded-sm shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exporter Excel / CSV</span>
          </button>

          <button
            onClick={handleResetWithSamples}
            title="Réinitialiser avec données démo"
            className="p-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-sm text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold rounded-sm transition-colors cursor-pointer"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#E7DCC7] shadow-xs">
          <div className="text-[11px] font-bold uppercase text-[#6B5B4E]">Total Dossiers</div>
          <div className="font-serif text-3xl font-bold text-[#450C15] mt-1">{stats.total}</div>
          <div className="text-[10px] text-gray-500 mt-1">
            {stats.garcons} Garçons &bull; {stats.filles} Filles
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#E5BE66] shadow-xs bg-[#FFFDF8]">
          <div className="text-[11px] font-bold uppercase text-[#8A5A00]">Dossiers Reçus</div>
          <div className="font-serif text-3xl font-bold text-[#8A5A00] mt-1">{stats.recu}</div>
          <div className="text-[10px] text-gray-500 mt-1">En attente de pièces</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#90CAF9] shadow-xs">
          <div className="text-[11px] font-bold uppercase text-[#1565C0]">En Vérification</div>
          <div className="font-serif text-3xl font-bold text-[#1565C0] mt-1">
            {stats.verification}
          </div>
          <div className="text-[10px] text-gray-500 mt-1">Instruction au secrétariat</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#A5D6A7] shadow-xs bg-[#FBFDFB]">
          <div className="text-[11px] font-bold uppercase text-[#2E7D32]">Validés</div>
          <div className="font-serif text-3xl font-bold text-[#2E7D32] mt-1">{stats.valide}</div>
          <div className="text-[10px] text-gray-500 mt-1">Inscriptions complètes</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-[#FFCDD2] shadow-xs">
          <div className="text-[11px] font-bold uppercase text-[#C62828]">Incomplets</div>
          <div className="font-serif text-3xl font-bold text-[#C62828] mt-1">{stats.rejete}</div>
          <div className="text-[10px] text-gray-500 mt-1">Pièces manquantes</div>
        </div>

        <div className="bg-[#450C15] text-[#F4D889] p-4 rounded-lg shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase text-white/80">Rentrée 2026</div>
          <div className="font-serif text-lg font-bold text-white leading-tight mt-1">
            Elites Divo
          </div>
          <div className="text-[10px] text-[#D9A61E]">Plateforme active</div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-[#E7DCC7] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Rechercher élève, N° dossier, téléphone..."
            className="w-full pl-9 pr-4 py-2 bg-[#FFFDF8] border border-gray-300 rounded-xs text-xs focus:outline-hidden focus:ring-2 focus:ring-[#D9A61E]"
          />
        </div>

        {/* Dropdowns Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#6B5B4E]">
            <Filter className="w-3.5 h-3.5 text-[#D9A61E]" />
            <span>Statut :</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-[#FFFDF8] border border-gray-300 rounded-xs text-xs"
            >
              <option value="all">Tous les statuts ({stats.total})</option>
              <option value="recu">Reçu ({stats.recu})</option>
              <option value="verification">En Vérification ({stats.verification})</option>
              <option value="valide">Validé ({stats.valide})</option>
              <option value="rejete">Incomplet / Rejeté ({stats.rejete})</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#6B5B4E]">
            <span>Niveau :</span>
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-[#FFFDF8] border border-gray-300 rounded-xs text-xs"
            >
              <option value="all">Tous niveaux</option>
              {NIVEAUX_SCOLAIRES.map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg border border-[#E7DCC7] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FBF6EA] text-[#450C15] font-serif border-b border-[#E7DCC7]">
                <th className="py-3 px-4 font-bold">N° Dossier</th>
                <th className="py-3 px-4 font-bold">Élève</th>
                <th className="py-3 px-4 font-bold">Niveau / Classe</th>
                <th className="py-3 px-4 font-bold">Contact Parent / Tuteur</th>
                <th className="py-3 px-4 font-bold">Reçu le</th>
                <th className="py-3 px-4 font-bold">Pièces</th>
                <th className="py-3 px-4 font-bold">Statut</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    Chargement des dossiers en base de données...
                  </td>
                </tr>
              ) : filteredDossiers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    Aucun dossier ne correspond aux critères de recherche.
                  </td>
                </tr>
              ) : (
                filteredDossiers.map(dossier => {
                  const contact = dossier.pereContact || dossier.mereContact || dossier.tutContact || '—';
                  const docsCount = dossier.docsFournis?.length || 0;

                  return (
                    <tr
                      key={dossier.id}
                      className="hover:bg-[#FFFDF8] transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#6E1423]">
                        {dossier.ref}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#221812] uppercase">{dossier.nom}</div>
                        <div className="text-[10px] text-gray-500">
                          {dossier.sexe === 'M' ? 'Masculin' : 'Féminin'} &bull; Quartier :{' '}
                          {dossier.quartier || 'Divo'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-800">{dossier.niveau}</span>
                        {dossier.classe && (
                          <span className="text-[10px] text-gray-500 block">{dossier.classe}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-700">{contact}</td>
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(dossier.recuLe).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-800">
                          {docsCount} / {LISTE_DOCUMENTS_REQUIS.length}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={dossier.statut}
                          onChange={e => handleStatusChange(dossier.id!, e.target.value as StatutDossier)}
                          className="px-2 py-1 bg-white border border-gray-300 rounded-xs text-[11px] font-medium"
                        >
                          <option value="recu">Reçu</option>
                          <option value="verification">En Vérification</option>
                          <option value="valide">Validé</option>
                          <option value="rejete">Incomplet</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedDossier(dossier)}
                            title="Examiner la fiche complète"
                            className="p-1.5 text-[#6E1423] hover:bg-[#FBF6EA] rounded-xs transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setReceiptDossier(dossier)}
                            title="Imprimer récépissé"
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-xs transition-colors cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(dossier.id!, dossier.nom)}
                            title="Supprimer le dossier"
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-xs transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Instruction & Détails du Dossier */}
      {selectedDossier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 bg-[#6E1423] text-white">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#D9A61E]" />
                <h3 className="font-serif font-bold text-lg text-[#F4D889]">
                  Dossier {selectedDossier.ref} &mdash; {selectedDossier.nom}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDossier(null)}
                className="p-1.5 text-white/80 hover:text-white rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#221812]">
              {/* Statut Control */}
              <div className="bg-[#FBF6EA] p-4 rounded-sm border border-[#E7DCC7] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-gray-500 font-semibold block text-[11px]">
                    STATUT ADMINISTRATIF DU DOSSIER :
                  </span>
                  <div className="mt-1">
                    <StatusBadge statut={selectedDossier.statut} size="lg" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-semibold">Modifier statut :</span>
                  {(['recu', 'verification', 'valide', 'rejete'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedDossier.id!, s)}
                      className={`px-3 py-1.5 rounded-xs font-bold text-[11px] transition-colors cursor-pointer ${
                        selectedDossier.statut === s
                          ? 'bg-[#6E1423] text-[#F4D889] shadow-xs'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {s === 'recu'
                        ? 'Reçu'
                        : s === 'verification'
                        ? 'Vérification'
                        : s === 'valide'
                        ? 'Validé'
                        : 'Incomplet'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Élève Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#FFFDF8] p-4 rounded-sm border border-gray-200">
                <div className="sm:col-span-2 space-y-1.5">
                  <h4 className="font-serif font-bold text-sm text-[#450C15] uppercase border-b pb-1">
                    Informations Élève
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Nom :</span>{' '}
                      <strong>{selectedDossier.nom}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Niveau :</span>{' '}
                      <strong>
                        {selectedDossier.niveau} {selectedDossier.classe ? `(${selectedDossier.classe})` : ''}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Sexe :</span>{' '}
                      <strong>{selectedDossier.sexe === 'M' ? 'Masculin' : 'Féminin'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Né(e) le :</span>{' '}
                      <strong>
                        {new Date(selectedDossier.naissDate).toLocaleDateString('fr-FR')} à{' '}
                        {selectedDossier.naissLieu}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Quartier Divo :</span>{' '}
                      <strong>{selectedDossier.quartier || 'Divo'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Vit chez :</span>{' '}
                      <strong>{selectedDossier.chezQui}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Établissement préc. :</span>{' '}
                      <strong>{selectedDossier.etabOrigine || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500">Moyenne M.G.A. :</span>{' '}
                      <strong>{selectedDossier.mga || '—'}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-2 bg-[#FBF6EA] border rounded-sm">
                  {selectedDossier.photoUrl ? (
                    <img
                      src={selectedDossier.photoUrl}
                      alt={selectedDossier.nom}
                      className="w-24 h-28 object-cover rounded-sm border border-gray-300"
                    />
                  ) : (
                    <div className="w-24 h-28 bg-white border flex items-center justify-center text-gray-400 text-[10px]">
                      Pas de photo
                    </div>
                  )}
                  <span className="text-[10px] text-gray-500 mt-1">Photo d'identité</span>
                </div>
              </div>

              {/* Parents & Tuteur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FFFDF8] p-3 rounded-sm border space-y-1">
                  <h4 className="font-serif font-bold text-xs text-[#6E1423] border-b pb-1">
                    Parents
                  </h4>
                  <div>Père : {selectedDossier.pereNom || '—'} ({selectedDossier.pereProf || '—'})</div>
                  <div>Contact Père : {selectedDossier.pereContact || '—'}</div>
                  <div>Mère : {selectedDossier.mereNom || '—'} ({selectedDossier.mereProf || '—'})</div>
                  <div>Contact Mère : {selectedDossier.mereContact || '—'}</div>
                </div>

                <div className="bg-[#FBF6EA] p-3 rounded-sm border border-[#E7DCC7] space-y-1">
                  <h4 className="font-serif font-bold text-xs text-[#2F6B3A] border-b border-[#E7DCC7] pb-1">
                    Tuteur à Divo (Obligatoire)
                  </h4>
                  <div>Nom : {selectedDossier.tutNom || 'Même que parent'}</div>
                  <div>Lien : {selectedDossier.tutLien || 'Parent'}</div>
                  <div>Quartier : {selectedDossier.tutQuartier || 'Divo'}</div>
                  <div>Contact Tuteur : {selectedDossier.tutContact || '—'}</div>
                </div>
              </div>

              {/* Situation financière (paiement de la scolarité) */}
              <div className="bg-[#FFFDF8] p-4 rounded-sm border border-gray-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-serif font-bold text-xs text-[#450C15] uppercase tracking-wide flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5" />
                    Situation financière (scolarité)
                  </h4>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      isDossierSolde({
                        montantTotal: Number(paymentTotal) || 0,
                        montantPaye: Number(paymentPaye) || 0,
                      })
                        ? 'bg-[#E8F5E9] text-[#2E7D32]'
                        : 'bg-[#FFF3D6] text-[#8A5A00]'
                    }`}
                  >
                    {isDossierSolde({
                      montantTotal: Number(paymentTotal) || 0,
                      montantPaye: Number(paymentPaye) || 0,
                    })
                      ? 'Soldé'
                      : 'Non soldé'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Montant total (FCFA)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={paymentTotal}
                      onChange={e => setPaymentTotal(e.target.value)}
                      className="w-full px-2.5 py-1.5 border rounded-xs text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Montant payé (FCFA)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={paymentPaye}
                      onChange={e => setPaymentPaye(e.target.value)}
                      className="w-full px-2.5 py-1.5 border rounded-xs text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Prochain paiement le
                    </label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={e => setPaymentDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 border rounded-xs text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                  <span className="text-xs text-gray-600">
                    Montant restant :{' '}
                    <strong className="text-[#C62828]">
                      {formatFCFA(
                        getMontantRestant({
                          montantTotal: Number(paymentTotal) || 0,
                          montantPaye: Number(paymentPaye) || 0,
                        })
                      )}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleSavePayment}
                    disabled={savingPayment}
                    className="px-3.5 py-1.5 bg-[#2F6B3A] text-white font-bold text-xs rounded-xs hover:bg-[#1E4A28] disabled:opacity-50 cursor-pointer"
                  >
                    {savingPayment ? 'Enregistrement...' : 'Enregistrer le paiement'}
                  </button>
                </div>
              </div>

              {/* Pointage des Pièces Physiques */}
              <div className="space-y-2 bg-[#FFFDF8] p-4 rounded-sm border border-gray-200">
                <h4 className="font-serif font-bold text-xs text-[#450C15] uppercase tracking-wide">
                  Contrôle des pièces physiques (cliquez pour pointer) :
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {LISTE_DOCUMENTS_REQUIS.map(doc => {
                    const isChecked = selectedDossier.docsFournis?.includes(doc.id);
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => handleToggleDoc(selectedDossier, doc.id)}
                        className={`p-2 rounded-xs border text-left flex items-center justify-between transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="truncate">{doc.label}</span>
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                            isChecked ? 'bg-emerald-600 text-white' : 'border border-gray-400'
                          }`}
                        >
                          {isChecked ? '✓' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Note / Instruction Administrative */}
              <div className="space-y-2">
                <label className="font-serif font-bold text-xs text-[#450C15] uppercase block">
                  Remarque / Consigne du Secrétariat (visible par la famille sur le suivi) :
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={selectedDossier.notesAdmin || ''}
                    id="adminNoteInput"
                    placeholder="Ex : Dossier en règle, ou préciser la pièce manquante..."
                    className="flex-1 px-3 py-2 bg-[#FFFDF8] border border-gray-300 rounded-xs text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('adminNoteInput') as HTMLInputElement;
                      if (input) handleSaveNote(selectedDossier.id!, input.value);
                    }}
                    className="px-4 py-2 bg-[#6E1423] text-[#F4D889] font-bold text-xs rounded-xs hover:bg-[#450C15] cursor-pointer"
                  >
                    Enregistrer la note
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-[#FBF6EA] border-t border-[#E7DCC7] flex justify-between items-center">
              <button
                onClick={() => setReceiptDossier(selectedDossier)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#6E1423] text-[#F4D889] font-bold text-xs rounded-xs hover:bg-[#450C15] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer fiche / récépissé</span>
              </button>
              <button
                onClick={() => setSelectedDossier(null)}
                className="px-4 py-1.5 border border-gray-300 rounded-xs text-xs font-semibold text-gray-700 hover:bg-white cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Nouveau dossier au guichet */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-[#2F6B3A] text-white">
              <h3 className="font-serif font-bold text-base">
                Création rapide d'un dossier au guichet
              </h3>
              <button onClick={() => setIsCreatingNew(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManual} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 uppercase">Nom et prénoms de l'élève *</label>
                <input
                  type="text"
                  required
                  value={newNom}
                  onChange={e => setNewNom(e.target.value)}
                  placeholder="KOUASSI Jean"
                  className="w-full px-3 py-2 border rounded-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Niveau *</label>
                  <select
                    value={newNiveau}
                    onChange={e => setNewNiveau(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xs"
                  >
                    {NIVEAUX_SCOLAIRES.map(n => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Sexe</label>
                  <select
                    value={newSexe}
                    onChange={e => setNewSexe(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xs"
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Date de naissance</label>
                  <input
                    type="date"
                    value={newNaissDate}
                    onChange={e => setNewNaissDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Lieu de naissance</label>
                  <input
                    type="text"
                    value={newNaissLieu}
                    onChange={e => setNewNaissLieu(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Quartier à Divo</label>
                  <input
                    type="text"
                    value={newQuartier}
                    onChange={e => setNewQuartier(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Contact Parent / Tuteur *</label>
                  <input
                    type="tel"
                    required
                    value={newContact}
                    onChange={e => setNewContact(e.target.value)}
                    placeholder="07 00 00 00 00"
                    className="w-full px-3 py-2 border rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Nom du Père / Mère</label>
                  <input
                    type="text"
                    value={newPereNom}
                    onChange={e => setNewPereNom(e.target.value)}
                    placeholder="Nom du parent"
                    className="w-full px-3 py-2 border rounded-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">Tuteur à Divo</label>
                  <input
                    type="text"
                    value={newTutNom}
                    onChange={e => setNewTutNom(e.target.value)}
                    placeholder="Nom du tuteur"
                    className="w-full px-3 py-2 border rounded-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 border rounded-xs text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2F6B3A] text-white font-bold rounded-xs hover:bg-[#1E4A28] cursor-pointer"
                >
                  Créer et enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Récépissé Modal */}
      {receiptDossier && (
        <ReceiptModal dossier={receiptDossier} onClose={() => setReceiptDossier(null)} />
      )}
    </div>
  );
};
