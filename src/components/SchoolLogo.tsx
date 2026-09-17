import React from 'react';

// ============================================================
// LOGO OFFICIEL DE L'ÉTABLISSEMENT
// Fichier : src/assets/logo_csrd.png
// ============================================================
import schoolLogo from '../assets/logo_csrd.png';

interface SchoolLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'full' | 'icon' | 'badge';
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'full',
}) => {

  // ==========================================================
  // DIMENSIONS DU LOGO
  // ==========================================================
  const sizeMap = {
    sm: {
      icon: 'w-9 h-9',
      title: 'text-base',
      sub: 'text-[10px]',
    },

    md: {
      icon: 'w-12 h-12',
      title: 'text-xl',
      sub: 'text-xs',
    },

    lg: {
      icon: 'w-[68px] h-[68px]',
      title: 'text-2xl',
      sub: 'text-sm',
    },

    xl: {
      icon: 'w-[110px] h-[110px]',
      title: 'text-3xl',
      sub: 'text-base',
    },
  };

  const {
    icon: iconSize,
    title: titleClass,
    sub: subClass,
  } = sizeMap[size];

  // ==========================================================
  // LOGO IMAGE
  // ==========================================================
  const logoImage = (
    <img
      src={schoolLogo}
      alt="Logo officiel du Cours Secondaire Elites Divo"
      className={`
        ${iconSize}
        object-contain
        shrink-0
        drop-shadow-sm
      `}
    />
  );

  // ==========================================================
  // VARIANT ICON
  // Affiche uniquement le logo
  // ==========================================================
  if (variant === 'icon') {
    return (
      <div
        className={`
          inline-flex
          items-center
          justify-center
          ${className}
        `}
      >
        {logoImage}
      </div>
    );
  }

  // ==========================================================
  // VARIANT BADGE
  // Logo avec un cadre institutionnel
  // ==========================================================
  if (variant === 'badge') {
    return (
      <div
        className={`
          inline-flex
          items-center
          justify-center
          rounded-full
          bg-[#FBF6EA]
          border-2
          border-[#D9A61E]
          p-1.5
          shadow-sm
          ${className}
        `}
      >
        {logoImage}
      </div>
    );
  }

  // ==========================================================
  // VARIANT FULL
  // Logo + identité de l'établissement
  // ==========================================================
  return (
    <div
      className={`
        inline-flex
        items-center
        gap-3
        ${className}
      `}
    >

      {/* Logo officiel */}
      {logoImage}

      {/* Texte */}
      {showText && (
        <div className="flex flex-col leading-tight">

          <span
            className={`
              font-serif
              font-bold
              text-[#450C15]
              tracking-tight
              ${titleClass}
            `}
          >
            Elites
            <span className="text-[#D9A61E]">
              Educa+
            </span>
          </span>

          <span
            className={`
              text-[#6B5B4E]
              font-medium
              tracking-wide
              ${subClass}
            `}
          >
            Cours Secondaire Elites Divo
            {' · '}
            Rentrée 2026-2027
          </span>

        </div>
      )}

    </div>
  );
};

