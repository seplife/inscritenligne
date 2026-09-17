-- ============================================================
-- ElitesEduca+ — Migration : suivi des paiements
-- À exécuter dans : Supabase Dashboard > SQL Editor > New query
-- (uniquement si la table "dossiers" existe déjà sans ces colonnes)
-- ============================================================

alter table public.dossiers
  add column if not exists "montantTotal" numeric(12,2),
  add column if not exists "montantPaye" numeric(12,2) not null default 0,
  add column if not exists "prochainPaiementDate" date;
