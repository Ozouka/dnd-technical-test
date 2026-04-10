# 📄 Download Tracker — Test Technique Dn'D

Application Shopify custom de tracking de téléchargements de documents PDF, réalisée dans le cadre du test technique Développeur Full-Stack Shopify pour l'agence Dn'D.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Thème Shopify                       │
│  section downloads.liquid + Web Component JS         │
│  → clic "Télécharger" → fetch POST App Proxy         │
└──────────────────────┬──────────────────────────────┘
                       │ /apps/downloads-tracker/api/track-download
                       ▼
┌─────────────────────────────────────────────────────┐
│              App Custom (React Router)               │
│  authenticate.public.appProxy → insert Supabase      │
│  Page back-office Polaris → liste des téléchargements│
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                   Supabase                           │
│  Table Session (Prisma) + Table downloads            │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| App Shopify | React Router 7 + TypeScript |
| Authentification | @shopify/shopify-app-react-router |
| Sessions | Prisma + PostgreSQL (Supabase) |
| Tracking downloads | Supabase JS Client |
| Back-office UI | Polaris (@shopify/polaris) |
| Frontend thème | Liquid + Web Component vanilla JS |
| CSS thème | Tailwind CSS v3 |

---

## ⚙️ Prérequis

- Node.js >= 22.0.0
- pnpm
- Un compte [Shopify Partners](https://partners.shopify.com)
- Un compte [Supabase](https://supabase.com)

---

## 🚀 Installation locale

### 1. Clone le repo

```bash
git clone https://github.com/Ozouka/dnd-technical-test.git
cd dnd-technical-test
pnpm install # pnpm i selon les préférences de chacun
```

### 2. Configure Supabase

Dans votre projet Supabase, ouvrez le **SQL Editor** et exécutez le script suivant (disponible dans `SCRIPT_FOR_SUPABASE.sql`) :

```sql
create table if not exists public.downloads (
  id bigint generated always as identity primary key,
  document_url text not null,
  document_title text not null,
  customer_id text not null,
  customer_name text not null,
  downloaded_at timestamptz default now() not null
);

create index if not exists downloads_downloaded_at_idx
  on public.downloads (downloaded_at desc);

alter table public.downloads enable row level security;

create policy "Service role full access"
  on public.downloads for all to service_role using (true);
```

Récupérez vos clés dans **Supabase → Settings → API** :
- `Project URL` → `SUPABASE_URL`
- `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure les variables d'environnement

Créez un fichier `.env` à la racine :

```bash
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=sb_publishable_xxxx
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxx
```

### 4. Lance l'application

```bash
pnpm dev
```

---


## 🔌 App Proxy

L'app proxy est configuré dans `shopify.app.download-tracker.toml` :

```toml
[app_proxy]
url = "https://votre-app.railway.app" 
subpath = "downloads-tracker"
prefix = "apps"
```

Le front Shopify appelle : `POST /apps/downloads-tracker/api/track-download`

---

## 🎨 Thème Shopify

Le thème est disponible dans un autre repo séparé qui est le suivant : **[dnd-test-shopify-frontend](https://github.com/Ozouka/dnd-test-shopify-frontend)**

Cela permet directement d'aller dans la Boutique en Ligne sur Shopify et de synchro le theme directement avec GitHub (très utile pour le versionning et aussi pour les éventuelles QA à faire car on peut avoir des themes en fonction des branch !)

---

## ⚠️ Notes importantes

### Redirect post-login
Le redirect après connexion dépend du comportement du thème test-data fourni par Shopify, c'est à dire que celui ci utilise une authentification par code/email. Le `return_url` est bien mis dans le code du front cependant le thème va rediriger vers sa page par défaut et cela dépend de la configuration.

### App Proxy et changement d'URL
L'URL du tunnel Cloudflare change à chaque `pnpm dev`. En développement, le `automatically_update_urls_on_dev = true` dans le toml gère cela automatiquement. Si l'App Proxy retourne 404, désinstallez et réinstallez l'app sur le dev store.

---

Merci d'avoir pris votre temps pour la lecture de tout ce projet ! 

---

## 👤 Auteur

Karim ZOULI-BARRERE — Test technique Dn'D
