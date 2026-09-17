import React from 'react';
import { LISTE_DOCUMENTS_REQUIS } from '../types/dossier';
import type { PageId } from '../components/Header';
import {
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  Printer,
  DollarSign,
  Calendar,
} from 'lucide-react';

interface PiecesTarifsPageProps {
  onNavigate: (page: PageId) => void;
}

export const PiecesTarifsPage: React.FC<PiecesTarifsPageProps> = ({ onNavigate }) => {
  const handlePrint = () => {
    window.print();
  };

  const grilleFrais = [
    { niveau: '6ème – 5ème (1er Cycle)', droit: '25 000 FCFA', scolarite: '75 000 FCFA / an', total: '100 000 FCFA' },
    { niveau: '4ème – 3ème (Examens BEPC)', droit: '30 000 FCFA', scolarite: '85 000 FCFA / an', total: '115 000 FCFA' },
    { niveau: '2nde A / C (2nd Cycle)', droit: '35 000 FCFA', scolarite: '100 000 FCFA / an', total: '135 000 FCFA' },
    { niveau: '1ère A / C / D', droit: '35 000 FCFA', scolarite: '110 000 FCFA / an', total: '145 000 FCFA' },
    { niveau: 'Terminale A / C / D (BAC)', droit: '40 000 FCFA', scolarite: '125 000 FCFA / an', total: '165 000 FCFA' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider text-[#D9A61E] bg-[#D9A61E]/10 px-3 py-1 rounded-full border border-[#D9A61E]/30">
          Guide des Familles &middot; 2026 – 2027
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#450C15]">
          Pièces à fournir & Modalités de scolarité
        </h1>
        <p className="text-sm text-[#6B5B4E] max-w-2xl mx-auto">
          Pour valider définitivement l'inscription de votre enfant au Cours Secondaire Elites Divo,
          veuillez préparer avec soin les pièces ci-dessous avant de vous présenter au secrétariat.
        </p>
      </div>

      {/* Warning Notice Card: Tuteur Divo */}
      <div className="bg-[#FFF9E6] border-2 border-[#D9A61E] rounded-lg p-6 flex items-start gap-4 shadow-sm">
        <div className="w-10 h-10 bg-[#D9A61E]/20 text-[#8A5A00] rounded-full flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 text-sm text-[#6B5B4E]">
          <h3 className="font-serif font-bold text-base text-[#450C15]">
            Condition impérative : Résidence effective à Divo
          </h3>
          <p className="leading-relaxed">
            Le tuteur légal ou le parent dont la pièce d'identité est fournie doit{' '}
            <strong>résider absolument à Divo</strong>. Aucun dossier ne pourra être validé sans la
            présence et la caution d'un tuteur domicilié sur le territoire communal de Divo.
          </p>
        </div>
      </div>

      {/* Grid: 2 Columns (Pièces + Calendrier & Déroulement) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Checklist des pièces */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-[#E7DCC7] shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E7DCC7] pb-4">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#450C15]">
                Dossier physique obligatoire
              </h2>
              <p className="text-xs text-[#6B5B4E]">
                À remettre sous chemise cartonnée au secrétariat
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#6E1423] border border-[#6E1423] rounded-sm hover:bg-[#FBF6EA] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer la liste</span>
            </button>
          </div>

          <ul className="space-y-3">
            {LISTE_DOCUMENTS_REQUIS.map((doc, idx) => (
              <li
                key={doc.id}
                className="flex items-center gap-3 p-3 bg-[#FFFDF8] rounded-sm border border-[#E7DCC7]/80 text-sm text-[#221812]"
              >
                <span className="w-6 h-6 rounded-full bg-[#6E1423] text-[#F4D889] flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </span>
                <span className="font-medium flex-1">{doc.label}</span>
                <span className="w-4 h-4 rounded-xs border-2 border-gray-300 shrink-0" />
              </li>
            ))}
          </ul>

          <div className="pt-2 text-xs text-[#6B5B4E] leading-relaxed italic border-t border-gray-100">
            * Tout dossier incomplet sera consigné en attente et l'affectation de la classe ne sera
            définitive qu'après réception de l'ensemble des pièces.
          </div>
        </div>

        {/* Right Col: Horaires, Calendrier & Accompagnement */}
        <div className="lg:col-span-5 space-y-6">
          {/* Calendrier de la rentrée */}
          <div className="bg-[#FBF6EA] border border-[#E7DCC7] rounded-lg p-6 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#450C15] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#D9A61E]" />
              <span>Calendrier Rentrée 2026 – 2027</span>
            </h3>
            <ul className="space-y-3 text-xs text-[#6B5B4E]">
              <li className="flex items-start gap-2.5">
                <strong className="text-[#6E1423] shrink-0 font-mono">1er Août :</strong>
                <span>Ouverture de la plateforme d'inscription en ligne ElitesEduca+.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <strong className="text-[#6E1423] shrink-0 font-mono">15 Août :</strong>
                <span>Début de la réception des dossiers physiques au secrétariat.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <strong className="text-[#6E1423] shrink-0 font-mono">08 Sept. :</strong>
                <span>Rentrée solennelle des classes pour l'ensemble des niveaux.</span>
              </li>
            </ul>
          </div>

          {/* Secrétariat Hours & Location */}
          <div className="bg-white border border-[#E7DCC7] rounded-lg p-6 space-y-4 shadow-xs">
            <h3 className="font-serif font-bold text-lg text-[#450C15] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2F6B3A]" />
              <span>Horaires de réception</span>
            </h3>
            <div className="text-xs text-[#6B5B4E] space-y-2">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Lundi à Vendredi :</span>
                <strong className="text-[#221812]">07h30 &ndash; 16h30 (non-stop)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>Samedi :</span>
                <strong className="text-[#221812]">08h00 &ndash; 12h00</strong>
              </div>
              <div className="flex justify-between py-1 text-red-700">
                <span>Dimanche & Jours fériés :</span>
                <strong>Fermé</strong>
              </div>
            </div>

            <div className="pt-2 text-xs text-[#6B5B4E] space-y-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D9A61E] shrink-0" />
                <span>Cours Secondaire Elites &middot; Divo (à proximité de la DRENA)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D9A61E] shrink-0" />
                <span>07 07 87 49 78 / 01 03 35 69 82</span>
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="bg-[#450C15] text-[#F4D889] p-6 rounded-lg shadow-md space-y-3 text-center">
            <h4 className="font-serif font-bold text-base text-white">
              Prêt à inscrire votre enfant ?
            </h4>
            <p className="text-xs text-[#EFE3C8]">
              L'enregistrement ne prend que quelques minutes depuis votre téléphone ou ordinateur.
            </p>
            <button
              onClick={() => onNavigate('inscription')}
              className="w-full py-2.5 px-4 bg-[#D9A61E] hover:bg-[#F4D889] text-[#450C15] font-bold text-sm rounded-sm transition-colors cursor-pointer"
            >
              Remplir la fiche en ligne
            </button>
          </div>
        </div>
      </div>

      {/* Grille Tarifaire Indicative */}
      <div className="bg-white rounded-lg border border-[#E7DCC7] shadow-md p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#2F6B3A] font-bold uppercase tracking-wider">
            <DollarSign className="w-4 h-4 text-[#2F6B3A]" />
            <span>Frais scolaires indicatifs 2026 – 2027</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#450C15]">
            Grille indicative des droits et scolarités
          </h2>
          <p className="text-xs text-[#6B5B4E]">
            Possibilité de règlement échelonné (modalités complètes disponibles auprès de la comptabilité de l'établissement).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#FBF6EA] text-[#450C15] font-serif border-b border-[#E7DCC7]">
                <th className="py-3 px-4 font-bold">Niveau & Classe</th>
                <th className="py-3 px-4 font-bold">Droit d'inscription</th>
                <th className="py-3 px-4 font-bold">Scolarité annuelle</th>
                <th className="py-3 px-4 font-bold text-right">Total indicatif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7DCC7]/60 text-xs">
              {grilleFrais.map((f, i) => (
                <tr key={i} className="hover:bg-[#FFFDF8] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#221812]">{f.niveau}</td>
                  <td className="py-3.5 px-4 text-[#6B5B4E]">{f.droit}</td>
                  <td className="py-3.5 px-4 text-[#6B5B4E]">{f.scolarite}</td>
                  <td className="py-3.5 px-4 font-bold text-[#6E1423] text-right font-mono text-sm">
                    {f.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
