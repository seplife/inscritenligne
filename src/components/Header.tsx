import React, { useState } from 'react';
import {
  Menu,
  X,
  Phone,
  UserPlus,
  Search,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

// ============================================================
// LOGO OFFICIEL
// Fichier : src/assets/logo_csrd.png
// ============================================================
import schoolLogo from '../assets/logo_csrd.png';

export type PageId =
  | 'accueil'
  | 'inscription'
  | 'suivi'
  | 'pieces'
  | 'admin'
  | 'contact'
  | 'verification';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ==========================================================
  // NAVIGATION
  // ==========================================================
  const navLinks: { id: PageId; label: string }[] = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'inscription', label: 'Inscription' },
    { id: 'suivi', label: 'Suivi de dossier' },
    { id: 'pieces', label: 'Pièces & Modalités' },
    { id: 'admin', label: 'Administration' },
    { id: 'contact', label: 'Contact' },
  ];

  // ==========================================================
  // GESTION DE LA NAVIGATION
  // ==========================================================
  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <header
      className="
        sticky
        top-0
        z-40
        bg-white/95
        backdrop-blur-md
        border-b
        border-[#E7DCC7]
        shadow-sm
      "
    >

      {/* ======================================================
          BARRE SUPÉRIEURE
      ======================================================= */}
      <div
        className="
          bg-[#450C15]
          text-[#F4D889]
          text-xs
          py-1.5
          px-4
          hidden
          md:block
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            flex
            justify-between
            items-center
            gap-4
          "
        >

          {/* Informations établissement */}
          <div className="flex items-center gap-4">

            <span
              className="
                font-semibold
                tracking-wider
                whitespace-nowrap
              "
            >
              ANNÉE SCOLAIRE 2026 – 2027
            </span>

            <span className="text-[#D9A61E]">
              &bull;
            </span>

            <span className="text-[#E7DCC7]">
              Cours Secondaire Elites Divo
            </span>

            <span className="text-[#D9A61E]">
              &middot;
            </span>

            <span className="text-[#E7DCC7]">
              DRENA : Divo
            </span>

          </div>

          {/* Téléphones */}
          <div className="flex items-center gap-4 shrink-0">

            <a
              href="tel:+2250707874978"
              className="
                inline-flex
                items-center
                gap-1.5
                hover:text-white
                transition-colors
              "
            >
              <Phone
                className="
                  w-3.5
                  h-3.5
                  text-[#D9A61E]
                "
              />

              <span>
                (+225) 07 07 87 49 78
              </span>
            </a>

            <span className="text-[#D9A61E]">
              /
            </span>

            <a
              href="tel:+2250103356982"
              className="
                hover:text-white
                transition-colors
              "
            >
              01 03 35 69 82
            </a>

          </div>
        </div>
      </div>

      {/* ======================================================
          NAVBAR PRINCIPALE
      ======================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div
          className="
            flex
            items-center
            justify-between
            min-h-[82px]
            gap-6
          "
        >

          {/* ==================================================
              LOGO + IDENTITÉ
          =================================================== */}
          <button
            type="button"
            onClick={() => handleNav('accueil')}
            className="
              flex
              items-center
              gap-3
              text-left
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#D9A61E]
              rounded-md
              cursor-pointer
              shrink-0
            "
            aria-label="Retour à l'accueil"
          >

            {/* Logo officiel */}
            <div
              className="
                w-16
                h-16
                sm:w-[72px]
                sm:h-[72px]
                flex
                items-center
                justify-center
                shrink-0
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

            {/* Nom établissement */}
            <div className="hidden sm:block">

              <div
                className="
                  text-[#450C15]
                  font-serif
                  font-bold
                  text-sm
                  lg:text-base
                  leading-tight
                "
              >
                COURS SECONDAIRE
              </div>

              <div
                className="
                  text-[#6E1423]
                  font-serif
                  font-bold
                  text-lg
                  lg:text-xl
                  leading-tight
                "
              >
                ELITES DIVO
              </div>

              <div
                className="
                  text-[9px]
                  text-[#8A765F]
                  uppercase
                  tracking-widest
                  mt-0.5
                "
              >
                Travail — Rigueur — Excellence
              </div>

            </div>

          </button>

          {/* ==================================================
              NAVIGATION DESKTOP
          =================================================== */}
          <nav
            className="
              hidden
              xl:flex
              items-center
              gap-5
              2xl:gap-7
            "
            aria-label="Navigation principale"
          >

            {navLinks.map((link) => {

              const isActive =
                currentPage === link.id;

              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNav(link.id)}
                  className={`
                    text-sm
                    font-medium
                    transition-all
                    py-2
                    relative
                    cursor-pointer
                    whitespace-nowrap
                    ${
                      isActive
                        ? 'text-[#6E1423] font-bold'
                        : 'text-[#221812] hover:text-[#6E1423]'
                    }
                  `}
                >

                  {link.label}

                  {isActive && (
                    <span
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        h-0.5
                        bg-[#D9A61E]
                        rounded-full
                      "
                    />
                  )}

                </button>
              );
            })}

          </nav>

          {/* ==================================================
              BOUTONS D'ACTION DESKTOP
          =================================================== */}
          <div
            className="
              hidden
              lg:flex
              xl:hidden
              2xl:flex
              items-center
              gap-2
              shrink-0
            "
          >

            <button
              type="button"
              onClick={() => handleNav('suivi')}
              className="
                inline-flex
                items-center
                gap-1.5
                px-3
                py-2
                text-xs
                font-semibold
                text-[#6E1423]
                hover:bg-[#FBF6EA]
                border
                border-[#6E1423]
                rounded-sm
                transition-all
                cursor-pointer
              "
            >
              <Search className="w-4 h-4" />
              <span>Suivre</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('inscription')}
              className="
                inline-flex
                items-center
                gap-1.5
                px-3.5
                py-2
                text-xs
                font-semibold
                text-[#F4D889]
                bg-[#6E1423]
                hover:bg-[#450C15]
                rounded-sm
                shadow-sm
                transition-all
                cursor-pointer
              "
            >
              <UserPlus className="w-4 h-4" />
              <span>Inscrire un élève</span>
            </button>

          </div>

          {/* ==================================================
              ACTIONS TABLETTE / MOBILE
          =================================================== */}
          <div
            className="
              flex
              items-center
              gap-2
              lg:hidden
            "
          >

            {/* Suivi rapide */}
            <button
              type="button"
              onClick={() => handleNav('suivi')}
              className="
                hidden
                sm:inline-flex
                items-center
                justify-center
                p-2
                text-[#6E1423]
                border
                border-[#E7DCC7]
                hover:bg-[#FBF6EA]
                rounded-md
                transition-colors
                cursor-pointer
              "
              aria-label="Suivre un dossier"
              title="Suivre un dossier"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Menu */}
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
              className="
                p-2
                text-[#450C15]
                hover:bg-[#FBF6EA]
                rounded-md
                transition-colors
                cursor-pointer
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#D9A61E]
              "
              aria-label={
                mobileMenuOpen
                  ? 'Fermer le menu'
                  : 'Ouvrir le menu'
              }
              aria-expanded={mobileMenuOpen}
            >

              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}

            </button>

          </div>

        </div>
      </div>

      {/* ======================================================
          MENU MOBILE
      ======================================================= */}
      {mobileMenuOpen && (
        <div
          className="
            lg:hidden
            bg-white
            border-t
            border-[#E7DCC7]
            border-b
            shadow-lg
          "
        >

          <div
            className="
              max-w-7xl
              mx-auto
              px-4
              pt-3
              pb-6
            "
          >

            {/* Identité mobile */}
            <div
              className="
                flex
                items-center
                gap-3
                pb-4
                mb-2
                border-b
                border-[#E7DCC7]
              "
            >

              <div
                className="
                  w-14
                  h-14
                  shrink-0
                "
              >
                <img
                  src={schoolLogo}
                  alt="Logo Cours Secondaire Elites Divo"
                  className="
                    w-full
                    h-full
                    object-contain
                  "
                />
              </div>

              <div>
                <div
                  className="
                    text-xs
                    font-bold
                    text-[#450C15]
                  "
                >
                  COURS SECONDAIRE
                </div>

                <div
                  className="
                    text-base
                    font-bold
                    font-serif
                    text-[#6E1423]
                  "
                >
                  ELITES DIVO
                </div>

                <div
                  className="
                    text-[9px]
                    text-[#8A765F]
                    uppercase
                    tracking-wide
                  "
                >
                  Travail — Rigueur — Excellence
                </div>
              </div>

            </div>

            {/* Liens */}
            <div className="space-y-1">

              {navLinks.map((link) => {

                const isActive =
                  currentPage === link.id;

                return (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleNav(link.id)}
                    className={`
                      w-full
                      text-left
                      px-3
                      py-3
                      rounded-sm
                      text-sm
                      font-medium
                      flex
                      items-center
                      justify-between
                      transition-colors
                      cursor-pointer
                      ${
                        isActive
                          ? `
                            bg-[#FBF6EA]
                            text-[#6E1423]
                            font-bold
                            border-l-4
                            border-[#D9A61E]
                          `
                          : `
                            text-[#221812]
                            hover:bg-gray-50
                          `
                      }
                    `}
                  >

                    <span>
                      {link.label}
                    </span>

                    <div className="flex items-center gap-2">

                      {link.id === 'admin' && (
                        <ShieldCheck
                          className="
                            w-4
                            h-4
                            text-[#6E1423]
                            opacity-70
                          "
                        />
                      )}

                      <ChevronRight
                        className={`
                          w-4
                          h-4
                          ${
                            isActive
                              ? 'text-[#D9A61E]'
                              : 'text-gray-300'
                          }
                        `}
                      />

                    </div>

                  </button>
                );
              })}

            </div>

            {/* =================================================
                ACTIONS MOBILE
            ================================================== */}
            <div
              className="
                pt-4
                mt-3
                border-t
                border-[#E7DCC7]
                space-y-2
              "
            >

              <button
                type="button"
                onClick={() =>
                  handleNav('inscription')
                }
                className="
                  w-full
                  py-3
                  px-4
                  bg-[#6E1423]
                  hover:bg-[#450C15]
                  text-[#F4D889]
                  font-bold
                  text-center
                  rounded-sm
                  shadow-sm
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-colors
                  cursor-pointer
                "
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  Inscrire mon enfant
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleNav('suivi')}
                className="
                  w-full
                  py-3
                  px-4
                  border
                  border-[#6E1423]
                  text-[#6E1423]
                  hover:bg-[#FBF6EA]
                  font-bold
                  text-center
                  rounded-sm
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-colors
                  cursor-pointer
                "
              >
                <Search className="w-4 h-4" />
                <span>
                  Suivre un dossier
                </span>
              </button>

            </div>

            {/* =================================================
                CONTACT MOBILE
            ================================================== */}
            <div
              className="
                mt-4
                pt-4
                border-t
                border-[#E7DCC7]
                text-center
              "
            >

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-widest
                  text-gray-400
                  mb-2
                "
              >
                Secrétariat
              </p>

              <div
                className="
                  flex
                  flex-col
                  items-center
                  gap-1
                "
              >

                <a
                  href="tel:+2250707874978"
                  className="
                    text-sm
                    font-semibold
                    text-[#6E1423]
                  "
                >
                  07 07 87 49 78
                </a>

                <a
                  href="tel:+2250103356982"
                  className="
                    text-sm
                    font-semibold
                    text-[#6E1423]
                  "
                >
                  01 03 35 69 82
                </a>

              </div>

            </div>

          </div>
        </div>
      )}

    </header>
  );
};

