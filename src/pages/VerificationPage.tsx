import React, { useEffect, useState } from 'react';
import {
  getDossierForVerification,
  type DossierVerification,
} from '../db/db';
import { getMontantRestant, isDossierSolde, formatFCFA } from '../types/dossier';
import { StatusBadge } from '../components/StatusBadge';
import type { PageId } from '../components/Header';
import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Loader2,
  Search,
  CalendarClock,
  Wallet,
} from 'lucide-react';
import schoolLogo from '../assets/logo_csrd.png';

interface VerificationPageProps {
  onNavigate: (page: PageId) => void;
  dossierRef: string;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({
  onNavigate,
  dossierRef,
}) => {
  const [loading, setLoading] = useState(true);
  const [dossier, setDossier] = useState<DossierVerification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualQuery, setManualQuery] = useState(dossierRef || '');
  const [checkedAt] = useState(() => new Date());

  const loadDossier = async (ref: string) => {
    if (!ref.trim()) {
      setLoading(false);
      setDossier(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const found = await getDossierForVerification(ref);
      setDossier(found);
      if (!found) setError('Aucun dossier ne correspond à cette référence.');
    } catch (err) {
      console.error(err);
      setError('Erreur de connexion au serveur. Réessayez dans un instant.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDossier(dossierRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dossierRef]);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.hash = `verification/${manualQuery.trim()}`;
    loadDossier(manualQuery.trim());
  };

  const solde = dossier ? isDossierSolde(dossier) : false;
  const restant = dossier ? getMontantRestant(dossier) : 0;

  return (
    <div className="min-h-[70vh] bg-[#FBF6EA] py-8 px-4 sm:py-12">
      <div className="max-w-lg mx-auto">
        {/* En-tête */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 mb-2">
            <img
              src={schoolLogo}
              alt="Logo Cours Secondaire Elites Divo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-serif font-bold text-lg text-[#450C15]">
            Vérification Officielle de Solde
          </h1>
          <p className="text-xs text-[#6B5B4E]">
            Cours Secondaire Elites Divo — ElitesEduca+
          </p>
        </div>

        {/* Recherche manuelle (si on arrive sans référence, ou pour vérifier un autre dossier) */}
        <form
          onSubmit={handleManualSearch}
          className="flex gap-2 mb-6 bg-white p-2 rounded-md border border-[#E7DCC7] shadow-sm"
        >
          <input
            type="text"
            value={manualQuery}
            onChange={e => setManualQuery(e.target.value)}
            placeholder="N° de dossier (Ex : ED-2026-1042)"
            className="flex-1 px-3 py-2 text-sm rounded-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D9A61E]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#6E1423] text-[#F4D889] rounded-sm font-semibold text-sm flex items-center gap-1.5 hover:bg-[#450C15] cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Vérifier</span>
          </button>
        </form>

        {/* États */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-[#6B5B4E]">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p className="text-sm">Vérification en cours...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-white border border-[#FFCDD2] rounded-lg p-6 text-center shadow-sm">
            <AlertCircle className="w-10 h-10 text-[#C62828] mx-auto mb-3" />
            <p className="font-semibold text-[#C62828] mb-1">Dossier introuvable</p>
            <p className="text-sm text-[#6B5B4E]">{error}</p>
          </div>
        )}

        {!loading && dossier && (
          <div className="bg-white rounded-lg border border-[#E7DCC7] shadow-md overflow-hidden">
            {/* Bandeau statut solde */}
            <div
              className={`p-5 text-center ${
                solde ? 'bg-[#E8F5E9]' : 'bg-[#FFF3D6]'
              }`}
            >
              {solde ? (
                <CheckCircle2 className="w-12 h-12 text-[#2E7D32] mx-auto mb-2" />
              ) : (
                <Wallet className="w-12 h-12 text-[#8A5A00] mx-auto mb-2" />
              )}
              <h2
                className={`font-serif font-bold text-xl ${
                  solde ? 'text-[#2E7D32]' : 'text-[#8A5A00]'
                }`}
              >
                {solde ? 'SCOLARITÉ SOLDÉE' : 'SCOLARITÉ NON SOLDÉE'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Vérifié le{' '}
                {checkedAt.toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                à{' '}
                {checkedAt.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Détails élève */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-gray-400">
                    Élève
                  </p>
                  <p className="font-bold text-[#221812]">{dossier.nom}</p>
                  <p className="text-xs text-[#6B5B4E]">
                    {dossier.niveau}
                    {dossier.classe ? ` — ${dossier.classe}` : ''}
                  </p>
                </div>
                <StatusBadge statut={dossier.statut} size="sm" />
              </div>

              <div className="border-t border-[#E7DCC7] pt-3">
                <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-2">
                  N° de dossier
                </p>
                <p className="font-mono font-bold text-[#6E1423] tracking-wide">
                  {dossier.ref}
                </p>
              </div>

              {/* Situation financière */}
              <div className="border-t border-[#E7DCC7] pt-3 space-y-2">
                <p className="text-[10px] uppercase tracking-wide text-gray-400">
                  Situation financière
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-[#FBF6EA] rounded-sm p-2.5">
                    <p className="text-[10px] text-gray-500">Montant total</p>
                    <p className="font-bold text-[#221812]">
                      {formatFCFA(dossier.montantTotal)}
                    </p>
                  </div>
                  <div className="bg-[#FBF6EA] rounded-sm p-2.5">
                    <p className="text-[10px] text-gray-500">Montant payé</p>
                    <p className="font-bold text-[#2F6B3A]">
                      {formatFCFA(dossier.montantPaye)}
                    </p>
                  </div>
                </div>

                {!solde && (
                  <>
                    <div className="bg-[#FFEBEE] rounded-sm p-2.5">
                      <p className="text-[10px] text-[#C62828]">
                        Montant restant à payer
                      </p>
                      <p className="font-bold text-[#C62828] text-lg">
                        {formatFCFA(restant)}
                      </p>
                    </div>

                    {dossier.prochainPaiementDate && (
                      <div className="flex items-center gap-2 bg-[#FFF3D6] rounded-sm p-2.5">
                        <CalendarClock className="w-5 h-5 text-[#8A5A00] shrink-0" />
                        <div>
                          <p className="text-[10px] text-[#8A5A00]">
                            Date du prochain paiement
                          </p>
                          <p className="font-bold text-[#8A5A00]">
                            {new Date(
                              dossier.prochainPaiementDate
                            ).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Pied officiel */}
            <div className="bg-[#450C15] text-[#F4D889] px-5 py-3 flex items-center gap-2 text-[10px]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>
                Information vérifiée en temps réel — Secrétariat du Cours
                Secondaire Elites Divo
              </span>
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => onNavigate('accueil')}
            className="text-xs text-[#6E1423] font-semibold hover:underline cursor-pointer"
          >
            ← Retour au site ElitesEduca+
          </button>
        </div>
      </div>
    </div>
  );
};
