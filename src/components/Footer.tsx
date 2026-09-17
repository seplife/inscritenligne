import React from 'react';
import type { PageId } from './Header';
import { Phone, MapPin, Mail, ShieldCheck, ArrowUpRight } from 'lucide-react';

// Logo réel de l'établissement
import schoolLogo from '../assets/logo_csrd.png';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#450C15] text-[#EFE3C8] pt-14 pb-8 border-t-4 border-[#D9A61E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">

          {/* =====================================================
              COLONNE 1 : LOGO & PHILOSOPHIE
          ====================================================== */}
          <div className="md:col-span-2 space-y-4">

            {/* Logo officiel */}
            <div className="flex items-center">
              <img
                src={schoolLogo}
                alt="Logo du Cours Secondaire Elites Divo"
                className="
                  w-24
                  h-24
                  object-contain 
                "
              />
            </div>

            <p className="text-sm text-[#D9C9A8] max-w-md leading-relaxed mt-3">
              Le <strong>Cours Secondaire Elites Divo</strong> est un établissement
              d'enseignement général de référence à Divo, accompagnant les élèves
              de la 6ème à la Terminale vers l'excellence académique et humaine.
            </p>

            <div className="
              inline-block
              bg-[#6E1423]
              text-[#F4D889]
              font-bold
              text-xs
              uppercase
              tracking-widest
              px-4
              py-2
              rounded-xs
              border
              border-[#D9A61E]/40
            ">
              Travail &mdash; Rigueur &mdash; Excellence
            </div>
          </div>

          {/* =====================================================
              COLONNE 2 : NAVIGATION RAPIDE
          ====================================================== */}
          <div className="space-y-3">

            <h4 className="
              font-serif
              text-[#F4D889]
              font-semibold
              text-base
              tracking-wide
              uppercase
            ">
              Liens utiles
            </h4>

            <ul className="space-y-2 text-sm text-[#D9C9A8]">

              <li>
                <button
                  onClick={() => onNavigate('accueil')}
                  className="
                    hover:text-white
                    transition-colors
                    cursor-pointer
                    flex
                    items-center
                    gap-1
                  "
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D9A61E]" />
                  <span>Accueil & Présentation</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => onNavigate('inscription')}
                  className="
                    hover:text-white
                    transition-colors
                    cursor-pointer
                    flex
                    items-center
                    gap-1
                  "
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D9A61E]" />
                  <span>Fiche d'inscription 2026-2027</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => onNavigate('suivi')}
                  className="
                    hover:text-white
                    transition-colors
                    cursor-pointer
                    flex
                    items-center
                    gap-1
                  "
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D9A61E]" />
                  <span>Suivre l'état d'un dossier</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => onNavigate('pieces')}
                  className="
                    hover:text-white
                    transition-colors
                    cursor-pointer
                    flex
                    items-center
                    gap-1
                  "
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D9A61E]" />
                  <span>Pièces à fournir & Tarifs</span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="
                    hover:text-white
                    transition-colors
                    cursor-pointer
                    flex
                    items-center
                    gap-1
                    text-[#F4D889]
                  "
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Espace Secrétariat / Admin</span>
                </button>
              </li>

            </ul>
          </div>

          {/* =====================================================
              COLONNE 3 : CONTACT
          ====================================================== */}
          <div className="space-y-3">

            <h4 className="
              font-serif
              text-[#F4D889]
              font-semibold
              text-base
              tracking-wide
              uppercase
            ">
              Secrétariat & Contact
            </h4>

            <ul className="space-y-3 text-sm text-[#D9C9A8]">

              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D9A61E] shrink-0 mt-0.5" />

                <span>
                  Divo, Côte d'Ivoire &middot; Quartier administratif
                  (près de la DRENA)
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D9A61E] shrink-0" />

                <div className="flex flex-col">
                  <a
                    href="tel:+2250707874978"
                    className="hover:text-white"
                  >
                    (+225) 07 07 87 49 78
                  </a>

                  <a
                    href="tel:+2250103356982"
                    className="hover:text-white"
                  >
                    (+225) 01 03 35 69 82
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D9A61E] shrink-0" />

                <a
                  href="mailto:contact@elitesdivo.ci"
                  className="hover:text-white transition-colors"
                >
                  contact@elitesdivo.ci
                </a>
              </li>

            </ul>

            <div className="
              text-xs
              text-[#D9C9A8]/80
              pt-2
              border-t
              border-white/5
            ">
              Horaires : Du Lundi au Vendredi de 07h30 à 16h30
              &bull; Samedi de 08h00 à 12h00
            </div>

          </div>
        </div>

        {/* =====================================================
            COPYRIGHT
        ====================================================== */}
        <div className="
          pt-6
          flex
          flex-col
          sm:flex-row
          items-center
          justify-between
          gap-3
          text-xs
          text-[#B39E76]
        ">

          <div>
            &copy; 2026 Cours Secondaire Elites Divo &middot;
            Tous droits réservés.
          </div>

          <div className="flex items-center gap-4">

            <span>
              Plateforme Numérique ElitesEduca+
            </span>

            <span>&bull;</span>

            <button
              onClick={() => onNavigate('admin')}
              className="
                hover:underline
                text-[#F4D889]
                cursor-pointer
              "
            >
              Accès réservé administration
            </button>

          </div>
        </div>

      </div>
    </footer>
  );
};

