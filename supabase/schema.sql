-- ============================================================
-- ElitesEduca+ — Schéma Supabase pour les dossiers d'élèves
-- À exécuter dans : Supabase Dashboard > SQL Editor > New query
-- ============================================================

create table if not exists public.dossiers (
  id                          bigint generated always as identity primary key,
  ref                         text not null unique,
  "recuLe"                    timestamptz not null default now(),
  statut                      text not null default 'recu',
  "notesAdmin"                text,

  -- Identité élève
  nom                         text not null,
  niveau                      text not null,
  classe                      text,
  sexe                        text not null,
  "naissDate"                 date not null,
  "naissLieu"                 text not null,
  nationalite                 text not null default 'Ivoirienne',
  quartier                    text,
  "photoUrl"                  text,

  -- Résidence Divo
  "chezQui"                   text not null,
  "autrePersonneNom"          text,
  "autrePersonneClasse"       text,

  -- Scolarité antérieure
  "etabOrigine"                text,
  "classeSuivie"               text,
  mga                          text,

  -- Parents
  "pereNom"                    text,
  "mereNom"                    text,
  "pereProf"                   text,
  "mereProf"                   text,
  "pereDom"                    text,
  "mereDom"                    text,
  "pereContact"                text,
  "mereContact"                text,
  "parentsEnsemble"            text,
  "nbFreres"                   integer,
  "occupeScolarite"            text,
  "occupeScolaritePrecision"   text,
  "orphelinPere"               boolean not null default false,
  "orphelinMere"               boolean not null default false,

  -- Tuteur Divo
  "tutNom"                     text,
  "tutProf"                    text,
  "tutQuartier"                text,
  "tutLien"                    text,
  "tutContact"                 text,

  -- Santé
  "probSante"                  text not null default 'non',
  "santePathologies"           text[] not null default '{}',
  "santeAutre"                 text,

  -- Pièces fournies
  "docsFournis"                text[] not null default '{}',

  -- Situation financière
  "montantTotal"                integer,
  "montantPaye"                 integer not null default 0,
  "prochainPaiementDate"        date,

  created_at                   timestamptz not null default now()
);

-- Si tu avais déjà créé la table AVANT l'ajout du suivi des paiements,
-- ces instructions ajoutent les colonnes manquantes sans rien casser
-- (sans effet si la table vient d'être créée ci-dessus).
alter table public.dossiers add column if not exists "montantTotal" integer;
alter table public.dossiers add column if not exists "montantPaye" integer not null default 0;
alter table public.dossiers add column if not exists "prochainPaiementDate" date;

-- Index utiles pour les recherches et le tri
create index if not exists dossiers_ref_idx on public.dossiers (ref);
create index if not exists dossiers_nom_idx on public.dossiers (nom);
create index if not exists dossiers_recule_idx on public.dossiers ("recuLe" desc);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
-- IMPORTANT : l'authentification admin de cette app est actuellement
-- gérée uniquement côté client (mot de passe dans le code React), ce
-- qui n'est PAS une vraie sécurité serveur. Tant qu'aucune vraie
-- authentification Supabase n'est mise en place, les policies ci-
-- dessous ouvrent l'accès à la clé "anon" (publique) pour que le
-- formulaire d'inscription ET le back-office admin fonctionnent.
--
-- => Concrètement : toute personne qui inspecte le site peut lire/
-- modifier/supprimer les dossiers via l'API Supabase. Voir la note
-- de sécurité envoyée avec ce script pour la suite recommandée
-- (Supabase Auth + policies restreintes aux admins connectés).

alter table public.dossiers enable row level security;

drop policy if exists "Public insert dossiers" on public.dossiers;
create policy "Public insert dossiers"
  on public.dossiers for insert
  to anon
  with check (true);

drop policy if exists "Public read dossiers" on public.dossiers;
create policy "Public read dossiers"
  on public.dossiers for select
  to anon
  using (true);

drop policy if exists "Public update dossiers" on public.dossiers;
create policy "Public update dossiers"
  on public.dossiers for update
  to anon
  using (true)
  with check (true);

drop policy if exists "Public delete dossiers" on public.dossiers;
create policy "Public delete dossiers"
  on public.dossiers for delete
  to anon
  using (true);
