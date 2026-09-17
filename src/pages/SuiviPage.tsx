import React, { useState, useEffect } from 'react';
import type { DossierEleve } from '../types/dossier';
import { LISTE_DOCUMENTS_REQUIS } from '../types/dossier';
import { findDossier } from '../db/db';
import { StatusBadge } from '../components/StatusBadge';
import { ReceiptModal } from '../components/ReceiptModal';
import type { PageId } from '../components/Header';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Printer,
} from 'lucide-react';

interface SuiviPageProps {
  onNavigate: (page: PageId) => void;
  initialQuery?: string;
}

export const SuiviPage: React.FC<SuiviPageProps> = ({ onNavigate, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DossierEleve | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedForReceipt, setSelectedForReceipt] = useState<DossierEleve | null>(null);

  const handleSearch = async (searchTerm?: string) => {
    const q = searchTerm !== undefined ? searchTerm : query;
    if (!q.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const found = await findDossier(q);
      setResult(found);
    } catch (err) {
      console.error('Erreur recherche:', err);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-[#2F6B3A] bg-[#2F6B3A]/10 px-3 py-1 rounded-full border border-[#2F6B3A]/30">
          Vérification en temps réel
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#450C15]">
          Suivi de dossier d'inscription
        </h1>
        <p className="text-sm text-[#6B5B4E] max-w-lg mx-auto">
          Saisissez le numéro de dossier attribué (ex : <strong>ED-2026-0417</strong>) ou le nom de
          l'élève pour connaître l'état d'avancement de son dossier.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-lg border border-[#E7DCC7] shadow-lg">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Numéro de dossier (ex : ED-2026-0417) ou Nom de l'élève..."
              className="w-full pl-11 pr-4 py-3 bg-[#FFFDF8] border border-[#E7DCC7] rounded-sm text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9A61E] focus:border-[#6E1423] font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#6E1423] hover:bg-[#450C15] text-[#F4D889] font-bold text-sm rounded-sm shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Recherche...</span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Consulter le dossier</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Sample Links */}
        <div className="mt-4 pt-4 border-t border-[#E7DCC7]/60 flex flex-wrap items-center gap-2 text-xs text-[#6B5B4E]">
          <span className="font-semibold">Exemples de dossiers démo à tester :</span>
          {['ED-2026-0417', 'ED-2026-1042', 'ED-2026-1893', 'ED-2026-2401'].map(sampleRef => (
            <button
              key={sampleRef}
              type="button"
              onClick={() => {
                setQuery(sampleRef);
                handleSearch(sampleRef);
              }}
              className="bg-[#FBF6EA] hover:bg-[#D9A61E]/20 text-[#6E1423] font-mono px-2.5 py-1 rounded-xs border border-[#E7DCC7] transition-colors cursor-pointer"
            >
              {sampleRef}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {loading ? (
        <div className="bg-white p-12 rounded-lg border border-[#E7DCC7] text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#6E1423] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[#6B5B4E]">Recherche dans les archives scolaires...</p>
        </div>
      ) : result ? (
        <div className="bg-white rounded-lg border-2 border-[#6E1423] shadow-xl overflow-hidden animate-in fade-in-50 duration-200">
          {/* Card Top Ribbon */}
          <div className="bg-[#6E1423] text-white p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#F4D889] font-bold">
                Dossier d'inscription scolaire &bull; 2026 – 2027
              </div>
              <h2 className="text-2xl font-serif font-bold text-white uppercase mt-0.5">
                {result.nom}
              </h2>
              <p className="text-xs text-[#EFE3C8] mt-1">
                Niveau : <strong className="text-white">{result.niveau} {result.classe ? `(${result.classe})` : ''}</strong> &middot; Enregistré le{' '}
                {new Date(result.recuLe).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <span className="font-mono text-xl font-bold bg-white text-[#6E1423] px-3.5 py-1 rounded-xs border border-[#D9A61E]">
                {result.ref}
              </span>
              <StatusBadge statut={result.statut} size="md" />
            </div>
          </div>

          {/* Stepper Timeline Visual */}
          <div className="p-6 bg-[#FBF6EA] border-b border-[#E7DCC7]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#450C15] mb-4">
              Progression du dossier :
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div
                className={`p-3 rounded-sm border flex items-center gap-3 ${
                  ['recu', 'verification', 'valide'].includes(result.statut)
                    ? 'bg-white border-[#2F6B3A] text-[#1E4A28] font-bold shadow-2xs'
                    : 'bg-white/60 border-gray-200 text-gray-400'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-[#2F6B3A] shrink-0" />
                <div>
                  <div>1. Formulaire Reçu</div>
                  <div className="text-[10px] font-normal text-gray-500">
                    Pré-inscription enregistrée
                  </div>
                </div>
              </div>

              <div
                className={`p-3 rounded-sm border flex items-center gap-3 ${
                  ['verification', 'valide'].includes(result.statut)
                    ? 'bg-white border-[#1565C0] text-[#1565C0] font-bold shadow-2xs'
                    : result.statut === 'rejete'
                    ? 'bg-red-50 border-red-300 text-red-700 font-bold'
                    : 'bg-white/60 border-gray-200 text-gray-400'
                }`}
              >
                {result.statut === 'rejete' ? (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                ) : (
                  <Clock className="w-5 h-5 text-[#1565C0] shrink-0" />
                )}
                <div>
                  <div>2. Vérification physique</div>
                  <div className="text-[10px] font-normal text-gray-500">
                    Contrôle des pièces au secrétariat
                  </div>
                </div>
              </div>

              <div
                className={`p-3 rounded-sm border flex items-center gap-3 ${
                  result.statut === 'valide'
                    ? 'bg-emerald-50 border-[#2F6B3A] text-[#2F6B3A] font-bold shadow-2xs'
                    : 'bg-white/60 border-gray-200 text-gray-400'
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 shrink-0 ${
                    result.statut === 'valide' ? 'text-[#2F6B3A]' : 'text-gray-300'
                  }`}
                />
                <div>
                  <div>3. Inscription Validée</div>
                  <div className="text-[10px] font-normal text-gray-500">
                    Place réservée & macaron délivré
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-6">
            {/* Notes admin / instructions */}
            {result.notesAdmin && (
              <div
                className={`p-4 rounded-sm border-l-4 text-xs leading-relaxed ${
                  result.statut === 'valide'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                    : result.statut === 'rejete'
                    ? 'bg-red-50 border-red-500 text-red-900'
                    : 'bg-[#FFF9E6] border-[#D9A61E] text-[#6B5B4E]'
                }`}
              >
                <strong className="font-serif text-sm block mb-1">
                  Message du Secrétariat :
                </strong>
                <span>{result.notesAdmin}</span>
              </div>
            )}

            {/* Checklist of documents */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-sm text-[#450C15] uppercase tracking-wide">
                État des pièces justificatives :
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {LISTE_DOCUMENTS_REQUIS.map(doc => {
                  const isChecked = result.docsFournis?.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      className={`p-2.5 rounded-sm border flex items-center justify-between ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                          : 'bg-gray-50 border-gray-200 text-gray-600'
                      }`}
                    >
                      <span className="font-medium">{doc.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isChecked
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {isChecked ? 'Déposé' : 'À fournir'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 text-xs text-[#6B5B4E]">
              <div>
                <span className="text-gray-400 block">Tuteur / Contact à Divo :</span>
                <strong className="text-[#221812] text-sm">
                  {result.tutNom || result.pereNom || result.mereNom || 'Non renseigné'}
                </strong>{' '}
                ({result.tutContact || result.pereContact || result.mereContact || '—'})
              </div>
              <div>
                <span className="text-gray-400 block">Lieu de résidence à Divo :</span>
                <strong className="text-[#221812] text-sm">
                  {result.quartier ? `Quartier ${result.quartier}` : 'Divo'}
                </strong>{' '}
                (chez {result.chezQui})
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-[#6B5B4E]">
                Besoin d'aide ? Appelez le secrétariat au{' '}
                <a href="tel:+2250707874978" className="text-[#6E1423] font-bold underline">
                  07 07 87 49 78
                </a>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedForReceipt(result)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#6E1423] hover:bg-[#450C15] text-[#F4D889] font-bold text-xs rounded-sm shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer le récépissé</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : hasSearched ? (
        /* Not found notice */
        <div className="bg-white p-10 rounded-lg border border-[#E7DCC7] text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-[#450C15]">
              Aucun dossier trouvé pour « {query} »
            </h3>
            <p className="text-sm text-[#6B5B4E] max-w-md mx-auto">
              Vérifiez l'orthographe du nom ou le numéro au format <strong>ED-2026-XXXX</strong>.
              Si vous n'avez pas encore rempli la fiche d'inscription, commencez dès maintenant.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onNavigate('inscription')}
              className="px-5 py-2.5 bg-[#6E1423] text-[#F4D889] font-bold text-sm rounded-sm hover:bg-[#450C15] transition-colors cursor-pointer"
            >
              Faire une nouvelle inscription
            </button>
          </div>
        </div>
      ) : null}

      {/* Printable Receipt Modal */}
      {selectedForReceipt && (
        <ReceiptModal
          dossier={selectedForReceipt}
          onClose={() => setSelectedForReceipt(null)}
        />
      )}
    </div>
  );
};
