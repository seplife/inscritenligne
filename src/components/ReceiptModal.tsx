import React, { useState } from 'react';
import type { DossierEleve } from '../types/dossier';
import {
  LISTE_DOCUMENTS_REQUIS,
  getMontantRestant,
  isDossierSolde,
  formatFCFA,
} from '../types/dossier';
import { StatusBadge } from './StatusBadge';
import { downloadElementAsPdf } from '../lib/pdf';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Printer,
  X,
  Download,
  MapPin,
  Phone,
  ShieldCheck,
  Wallet,
  CalendarClock,
  Loader2,
} from 'lucide-react';

// ============================================================
// LOGO OFFICIEL DE L'ÉTABLISSEMENT
// Fichier : src/assets/logo_csrd.png
// ============================================================
import schoolLogo from '../assets/logo_csrd.png';

interface ReceiptModalProps {
  dossier: DossierEleve;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  dossier,
  onClose,
}) => {

  // ==========================================================
  // IMPRESSION
  // ==========================================================
  const handlePrint = () => {
    window.print();
  };

  // ==========================================================
  // TÉLÉCHARGEMENT PDF (indépendant de la boîte de dialogue
  // d'impression du navigateur)
  // ==========================================================
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadElementAsPdf(
        'printable-receipt',
        `Recepisse_${dossier.ref}_${dossier.nom.replace(/\s+/g, '_')}.pdf`
      );
    } catch (err) {
      console.error('Erreur génération PDF:', err);
      alert(
        "Une erreur est survenue lors de la génération du PDF. Vous pouvez utiliser « Imprimer » puis choisir « Enregistrer en PDF »."
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // ==========================================================
  // SITUATION FINANCIÈRE
  // ==========================================================
  const solde = isDossierSolde(dossier);
  const montantRestant = getMontantRestant(dossier);

  // ==========================================================
  // CODE QR — pointe vers la page publique de vérification
  // (#verification/REF), consultable par le secrétariat ou les
  // parents en scannant le récépissé, sans authentification.
  // ==========================================================
  const verificationUrl = `${window.location.origin}${window.location.pathname}#verification/${dossier.ref}`;

  // ==========================================================
  // DATE DE CRÉATION DU RÉCÉPISSÉ
  // ==========================================================
  const formattedDate = new Date(dossier.recuLe).toLocaleDateString(
    'fr-FR',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  // ==========================================================
  // DATE DE NAISSANCE
  // ==========================================================
  const formattedBirthDate = new Date(
    dossier.naissDate
  ).toLocaleDateString('fr-FR');

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        overflow-y-auto
        bg-black/60
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-3
        sm:p-6
        no-print
      "
    >

      {/* ======================================================
          CONTENEUR PRINCIPAL DU MODAL
      ======================================================= */}
      <div
        className="
          relative
          w-full
          max-w-4xl
          bg-white
          rounded-lg
          shadow-2xl
          overflow-hidden
          flex
          flex-col
          max-h-[95vh]
        "
      >

        {/* ====================================================
            BARRE SUPÉRIEURE DU MODAL
            Invisible à l'impression
        ===================================================== */}
        <div
          className="
            flex
            items-center
            justify-between
            px-5
            sm:px-6
            py-4
            bg-[#6E1423]
            text-white
            no-print
          "
        >

          <div className="flex items-center gap-2.5">
            <Printer className="w-5 h-5 text-[#F4D889]" />

            <div>
              <h3
                className="
                  font-serif
                  font-semibold
                  text-base
                  sm:text-lg
                  text-[#F4D889]
                "
              >
                Récépissé Officiel d'Inscription
              </h3>

              <p className="text-[10px] text-white/70">
                ElitesEduca+ • Année scolaire 2026-2027
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={handlePrint}
              className="
                inline-flex
                items-center
                gap-2
                bg-[#D9A61E]
                hover:bg-[#F4D889]
                text-[#450C15]
                font-semibold
                text-sm
                px-4
                py-2
                rounded-sm
                transition-colors
                cursor-pointer
                shadow-sm
              "
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="
                inline-flex
                items-center
                gap-2
                bg-white
                hover:bg-[#F4D889]
                text-[#450C15]
                font-semibold
                text-sm
                px-4
                py-2
                rounded-sm
                transition-colors
                cursor-pointer
                shadow-sm
                disabled:opacity-60
                disabled:cursor-wait
              "
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isGeneratingPdf ? 'Génération...' : 'Télécharger PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="
                p-2
                text-white/80
                hover:text-white
                rounded-md
                hover:bg-white/10
                transition-colors
                cursor-pointer
              "
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* ====================================================
            DOCUMENT IMPRIMABLE
        ===================================================== */}
        <div
          id="printable-receipt"
          className="
            overflow-y-auto
            bg-white
            text-[#221812]
            print:overflow-visible
          "
        >

          {/* ==================================================
              FEUILLE A4
          =================================================== */}
          <div
            className="
              receipt-paper
              p-5
              sm:p-8
              lg:p-10
              space-y-6
            "
          >

            {/* =================================================
                EN-TÊTE INSTITUTIONNEL
            ================================================== */}
            <header
              className="
                border-b-2
                border-[#6E1423]
                pb-5
              "
            >

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-5
                  items-start
                "
              >

                {/* --------------------------------------------
                    PARTIE RÉPUBLIQUE
                --------------------------------------------- */}
                <div
                  className="
                    text-center
                    sm:text-left
                    text-[10px]
                    text-[#6B5B4E]
                    uppercase
                    font-semibold
                    leading-relaxed
                  "
                >
                  <div className="text-[#221812] font-bold">
                    RÉPUBLIQUE DE CÔTE D'IVOIRE
                  </div>

                  <div className="text-[9px] text-gray-500">
                    Union — Discipline — Travail
                  </div>

                  <div className="mt-2 text-[#221812] font-bold">
                    MINISTÈRE DE L'ÉDUCATION NATIONALE
                  </div>

                  <div>
                    DIRECTION RÉGIONALE DE L'ÉDUCATION NATIONALE
                    ET DE L'ALPHABÉTISATION
                  </div>

                  <div className="text-[#6E1423] font-bold">
                    DRENA : DIVO
                  </div>
                </div>

                {/* --------------------------------------------
                    PARTIE ÉTABLISSEMENT
                --------------------------------------------- */}
                <div
                  className="
                    text-center
                    sm:text-right
                    text-[10px]
                    text-[#6B5B4E]
                    uppercase
                    font-semibold
                    leading-relaxed
                  "
                >
                  <div className="text-[#6E1423] font-bold text-sm">
                    COURS SECONDAIRE ELITES DIVO
                  </div>

                  <div className="text-[9px] text-gray-500">
                    TRAVAIL — RIGUEUR — EXCELLENCE
                  </div>

                  <div className="mt-2">
                    ANNÉE SCOLAIRE 2026 – 2027
                  </div>

                  <div>
                    Tél. : 07 07 87 49 78 / 01 03 35 69 82
                  </div>

                  <div>
                    Divo — Côte d'Ivoire
                  </div>
                </div>

              </div>

              {/* =================================================
                  BLOC PRINCIPAL DU RÉCÉPISSÉ
              ================================================== */}
              <div
                className="
                  mt-5
                  flex
                  flex-col
                  sm:flex-row
                  items-center
                  justify-between
                  gap-5
                  bg-[#FBF6EA]
                  p-4
                  sm:p-5
                  rounded-md
                  border
                  border-[#E7DCC7]
                "
              >

                {/* ----------------------------------------------
                    LOGO + TITRE
                ----------------------------------------------- */}
                <div
                  className="
                    flex
                    items-center
                    gap-4
                    min-w-0
                  "
                >

                  {/* LOGO OFFICIEL */}
                  <div
                    className="
                      shrink-0
                      w-20
                      h-20
                      sm:w-24
                      sm:h-24
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <img
                      src={schoolLogo}
                      alt="Logo officiel du Cours Secondaire Elites Divo"
                      className="
                        w-full
                        h-full
                        object-contain
                      "
                    />
                  </div>

                  <div className="min-w-0">

                    <div
                      className="
                        text-[10px]
                        uppercase
                        tracking-widest
                        text-[#6E1423]
                        font-bold
                        mb-1
                      "
                    >
                      ElitesEduca+
                    </div>

                    <h1
                      className="
                        text-lg
                        sm:text-xl
                        font-bold
                        font-serif
                        text-[#450C15]
                        leading-tight
                      "
                    >
                      RÉCÉPISSÉ D'INSCRIPTION
                      <br />
                      EN LIGNE
                    </h1>

                    <p
                      className="
                        text-[10px]
                        sm:text-xs
                        text-[#6B5B4E]
                        mt-1
                      "
                    >
                      Plateforme officielle d'inscription
                    </p>

                    <p
                      className="
                        text-[9px]
                        sm:text-[10px]
                        text-gray-500
                        mt-1
                      "
                    >
                      Enregistré le : {formattedDate}
                    </p>

                  </div>
                </div>

                {/* ----------------------------------------------
                    NUMÉRO DOSSIER + STATUT
                ----------------------------------------------- */}
                <div
                  className="
                    flex
                    flex-col
                    items-center
                    sm:items-end
                    gap-1
                    shrink-0
                  "
                >

                  <div
                    className="
                      text-[9px]
                      uppercase
                      text-gray-500
                      font-medium
                    "
                  >
                    N° de dossier unique
                  </div>

                  <div
                    className="
                      font-mono
                      text-lg
                      sm:text-xl
                      font-bold
                      text-[#6E1423]
                      tracking-wider
                      bg-white
                      px-3
                      py-1.5
                      rounded-sm
                      border
                      border-[#D9A61E]
                      shadow-sm
                    "
                  >
                    {dossier.ref}
                  </div>

                  <StatusBadge
                    statut={dossier.statut}
                    size="sm"
                  />

                </div>

              </div>
            </header>

            {/* =================================================
                SECTION 1 — IDENTITÉ DE L'ÉLÈVE
            ================================================== */}
            <section>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  border-b
                  border-[#E7DCC7]
                  pb-1.5
                  mb-3
                "
              >

                <h2
                  className="
                    font-serif
                    font-bold
                    text-sm
                    sm:text-base
                    text-[#450C15]
                    uppercase
                    tracking-wide
                  "
                >
                  1. Identité de l'élève
                </h2>

                <span
                  className="
                    text-[9px]
                    sm:text-xs
                    font-sans
                    text-gray-500
                  "
                >
                  Statut :
                  <strong
                    className="
                      uppercase
                      text-[#221812]
                      ml-1
                    "
                  >
                    {dossier.statut}
                  </strong>
                </span>

              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-3
                  gap-4
                  bg-[#FFFDF8]
                  p-4
                  rounded-md
                  border
                  border-[#E7DCC7]
                "
              >

                {/* INFORMATIONS ÉLÈVE */}
                <div
                  className="
                    sm:col-span-2
                    space-y-3
                  "
                >

                  <div>
                    <span
                      className="
                        text-[10px]
                        text-gray-500
                        block
                        mb-0.5
                      "
                    >
                      Nom et prénoms
                    </span>

                    <span
                      className="
                        font-bold
                        text-base
                        text-[#221812]
                        uppercase
                      "
                    >
                      {dossier.nom}
                    </span>
                  </div>

                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      gap-x-5
                      gap-y-2
                      text-xs
                    "
                  >

                    <div>
                      <span className="text-gray-500">
                        Niveau / Classe :
                      </span>{' '}
                      <strong className="text-[#6E1423] text-sm">
                        {dossier.niveau}{' '}
                        {dossier.classe
                          ? `(${dossier.classe})`
                          : ''}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        Sexe :
                      </span>{' '}
                      <strong>
                        {dossier.sexe === 'M'
                          ? 'Masculin'
                          : 'Féminin'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        Né(e) le :
                      </span>{' '}
                      <strong>
                        {formattedBirthDate}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        Lieu de naissance :
                      </span>{' '}
                      <strong>
                        {dossier.naissLieu}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        Nationalité :
                      </span>{' '}
                      <strong>
                        {dossier.nationalite}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        Quartier à Divo :
                      </span>{' '}
                      <strong>
                        {dossier.quartier || 'Non précisé'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500">
                        Réside chez :
                      </span>{' '}
                      <strong>
                        {dossier.chezQui}
                      </strong>
                    </div>

                  </div>
                </div>

                {/* PHOTO */}
                <div
                  className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    p-3
                    bg-[#FBF6EA]
                    border
                    border-dashed
                    border-[#E7DCC7]
                    rounded-sm
                  "
                >

                  {dossier.photoUrl ? (
                    <img
                      src={dossier.photoUrl}
                      alt={`Photo de ${dossier.nom}`}
                      className="
                        w-24
                        h-28
                        object-cover
                        rounded-sm
                        border
                        border-gray-300
                        shadow-sm
                      "
                    />
                  ) : (
                    <div
                      className="
                        w-24
                        h-28
                        flex
                        flex-col
                        items-center
                        justify-center
                        text-center
                        text-xs
                        text-gray-400
                        bg-white
                        border
                        border-gray-200
                      "
                    >
                      <span
                        className="
                          text-[10px]
                          uppercase
                          font-bold
                        "
                      >
                        Emplacement
                      </span>

                      <span className="text-[10px]">
                        Photo d'identité
                      </span>
                    </div>
                  )}

                  <span
                    className="
                      text-[10px]
                      text-gray-500
                      mt-1
                    "
                  >
                    Photo d'identité
                  </span>

                </div>

              </div>
            </section>

            {/* =================================================
                SECTION 2 — PARENTS ET TUTEUR
            ================================================== */}
            <section>

              <h2
                className="
                  font-serif
                  font-bold
                  text-sm
                  sm:text-base
                  text-[#450C15]
                  uppercase
                  tracking-wide
                  border-b
                  border-[#E7DCC7]
                  pb-1.5
                  mb-3
                "
              >
                2. Parents & Tuteur légal à Divo
              </h2>

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  gap-4
                  text-xs
                "
              >

                {/* PÈRE */}
                <div
                  className="
                    bg-[#FFFDF8]
                    p-3
                    rounded-sm
                    border
                    border-[#E7DCC7]
                    space-y-1.5
                  "
                >

                  <div
                    className="
                      font-bold
                      text-[#450C15]
                      border-b
                      border-gray-100
                      pb-1
                    "
                  >
                    Père : {dossier.pereNom || '—'}
                  </div>

                  <div>
                    Profession : {dossier.pereProf || '—'}
                  </div>

                  <div>
                    Contact : {dossier.pereContact || '—'}
                  </div>

                  <div>
                    Domicile : {dossier.pereDom || '—'}
                  </div>

                </div>

                {/* MÈRE */}
                <div
                  className="
                    bg-[#FFFDF8]
                    p-3
                    rounded-sm
                    border
                    border-[#E7DCC7]
                    space-y-1.5
                  "
                >

                  <div
                    className="
                      font-bold
                      text-[#450C15]
                      border-b
                      border-gray-100
                      pb-1
                    "
                  >
                    Mère : {dossier.mereNom || '—'}
                  </div>

                  <div>
                    Profession : {dossier.mereProf || '—'}
                  </div>

                  <div>
                    Contact : {dossier.mereContact || '—'}
                  </div>

                  <div>
                    Domicile : {dossier.mereDom || '—'}
                  </div>

                </div>

                {/* TUTEUR */}
                <div
                  className="
                    sm:col-span-2
                    bg-[#FBF6EA]
                    p-3
                    rounded-sm
                    border
                    border-[#E7DCC7]
                    space-y-2
                  "
                >

                  <div
                    className="
                      font-bold
                      text-[#2F6B3A]
                    "
                  >
                    Tuteur / Correspondant résidant à Divo :
                    {' '}
                    {dossier.tutNom || 'Même que parent'}
                  </div>

                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-3
                      gap-2
                    "
                  >

                    <div>
                      Lien : {dossier.tutLien || '—'}
                    </div>

                    <div>
                      Quartier : {dossier.tutQuartier || 'Divo'}
                    </div>

                    <div>
                      Contact urgence :
                      {' '}
                      {dossier.tutContact || '—'}
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* =================================================
                SECTION 2 BIS — SITUATION FINANCIÈRE
            ================================================== */}
            <section>
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  border-b
                  border-[#E7DCC7]
                  pb-1.5
                  mb-3
                "
              >
                <h2
                  className="
                    font-serif
                    font-bold
                    text-sm
                    sm:text-base
                    text-[#450C15]
                    uppercase
                    tracking-wide
                    flex
                    items-center
                    gap-1.5
                  "
                >
                  <Wallet className="w-4 h-4" />
                  3. Situation financière (scolarité)
                </h2>

                <span
                  className={`
                    text-[10px]
                    sm:text-xs
                    font-bold
                    uppercase
                    px-2.5
                    py-1
                    rounded-full
                    ${
                      solde
                        ? 'bg-[#E8F5E9] text-[#2E7D32]'
                        : 'bg-[#FFF3D6] text-[#8A5A00]'
                    }
                  `}
                >
                  {solde ? 'Soldé' : 'Non soldé'}
                </span>
              </div>

              <div
                className="
                  grid
                  grid-cols-2
                  sm:grid-cols-4
                  gap-3
                  bg-[#FFFDF8]
                  p-4
                  rounded-md
                  border
                  border-[#E7DCC7]
                  text-xs
                "
              >
                <div className="bg-[#FBF6EA] rounded-sm p-2.5">
                  <span className="text-[10px] text-gray-500 block">
                    Montant total dû
                  </span>
                  <strong className="text-sm text-[#221812]">
                    {formatFCFA(dossier.montantTotal)}
                  </strong>
                </div>

                <div className="bg-[#FBF6EA] rounded-sm p-2.5">
                  <span className="text-[10px] text-gray-500 block">
                    Montant déjà payé
                  </span>
                  <strong className="text-sm text-[#2F6B3A]">
                    {formatFCFA(dossier.montantPaye)}
                  </strong>
                </div>

                <div
                  className={`rounded-sm p-2.5 ${
                    solde ? 'bg-[#E8F5E9]' : 'bg-[#FFEBEE]'
                  }`}
                >
                  <span
                    className={`text-[10px] block ${
                      solde ? 'text-[#2E7D32]' : 'text-[#C62828]'
                    }`}
                  >
                    Montant restant
                  </span>
                  <strong
                    className={`text-sm ${
                      solde ? 'text-[#2E7D32]' : 'text-[#C62828]'
                    }`}
                  >
                    {formatFCFA(montantRestant)}
                  </strong>
                </div>

                <div className="bg-[#FBF6EA] rounded-sm p-2.5">
                  <span className="text-[10px] text-gray-500 flex items-center gap-1">
                    <CalendarClock className="w-3 h-3" />
                    Prochain paiement
                  </span>
                  <strong className="text-sm text-[#221812]">
                    {!solde && dossier.prochainPaiementDate
                      ? new Date(dossier.prochainPaiementDate).toLocaleDateString(
                          'fr-FR',
                          { day: '2-digit', month: 'short', year: 'numeric' }
                        )
                      : solde
                      ? '—'
                      : 'À définir'}
                  </strong>
                </div>
              </div>

              <p className="text-[9px] text-gray-400 mt-1.5 italic">
                Scannez le QR code en bas de ce document pour vérifier cette
                situation financière en temps réel.
              </p>
            </section>

            {/* =================================================
                SECTION 3 — PIÈCES
            ================================================== */}
            <section>

              <h2
                className="
                  font-serif
                  font-bold
                  text-sm
                  sm:text-base
                  text-[#450C15]
                  uppercase
                  tracking-wide
                  border-b
                  border-[#E7DCC7]
                  pb-1.5
                  mb-3
                "
              >
                4. Contrôle des pièces au secrétariat
              </h2>

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  gap-2
                  text-xs
                "
              >

                {LISTE_DOCUMENTS_REQUIS.map((doc) => {

                  const isChecked =
                    dossier.docsFournis?.includes(doc.id);

                  return (
                    <div
                      key={doc.id}
                      className={`
                        flex
                        items-center
                        gap-2
                        p-2
                        rounded-sm
                        border
                        ${
                          isChecked
                            ? `
                              bg-emerald-50/70
                              border-emerald-300
                              text-emerald-900
                              font-medium
                            `
                            : `
                              bg-gray-50
                              border-gray-200
                              text-gray-600
                            `
                        }
                      `}
                    >

                      <span
                        className={`
                          w-4
                          h-4
                          shrink-0
                          rounded-sm
                          flex
                          items-center
                          justify-center
                          text-[10px]
                          font-bold
                          ${
                            isChecked
                              ? 'bg-emerald-600 text-white'
                              : 'border border-gray-400 bg-white'
                          }
                        `}
                      >
                        {isChecked ? '✓' : ''}
                      </span>

                      <span className="truncate">
                        {doc.label}
                      </span>

                    </div>
                  );
                })}

              </div>
            </section>

            {/* =================================================
                AVIS AUX PARENTS
            ================================================== */}
            <div
              className="
                bg-[#FFF9E6]
                border-l-4
                border-[#D9A61E]
                p-3
                sm:p-4
                text-xs
                text-[#6B5B4E]
                leading-relaxed
                rounded-r-sm
              "
            >

              <strong className="text-[#450C15]">
                Avis aux parents :
              </strong>{' '}

              Ce récépissé confirme l'enregistrement numérique
              sur la plateforme <em>ElitesEduca+</em>.

              {' '}

              Pour valider définitivement l'inscription de l'élève,
              vous devez impérativement déposer le dossier physique
              complet auprès du secrétariat du{' '}

              <strong className="text-[#450C15]">
                Cours Secondaire Elites Divo
              </strong>{' '}

              muni de ce document.

            </div>

            {/* =================================================
                INFORMATIONS DE CONTACT
            ================================================== */}
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-3
                text-[10px]
                text-gray-500
                border-t
                border-gray-200
                pt-3
              "
            >

              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D9A61E]" />

                <span>
                  Divo, Côte d'Ivoire
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D9A61E]" />

                <span>
                  07 07 87 49 78 / 01 03 35 69 82
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D9A61E]" />

                <span>
                  Document officiel ElitesEduca+
                </span>
              </div>

            </div>

            {/* =================================================
                SIGNATURES + QR CODE
            ================================================== */}
            <div
              className="
                pt-4
                border-t
                border-gray-200
                grid
                grid-cols-1
                sm:grid-cols-3
                gap-5
                text-center
                text-xs
              "
            >

              {/* SIGNATURE PARENT */}
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-between
                  h-28
                  border
                  border-dashed
                  border-gray-300
                  p-2
                  rounded-sm
                  bg-gray-50/50
                "
              >

                <span className="font-bold text-gray-600">
                  Signature du Parent / Tuteur
                </span>

                <span className="text-[10px] text-gray-400">
                  Précédé de « Lu et approuvé »
                </span>

              </div>

              {/* QR CODE */}
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  border
                  border-dashed
                  border-gray-300
                  p-2
                  rounded-sm
                  bg-gray-50/50
                "
              >

                <QRCodeCanvas
                  value={verificationUrl}
                  size={80}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#450C15"
                  marginSize={1}
                />

                <span
                  className="
                    font-mono
                    text-[10px]
                    mt-1
                    font-bold
                    text-[#6E1423]
                  "
                >
                  {dossier.ref}
                </span>

                <span className="text-[9px] text-gray-400 text-center leading-tight">
                  Scanner pour vérifier le solde
                </span>

              </div>

              {/* VISA SECRÉTARIAT */}
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-between
                  h-28
                  border
                  border-dashed
                  border-gray-300
                  p-2
                  rounded-sm
                  bg-gray-50/50
                "
              >

                <span className="font-bold text-gray-600">
                  Cachet & Visa du Secrétariat
                </span>

                <span className="text-[10px] text-gray-400">
                  Divo, le .................... 2026
                </span>

              </div>

            </div>

            {/* =================================================
                PIED DU DOCUMENT
            ================================================== */}
            <footer
              className="
                border-t-2
                border-[#6E1423]
                pt-3
                text-center
              "
            >

              <div
                className="
                  text-[9px]
                  uppercase
                  tracking-widest
                  font-bold
                  text-[#6E1423]
                "
              >
                COURS SECONDAIRE ELITES DIVO
              </div>

              <div
                className="
                  text-[9px]
                  text-gray-500
                  mt-1
                "
              >
                Travail — Rigueur — Excellence
              </div>

              <div
                className="
                  text-[8px]
                  text-gray-400
                  mt-1
                "
              >
                © 2026 Cours Secondaire Elites Divo —
                Tous droits réservés.
              </div>

            </footer>

          </div>
        </div>

        {/* ====================================================
            FOOTER DU MODAL
            Invisible à l'impression
        ===================================================== */}
        <div
          className="
            px-5
            sm:px-6
            py-3
            bg-[#FBF6EA]
            border-t
            border-[#E7DCC7]
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-3
            no-print
          "
        >

          <span
            className="
              text-xs
              text-[#6B5B4E]
              text-center
              sm:text-left
            "
          >
            Conservez précieusement le numéro{' '}
            <strong>{dossier.ref}</strong>{' '}
            pour suivre votre dossier en ligne.
          </span>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={onClose}
              className="
                px-4
                py-1.5
                text-sm
                font-semibold
                text-gray-600
                hover:text-gray-900
                border
                border-gray-300
                rounded-sm
                hover:bg-white
                transition-colors
                cursor-pointer
              "
            >
              Fermer
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="
                inline-flex
                items-center
                gap-1.5
                bg-[#6E1423]
                hover:bg-[#450C15]
                text-[#F4D889]
                font-semibold
                text-sm
                px-4
                py-1.5
                rounded-sm
                transition-colors
                cursor-pointer
                disabled:opacity-60
                disabled:cursor-wait
              "
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isGeneratingPdf ? 'Génération...' : 'Télécharger PDF'}</span>
            </button>

          </div>
        </div>

      </div>

      {/* ======================================================
          STYLES D'IMPRESSION
      ======================================================= */}
      <style>{`
        @media print {

          @page {
            size: A4;
            margin: 10mm;
          }

          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          body * {
            visibility: hidden !important;
          }

          #printable-receipt,
          #printable-receipt * {
            visibility: visible !important;
          }

          #printable-receipt {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            overflow: visible !important;
          }

          .receipt-paper {
            width: 100% !important;
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .no-print {
            display: none !important;
          }

          button {
            display: none !important;
          }

          img {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          * {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          section,
          header,
          footer,
          .bg-\\[\\#FFFDF8\\],
          .bg-\\[\\#FBF6EA\\] {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }

        @media screen and (max-width: 640px) {
          .receipt-paper {
            font-size: 0.95rem;
          }
        }
      `}</style>

    </div>
  );
};

