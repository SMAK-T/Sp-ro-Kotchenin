# Néotisse — site sur mesure

## Lancement local
Dans ce dossier, avec Node.js 20 ou supérieur :

    npm run dev

Ouvrir http://localhost:3000. Aucun paquet à installer.

## Fichiers
Les six pages, les styles et les médias sont dans public/. Modifier directement ces fichiers. server.cjs sert à la prévisualisation locale.

## État
Les contenus, photographies et styles sont repris des sources WordPress disponibles. La fidélité visuelle reste à comparer dans le navigateur avec la version actuelle. La navigation mobile et le calendrier mensuel sont disponibles.

Le formulaire vérifie les champs et préremplit le motif ; aucun message n’est transmis ou conservé. L’adresse et les destinataires doivent être confirmés et un service sécurisé raccordé. L’administration des événements, partenaires et avis reste à développer. Les dates et références non confirmées ne sont pas publiées.

Les polices sont chargées via Google Fonts avec alternatives système. Cette version n’est ni publiée ni poussée sur GitHub.

migrate-local.cjs est un import initial nécessitant les sources WordPress du dossier parent ; le relancer écrase les pages. Ne pas le relancer pour modifier le site.

## Direction éditoriale

La refonte visuelle utilise `public/editorial.css` et `public/editorial.js`, chargés après les styles initiaux : diaporama de cinq photographies, heros courbes, partenaires horizontaux, formulaire éditorial et calendrier avec sélection du jour. Les crédits des photographies sont dans `docs/credits-photos.md`. Le formulaire et le livre d’or restent des aperçus sans envoi. Le calendrier n’affiche aucun événement fictif.

Administration : voir [le guide du backoffice](docs/backoffice.md).


CMS Sanity : [installation et activation](docs/sanity.md).
