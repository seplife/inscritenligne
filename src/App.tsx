import { useState, useEffect } from 'react';
import { Header, type PageId } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { InscriptionPage } from './pages/InscriptionPage';
import { SuiviPage } from './pages/SuiviPage';
import { PiecesTarifsPage } from './pages/PiecesTarifsPage';
import { AdminPage } from './pages/AdminPage';
import { ContactPage } from './pages/ContactPage';
import { VerificationPage } from './pages/VerificationPage';
import { initDatabase } from './db/db';

const VALID_PAGES: PageId[] = [
  'accueil',
  'inscription',
  'suivi',
  'pieces',
  'admin',
  'contact',
  'verification',
];

// Lit le hash de l'URL et retourne la page courante + un éventuel paramètre
// Formats supportés : "#admin", "#verification/ED-2026-1042"
function parseHash(): { page: PageId; param: string } {
  const raw = window.location.hash.replace('#', '');
  const [pageRaw, ...rest] = raw.split('/');
  const page = pageRaw as PageId;
  const param = rest.join('/');
  return {
    page: VALID_PAGES.includes(page) ? page : 'accueil',
    param,
  };
}

export function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(() => parseHash().page);
  const [pageParam, setPageParam] = useState<string>(() => parseHash().param);

  // Initialise la base Supabase avec des dossiers de démonstration si elle est vide
  useEffect(() => {
    initDatabase().catch(err => {
      console.error('Erreur initialisation BDD:', err);
    });
  }, []);

  // Écoute les changements de hash dans l'URL du navigateur
  useEffect(() => {
    const handleHashChange = () => {
      const { page, param } = parseHash();
      setCurrentPage(page);
      setPageParam(param);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF6EA] text-[#221812] selection:bg-[#F4D889]">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1 pb-12">
        {currentPage === 'accueil' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'inscription' && <InscriptionPage onNavigate={handleNavigate} />}
        {currentPage === 'suivi' && <SuiviPage onNavigate={handleNavigate} />}
        {currentPage === 'pieces' && <PiecesTarifsPage onNavigate={handleNavigate} />}
        {currentPage === 'admin' && <AdminPage onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
        {currentPage === 'verification' && (
          <VerificationPage onNavigate={handleNavigate} dossierRef={pageParam} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
