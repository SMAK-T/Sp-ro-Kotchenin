# CMS Sanity — Néotisse

Le dépôt contient un véritable Sanity Studio, avec brouillons, publication, bibliothèque d’images et connexion par compte Sanity. Les rubriques et champs sont nommés en français. Il conserve la mise en page du site.

## Rubriques

- Coordonnées et identité : e-mail, téléphone, localisation, réseaux sociaux.
- Pages : titres, introductions, images des pages intérieures et textes des sections repérées dans les fichiers HTML.
- Diaporama d’accueil : photos, légendes, ordre et visibilité. La rotation reste de 5 secondes.
- Agenda : titre, date, horaires, lieu, description, photo et visibilité.
- Prestations : descriptions, publics, modalités, photo et ordre.
- Partenaires : noms, logos et ordre.
- Équipe : portraits, qualifications et biographies.
- Livre d’or : avis en attente, validation et réponse. L’e-mail est privé.
- Messages reçus : demandes de contact et case de suivi « Traité / lu ». Pour répondre, utiliser la messagerie de l’association. Les notifications e-mail ne sont pas configurées.

Les textes éditables des sections sont les paragraphes repérés `data-cms-copy` et leurs titres. Les légendes détaillées de galeries, les listes complexes et les éléments de mise en page restent dans le code. Le CMS ne permet pas de déplacer librement les blocs.

## Connexion initiale — à faire une seule fois

1. Se connecter à https://www.sanity.io/manage et créer un projet **Néotisse**.
2. Créer un dataset **production privé**. Le serveur refuse les datasets publics, car les messages et e-mails privés sont dans le même dataset.
3. Relever le Project ID dans les paramètres du projet.
4. Copier `studio/.env.example` vers `studio/.env.local` et renseigner le Project ID et le dataset. Ces valeurs ne sont pas des secrets.
5. Copier `.env.example` vers `.env.local` à la racine. Renseigner `SANITY_PROJECT_ID`, `SANITY_DATASET`, un jeton de lecture dans `SANITY_READ_TOKEN` et un jeton autorisé à écrire dans `SANITY_WRITE_TOKEN`. Créer les jetons dans les réglages API du projet. Ils restent sur le serveur ; ne jamais leur donner un préfixe `SANITY_STUDIO_`, les coller dans la conversation ou les committer.
6. Dans les réglages API/CORS, autoriser les origines du Studio avec les identifiants : `http://localhost:3333` en développement, puis l’origine effective du Studio hébergé. Le site public interroge son propre serveur ; il n’utilise pas directement de jeton Sanity.

## Importer les contenus existants

Depuis la racine du dépôt :

```sh
node scripts/import-sanity.cjs
```

Cette commande montre uniquement le nombre de documents, sans envoyer de données ni afficher les messages privés. Après configuration du projet :

```sh
node scripts/import-sanity.cjs --apply
```

L’import utilise le contenu du backoffice local s’il existe, sinon les contenus initiaux. Les photos sont téléversées dans Sanity. Les avis et messages locaux sont importés dans le dataset privé. Les documents utilisent des identifiants stables et `createIfNotExists` : une nouvelle exécution ne remplace pas les textes déjà modifiés dans Sanity. Les nouveaux documents importés sont immédiatement disponibles comme documents publiés ; les rendez-vous d’exemple gardent leur étiquette de démonstration.

## Ouvrir le CMS

Les dépendances ont été installées dans `studio/`. Sur une nouvelle machine : installer Node 22.12+ et exécuter `npm install` dans `studio/` (ou `pnpm install --frozen-lockfile` pour utiliser le verrou pnpm fourni).

À la racine :

```sh
node scripts/studio.cjs dev
```

Ouvrir **http://localhost:3333/studio/** et se connecter avec le compte Sanity autorisé sur le projet. Il n’y a pas de nouveau mot de passe local à créer. Inviter les membres de Néotisse dans les réglages du projet selon les droits nécessaires.

## Activer la liaison sur le site

Quand les contenus ont été importés, mettre dans `.env.local` :

```dotenv
CMS_PROVIDER=sanity
SANITY_STUDIO_URL=http://localhost:3333/studio/
```

Puis redémarrer `node server.cjs`. L’ancien lien `/admin/` redirige vers Sanity ; les anciennes écritures dans le backoffice local sont désactivées. Les pages publiques utilisent les contenus Sanity publiés ; les modifications en brouillon restent privées. Après publication, actualiser la page publique. Les fichiers du backoffice local sont conservés pour un retour arrière : remettre `CMS_PROVIDER=local` et redémarrer.

## Héberger le Studio avec le site

```sh
node scripts/studio.cjs build
```

Le Studio est compilé dans `public/studio/`, exclu de Git. Mettre `SANITY_STUDIO_URL=/studio/` puis redémarrer le serveur. La route `/studio/` et ses sous-routes sont servies par Node. Pour une mise en ligne, configurer HTTPS, les variables serveur, les origines CORS et les sauvegardes du projet. Un déploiement du Studio seul ne remplace pas le serveur Node utilisé par les formulaires.

## État actuel

Le projet Néotisse `095bdt53` est connecté au dataset `production` privé. Les contenus et les photos ont été importés ; le serveur lit les contenus publiés dans Sanity. Les jetons restent dans `.env.local`, exclu de Git. Le Studio local est accessible sur http://localhost:3002/studio/ pendant que le serveur est lancé. Le CMS n’a pas encore été publié sur un hébergement Internet.

## Références

- https://www.sanity.io/docs/studio/installation
- https://www.sanity.io/docs/studio/configuration
- https://www.sanity.io/docs/content-lake/http-auth
- https://www.sanity.io/docs/content-lake/datasets
