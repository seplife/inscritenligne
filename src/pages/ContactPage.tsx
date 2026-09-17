import React, { useState } from 'react';
import type { PageId } from '../components/Header';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: PageId) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate: _onNavigate }) => {
  const [nom, setNom] = useState('');
  const [contact, setContact] = useState('');
  const [sujet, setSujet] = useState('Renseignements inscription');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-bold tracking-wider text-[#6E1423] bg-[#6E1423]/10 px-3 py-1 rounded-full border border-[#6E1423]/30">
          Secrétariat & Direction
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#450C15]">
          Contactez le Cours Secondaire Elites Divo
        </h1>
        <p className="text-sm text-[#6B5B4E] max-w-xl mx-auto">
          Notre équipe administrative est à votre disposition pour vous orienter et répondre à
          toutes vos interrogations concernant la scolarité de vos enfants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Contact Info & Horaires */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#450C15] text-white rounded-lg p-6 sm:p-8 space-y-6 shadow-xl border-t-4 border-[#D9A61E]">
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-xl text-[#F4D889]">
                Coordonnées officielles
              </h3>
              <p className="text-xs text-[#EFE3C8]">
                DRENA : Divo &middot; Établissement d'Enseignement Général
              </p>
            </div>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D9A61E] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-medium">Adresse :</strong>
                  <span className="text-xs text-[#EFE3C8]">
                    Divo, Côte d'Ivoire &middot; Quartier administratif (axe principal, à proximité
                    des services de l'Éducation Nationale)
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#D9A61E] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block text-white font-medium">Téléphones :</strong>
                  <div className="text-xs space-y-0.5 text-[#EFE3C8]">
                    <div>
                      Ligne 1 :{' '}
                      <a href="tel:+2250707874978" className="text-[#F4D889] hover:underline font-mono">
                        (+225) 07 07 87 49 78
                      </a>
                    </div>
                    <div>
                      Ligne 2 :{' '}
                      <a href="tel:+2250103356982" className="text-[#F4D889] hover:underline font-mono">
                        (+225) 01 03 35 69 82
                      </a>
                    </div>
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#D9A61E] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-medium">Courrier électronique :</strong>
                  <span className="text-xs text-[#EFE3C8]">contact@elitesdivo.ci</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#D9A61E] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-medium">Permanence du secrétariat :</strong>
                  <span className="text-xs text-[#EFE3C8] block">
                    Lundi &ndash; Vendredi : 07h30 à 16h30
                  </span>
                  <span className="text-xs text-[#EFE3C8] block">Samedi : 08h00 à 12h00</span>
                </div>
              </li>
            </ul>

            <div className="pt-4 border-t border-white/10">
              <a
                href="https://wa.me/2250707874978"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-[#2F6B3A] hover:bg-[#1E4A28] text-white font-bold text-xs rounded-sm shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Écrire sur WhatsApp au secrétariat</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Col: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-[#E7DCC7] shadow-lg p-6 sm:p-8 space-y-6">
          <div className="space-y-1 border-b border-[#E7DCC7] pb-4">
            <h2 className="text-xl font-serif font-bold text-[#450C15]">
              Envoyer un message au secrétariat
            </h2>
            <p className="text-xs text-[#6B5B4E]">
              Nous répondons rapidement à vos questions concernant les inscriptions et les filières.
            </p>
          </div>

          {sent ? (
            <div className="bg-[#E8F5E9] border border-[#A5D6A7] rounded-sm p-6 text-center space-y-3 animate-in fade-in-50">
              <CheckCircle2 className="w-10 h-10 text-[#2E7D32] mx-auto" />
              <h3 className="font-serif font-bold text-lg text-[#2E7D32]">
                Message transmis avec succès !
              </h3>
              <p className="text-xs text-[#1E4A28] max-w-md mx-auto">
                Merci <strong>{nom}</strong>. Votre demande a bien été transmise à la direction du
                Cours Secondaire Elites Divo. Le secrétariat vous recontactera très prochainement.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs text-[#2E7D32] underline font-semibold cursor-pointer pt-2 block mx-auto"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#450C15] uppercase">
                    Votre nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={nom}
                    onChange={e => setNom(e.target.value)}
                    placeholder="M. ou Mme..."
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9A61E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#450C15] uppercase">
                    Téléphone ou Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                    placeholder="07 00 00 00 00"
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9A61E]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#450C15] uppercase">Objet de votre demande</label>
                <select
                  value={sujet}
                  onChange={e => setSujet(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9A61E]"
                >
                  <option>Renseignements inscription 2026-2027</option>
                  <option>Situation d'un dossier en cours</option>
                  <option>Transfert d'établissement / Orientation</option>
                  <option>Frais de scolarité & Modalités</option>
                  <option>Autre demande</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#450C15] uppercase">
                  Votre message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Écrivez votre message ici..."
                  className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DCC7] rounded-xs text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D9A61E]"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#6E1423] hover:bg-[#450C15] text-[#F4D889] font-bold text-sm rounded-sm shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Envoyer le message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
