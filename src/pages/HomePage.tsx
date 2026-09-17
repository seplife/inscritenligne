import React, { useState } from 'react';
import type { PageId } from '../components/Header';
import { SchoolLogo } from '../components/SchoolLogo';
import {
  FileText,
  Clock,
  CheckCircle2,
  Phone,
  ArrowRight,
  GraduationCap,
  Users,
  Award,
  ChevronDown,
  Sparkles,
  BookOpen,
  Calendar,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "L'inscription en ligne remplace-t-elle le dépôt physique des pièces ?",
      a: "Non. L'inscription en ligne sur ElitesEduca+ permet de pré-enregistrer le dossier de votre enfant, de générer son numéro de dossier officiel et d'imprimer le récépissé. Vous devez ensuite vous présenter au secrétariat avec les pièces physiques obligatoires (extrait d'acte de naissance, CNI du parent résidant à Divo, livret scolaire, etc.) pour la validation définitive.",
    },
    {
      q: 'Est-il obligatoire que le parent ou tuteur réside à Divo ?',
      a: "Oui, c'est une condition impérative et stricte fixée par la direction du Cours Secondaire Elites Divo. L'élève doit vivre chez son père, sa mère ou un tuteur dûment identifié et domicilié à Divo pour assurer un suivi disciplinaire et scolaire régulier.",
    },
    {
      q: 'Comment suivre l’avancement du dossier de mon enfant ?',
      a: 'Dès que vous validez la fiche d’inscription, un numéro de dossier unique au format ED-2026-XXXX vous est attribué. Rendez-vous dans la rubrique « Suivi de dossier » et entrez ce numéro pour connaître en temps réel son statut (Reçu, En cours de vérification, Validé ou Incomplet).',
    },
    {
      q: 'Quelles sont les séries proposées au second cycle (Lycée) ?',
      a: 'Le Cours Secondaire Elites Divo forme au premier cycle (de la 6ème à la 3ème) et au second cycle dans les séries générales : Seconde A et C, Première A, C, D et Terminale A (A1/A2), C et D avec des enseignants expérimentés.',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FBF6EA] via-[#F7EED9] to-[#FBF6EA] pt-12 pb-20 border-b border-[#E7DCC7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2F6B3A]/10 border border-[#2F6B3A]/30 text-[#1E4A28] font-semibold text-xs tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#2F6B3A] animate-pulse" />
                <span>Rentrée scolaire 2026 – 2027 &middot; Inscriptions ouvertes</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-[#450C15] leading-[1.12] tracking-tight">
                L'inscription à Elites Divo se fait maintenant{' '}
                <span className="text-[#6E1423] underline decoration-[#D9A61E] decoration-wavy decoration-2">
                  en ligne
                </span>
                .
              </h1>

              <p className="text-lg text-[#6B5B4E] leading-relaxed max-w-2xl font-normal">
                <strong>ElitesEduca+</strong> est le portail officiel du Cours Secondaire Elites Divo.
                Remplissez la fiche individuelle de votre enfant, suivez le traitement de son dossier
                en direct et obtenez votre récépissé en quelques minutes, sans file d'attente.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('inscription')}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#6E1423] hover:bg-[#450C15] text-[#F4D889] font-bold text-base rounded-sm shadow-md hover:shadow-lg transition-all transform active:translate-y-0.5 cursor-pointer"
                >
                  <span>Remplir la fiche d'inscription</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('suivi')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-[#FBF6EA] text-[#6E1423] border-2 border-[#6E1423] font-bold text-base rounded-sm transition-all cursor-pointer"
                >
                  <Clock className="w-4 h-4" />
                  <span>Suivre un dossier existant</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-4 flex items-center gap-6 text-xs text-[#6B5B4E]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2F6B3A]" />
                  <span>Fiche conforme DRENA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2F6B3A]" />
                  <span>Numéro de dossier instantané</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2F6B3A]" />
                  <span>Récépissé officiel imprimable</span>
                </div>
              </div>
            </div>

            {/* Right Col: School Emblem & Ribbon Card */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative p-6 bg-white/80 backdrop-blur-xs rounded-lg border border-[#E7DCC7] shadow-xl w-full max-w-sm flex flex-col items-center text-center space-y-6">
                <div className="w-32 h-32 flex items-center justify-center">
                  <SchoolLogo size="xl" showText={false} variant="icon" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-bold text-[#450C15]">
                    Cours Secondaire Elites
                  </h3>
                  <p className="text-xs uppercase font-bold tracking-widest text-[#D9A61E]">
                    Établissement Privé d'Excellence
                  </p>
                  <p className="text-xs text-[#6B5B4E]">Divo &middot; Région du Lôh-Djiboua</p>
                </div>

                <div className="w-full bg-gradient-to-r from-[#450C15] via-[#6E1423] to-[#450C15] text-[#F4D889] p-4 rounded-sm shadow-md border-t-2 border-[#D9A61E]">
                  <div className="font-bold text-xs uppercase tracking-wider">
                    TRAVAIL &mdash; RIGUEUR &mdash; EXCELLENCE
                  </div>
                  <div className="text-xs text-white/90 font-mono mt-1.5 flex items-center justify-center gap-2">
                    <Phone className="w-3 h-3 text-[#D9A61E]" />
                    <span>07 07 87 49 78 &nbsp;/&nbsp; 01 03 35 69 82</span>
                  </div>
                </div>

                <div className="text-left w-full text-xs text-[#6B5B4E] space-y-2 border-t border-[#E7DCC7] pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Directeur des Études :</span>
                    <span className="font-bold text-[#221812]">Secrétariat Elites</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Niveaux d'enseignement :</span>
                    <span className="font-bold text-[#6E1423]">6ème à Terminale</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Permanence inscriptions :</span>
                    <span className="text-[#2F6B3A] font-bold">Ouverte du Lun au Sam</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Major Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-7 rounded-sm border border-[#E7DCC7] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-full bg-[#2F6B3A]/10 text-[#2F6B3A] flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#450C15] mb-2">
              Dossier numérique officiel
            </h3>
            <p className="text-sm text-[#6B5B4E] leading-relaxed">
              La fiche de renseignement est reprise fidèlement du modèle officiel utilisé par
              l'établissement. Plus de ratures ni de formulaires perdus : tout est archivé dans
              la base de données.
            </p>
          </div>

          <div className="bg-white p-7 rounded-sm border border-[#E7DCC7] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-full bg-[#D9A61E]/15 text-[#8A5A00] flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#450C15] mb-2">
              Suivi transparent en direct
            </h3>
            <p className="text-sm text-[#6B5B4E] leading-relaxed">
              Dès l'enregistrement, un code unique <strong>ED-2026-XXXX</strong> vous est donné.
              Vous savez exactement quand le dossier est reçu, en vérification ou validé par le
              secrétariat.
            </p>
          </div>

          <div className="bg-white p-7 rounded-sm border border-[#E7DCC7] shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-12 h-12 rounded-full bg-[#6E1423]/10 text-[#6E1423] flex items-center justify-center font-bold text-xl mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#450C15] mb-2">
              Contrôle & Validation
            </h3>
            <p className="text-sm text-[#6B5B4E] leading-relaxed">
              Le secrétariat pointe chaque pièce physique lors de votre passage. Les macarons,
              carnets de correspondance et cartes d'accès vous sont remis en toute sérénité.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Easy Steps */}
      <section className="bg-white py-16 border-y border-[#E7DCC7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-[#D9A61E]">
              Démarche simple et rapide
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#450C15]">
              Comment inscrire votre enfant en 3 étapes
            </h2>
            <p className="text-sm text-[#6B5B4E]">
              Tout a été pensé pour vous simplifier la vie tout en respectant les exigences
              académiques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FBF6EA] p-8 rounded-sm border border-[#E7DCC7] relative">
              <span className="font-serif text-5xl font-bold text-[#D9A61E] block mb-4">01</span>
              <h3 className="font-serif font-bold text-xl text-[#450C15] mb-2">
                Remplir la fiche en ligne
              </h3>
              <p className="text-sm text-[#6B5B4E] leading-relaxed">
                Renseignez l'identité de l'élève, la situation des parents, les antécédents médicaux
                et le tuteur résidant à Divo. Vous pouvez même joindre la photo de l'élève.
              </p>
            </div>

            <div className="bg-[#FBF6EA] p-8 rounded-sm border border-[#E7DCC7] relative">
              <span className="font-serif text-5xl font-bold text-[#D9A61E] block mb-4">02</span>
              <h3 className="font-serif font-bold text-xl text-[#450C15] mb-2">
                Réunir les pièces physiques
              </h3>
              <p className="text-sm text-[#6B5B4E] leading-relaxed">
                Préparez les pièces obligatoires (extrait de naissance, CNI du parent, livret
                scolaire, dernier bulletin, chemise cartonnée). Consultez la liste complète en un clic.
              </p>
            </div>

            <div className="bg-[#FBF6EA] p-8 rounded-sm border border-[#E7DCC7] relative">
              <span className="font-serif text-5xl font-bold text-[#D9A61E] block mb-4">03</span>
              <h3 className="font-serif font-bold text-xl text-[#450C15] mb-2">
                Dépôt & Confirmation
              </h3>
              <p className="text-sm text-[#6B5B4E] leading-relaxed">
                Présentez votre récépissé au secrétariat du Cours Secondaire Elites Divo. Le dossier
                est vérifié, validé et la place de votre enfant est définitivement réservée.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => onNavigate('inscription')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#6E1423] hover:bg-[#450C15] text-[#F4D889] font-bold text-base rounded-sm shadow-sm transition-colors cursor-pointer"
            >
              <span>Commencer l'inscription en ligne</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* School Highlights / Key Figures */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#450C15] text-white rounded-lg p-8 sm:p-12 shadow-xl border-t-4 border-[#D9A61E]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#F4D889] font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#D9A61E]" />
                <span>Pourquoi choisir Cours Secondaire Elites Divo ?</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
                Une tradition d'exigence au service de la réussite
              </h2>
              <p className="text-sm text-[#EFE3C8] leading-relaxed">
                Depuis sa création, le Cours Secondaire Elites Divo s'impose comme une référence
                dans le département de Divo par la rigueur de son encadrement, la qualification de
                son corps enseignant et l'implication permanente auprès des familles.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-[#F4D889]">
                <span className="bg-white/10 px-3 py-1.5 rounded-xs border border-white/15">
                  &bull; Premier cycle : 6ème à 3ème (BEPC)
                </span>
                <span className="bg-white/10 px-3 py-1.5 rounded-xs border border-white/15">
                  &bull; Second cycle : Séries A, C, D (BAC)
                </span>
                <span className="bg-white/10 px-3 py-1.5 rounded-xs border border-white/15">
                  &bull; Suivi disciplinaire et assiduité
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/15 p-5 rounded-sm text-center">
                <Award className="w-7 h-7 text-[#D9A61E] mx-auto mb-2" />
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#F4D889]">
                  94.8%
                </div>
                <div className="text-xs text-[#EFE3C8] mt-1 font-medium">
                  Taux de réussite aux examens
                </div>
              </div>
              <div className="bg-white/5 border border-white/15 p-5 rounded-sm text-center">
                <Users className="w-7 h-7 text-[#D9A61E] mx-auto mb-2" />
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#F4D889]">
                  1 200+
                </div>
                <div className="text-xs text-[#EFE3C8] mt-1 font-medium">
                  Élèves formés avec rigueur
                </div>
              </div>
              <div className="bg-white/5 border border-white/15 p-5 rounded-sm text-center">
                <BookOpen className="w-7 h-7 text-[#D9A61E] mx-auto mb-2" />
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#F4D889]">
                  7 Niveaux
                </div>
                <div className="text-xs text-[#EFE3C8] mt-1 font-medium">
                  De la 6ème à la Terminale
                </div>
              </div>
              <div className="bg-white/5 border border-white/15 p-5 rounded-sm text-center">
                <Calendar className="w-7 h-7 text-[#D9A61E] mx-auto mb-2" />
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#F4D889]">
                  2026-2027
                </div>
                <div className="text-xs text-[#EFE3C8] mt-1 font-medium">
                  Inscriptions ouvertes
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D9A61E]">
            Questions fréquentes
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#450C15]">
            Tout ce que vous devez savoir
          </h2>
          <p className="text-sm text-[#6B5B4E]">
            Retrouvez les réponses aux questions les plus courantes posées par les parents d'élèves.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-sm border border-[#E7DCC7] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 font-serif font-semibold text-[#450C15] text-base hover:bg-[#FBF6EA]/50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D9A61E] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-[#6B5B4E] leading-relaxed border-t border-gray-100 bg-[#FFFDF8]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-gradient-to-r from-[#6E1423] via-[#450C15] to-[#6E1423] text-white p-10 rounded-sm shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 border-b-4 border-[#D9A61E]">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#F4D889]">
              Préparez sereinement la rentrée 2026-2027
            </h3>
            <p className="text-sm text-[#EFE3C8] max-w-xl">
              Les places par classe sont limitées pour garantir la qualité de l'encadrement.
              Enregistrez le dossier de votre enfant dès aujourd'hui.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('inscription')}
              className="px-6 py-3 bg-[#D9A61E] hover:bg-[#F4D889] text-[#450C15] font-bold text-sm rounded-sm transition-colors shadow-md cursor-pointer"
            >
              Inscrire mon enfant
            </button>
            <button
              onClick={() => onNavigate('pieces')}
              className="px-5 py-3 border border-white/40 hover:bg-white/10 text-white font-semibold text-sm rounded-sm transition-colors cursor-pointer"
            >
              Voir les pièces à fournir
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
