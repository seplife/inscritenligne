import React from 'react';
import type { StatutDossier } from '../types/dossier';
import { CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  statut: StatutDossier;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  statut,
  size = 'md',
  showIcon = true,
}) => {
  const configs: Record<
    StatutDossier,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    recu: {
      label: 'Dossier Reçu',
      bg: 'bg-[#FFF3D6]',
      text: 'text-[#8A5A00]',
      border: 'border-[#E5BE66]',
      icon: <Clock className="w-3.5 h-3.5 shrink-0" />,
    },
    verification: {
      label: 'En Vérification',
      bg: 'bg-[#E3F2FD]',
      text: 'text-[#1565C0]',
      border: 'border-[#90CAF9]',
      icon: <AlertTriangle className="w-3.5 h-3.5 shrink-0" />,
    },
    valide: {
      label: 'Inscription Validée',
      bg: 'bg-[#E8F5E9]',
      text: 'text-[#2E7D32]',
      border: 'border-[#A5D6A7]',
      icon: <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />,
    },
    rejete: {
      label: 'Dossier Incomplet',
      bg: 'bg-[#FFEBEE]',
      text: 'text-[#C62828]',
      border: 'border-[#FFCDD2]',
      icon: <XCircle className="w-3.5 h-3.5 shrink-0" />,
    },
  };

  const c = configs[statut] || configs.recu;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs transition-colors ${c.bg} ${c.text} ${c.border} ${sizeClasses[size]}`}
    >
      {showIcon && c.icon}
      <span>{c.label}</span>
    </span>
  );
};
