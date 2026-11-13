# Administration locale Néotisse

Pour le nouveau CMS Sanity, consulter [le guide Sanity](sanity.md). Le backoffice décrit ci-dessous reste disponible tant que `CMS_PROVIDER=local`.

## Ouvrir le backoffice

Lancer `node server.cjs` dans le dossier du dépôt, puis ouvrir http://localhost:3000/admin/.
À la première ouverture, créer un mot de passe de 12 caractères minimum. Aucun mot de passe par défaut n’existe. La création initiale est autorisée uniquement depuis le serveur local. Le compte est unique pour l’association. Les sessions expirent après 8 heures et à chaque redémarrage du serveur.

## Contenus modifiables

- Rendez-vous : titre, date, horaires, lieu, description, photo, statut de démonstration, brouillon/publication. L’accueil et l’agenda utilisent les mêmes données.
- Prestations : description, public, modalités et photo. Les demandes de devis reprennent le titre de la prestation.
- Partenaires : nom, logo et publication ; affichage sur l’accueil et À propos.
- Livre d’or : avis reçus en attente, validation, réponse et suppression. L’e-mail reste privé. Les avis fictifs de l’ancienne maquette ne sont pas publiés comme de vrais avis.
- Messages : consultation, marquage lu/non lu, suppression et réponse par le logiciel de messagerie via un lien e-mail.
- Coordonnées : e-mail, téléphone, localisation et liens Instagram/Facebook.
- Photos : sélection des images existantes ou import JPG, PNG, WebP, maximum 5 Mo. Les imports restent enregistrés même si le brouillon est supprimé.

Enregistrer, puis actualiser la page publique pour voir les changements. Les textes de présentation, les biographies, la mise en page et le diaporama restent dans les fichiers du site.

## Données et sauvegardes

`data/seed.json` contient les contenus initiaux publics. `data/private/content.json` conserve les modifications, avis et messages. `data/private/admin.json` contient uniquement le sel et l’empreinte scrypt du mot de passe. Ces fichiers privés sont exclus de Git et inaccessibles depuis le serveur HTTP. Le précédent état des contenus est conservé dans `content.json.bak` à chaque enregistrement. Il ne remplace pas une sauvegarde externe régulière.

Sauvegarder le dossier privé ET les photos `public/assets/media/`. Le serveur doit être arrêté pour une restauration manuelle. Ne jamais partager ni committer le dossier privé.

## Formulaires

Les demandes sont enregistrées dans la boîte de réception du backoffice. Les avis sont conservés en attente de modération. Aucun service SMTP ni aucune notification automatique par e-mail n’est configuré. Prévoir la durée de conservation et les informations de confidentialité avec l’association avant une ouverture publique.

## Mise en ligne

Ce serveur Node fonctionne sur l’ordinateur local et écoute uniquement sur 127.0.0.1. Un hébergement Node avec disque persistant, sauvegardes et HTTPS sera nécessaire pour ouvrir ce backoffice sur Internet ; un hébergement de fichiers statiques seul ne suffit pas. Ne pas exposer le serveur avant la création du compte. En cas de proxy HTTPS, configurer la terminaison TLS et les cookies Secure sur l’hébergement.

## Vérification

`node --test tests/admin.test.cjs` teste les accès non autorisés, le compte initial, le mot de passe, la protection CSRF, l’enregistrement/suppression d’événements, la persistance, les messages, la modération, la confidentialité de l’e-mail et le rejet d’imports non autorisés. Les tests utilisent un dossier temporaire et ne modifient pas les données du site.
