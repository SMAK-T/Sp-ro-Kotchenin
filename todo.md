# TODO — Site Neotisse

Plan de réalisation de la version sur mesure par vibecoding.

Références : `brief.md` pour les besoins et `design.md` pour les orientations visuelles. Cette liste décrit le travail à réaliser ; une case ne doit être cochée qu’après vérification du résultat.

## 1. Préparer le projet

- [ ] Lire intégralement le brief et le design et relever les points restant à confirmer.
- [ ] Examiner les fichiers du dépôt et identifier ce qui existe déjà.
- [ ] Proposer les outils de développement, la gestion des contenus, le stockage et l’envoi des messages sans présenter ces choix comme des exigences du client.
- [ ] Initialiser l’application dans ce dépôt et documenter son lancement local.
- [ ] Préparer un `.gitignore` adapté et un `.env.example` sans secret.
- [ ] Organiser les pages, composants communs, médias et fonctions serveur.
- [ ] Prévoir une préproduction distincte du site public.

Critère de fin : le projet démarre localement et son fonctionnement peut être repris à partir du README.

## 2. Rassembler et valider les contenus

- [ ] Inventorier les textes, le logo, les photographies et les logos partenaires disponibles.
- [ ] Vérifier les autorisations de publication des visuels et témoignages.
- [ ] Faire confirmer les biographies, qualifications et personnes à présenter.
- [ ] Faire confirmer la liste des partenaires et leurs appellations.
- [ ] Recueillir les modalités des cinq prestations et identifier les informations manquantes.
- [ ] Recueillir les informations des événements réellement annoncés.
- [ ] Confirmer l’adresse e-mail publique et les destinataires des demandes selon leur motif.
- [ ] Faire préciser le fonctionnement du dépôt d’avis, de la modération et des réponses publiques.
- [ ] Confirmer les contenus modifiables dans l’administration au-delà des événements et partenaires.
- [ ] Identifier les renseignements nécessaires aux pages légales.

Critère de fin : distinguer clairement contenus validés, contenus manquants et contenus de démonstration. Aucun exemple fictif n’est publié comme un fait.

## 3. Poser l’identité visuelle et les éléments communs

- [ ] Appliquer la palette : `#E4E9DE`, `#F7F4EC`, `#354638`, `#A85F43`.
- [ ] Appliquer Cinzel au nom NEOTISSE, Source Serif 4 aux titres et DM Sans aux textes et interfaces.
- [ ] Intégrer le logo fourni sans le déformer ni inventer de variante.
- [ ] Définir les styles communs de titres, paragraphes, boutons, liens et formulaires.
- [ ] Créer le menu des six pages et identifier la page active.
- [ ] Créer un menu mobile utilisable au clavier.
- [ ] Créer le pied de page avec coordonnées et liens utiles.
- [ ] Prévoir les états de focus, survol, chargement, vide, erreur et succès nécessaires.
- [ ] Faire valider la direction visuelle avant de la décliner sur toutes les pages.

Critère de fin : une présentation claire, chaleureuse et lisible sur téléphone comme sur ordinateur, conforme aux choix retenus.

## 4. Réaliser les six pages publiques

### Accueil

- [ ] Mettre NEOTISSE au premier niveau visuel, avec une accroche plus petite dessous.
- [ ] Présenter brièvement l’association avec des visuels de qualité.
- [ ] Ajouter « Découvrir nos actions » et « Nous contacter ».
- [ ] Présenter les actions et les prestations en faisant ressortir le sur mesure.
- [ ] Afficher les prochaines interventions à partir des événements publiés.
- [ ] Ajouter un aperçu des partenaires autorisés.

### Nos actions

- [ ] Présenter interventions, démonstrations, médiation culturelle et archéologie expérimentale.
- [ ] Intégrer les réalisations avec contexte, publics, descriptions et photos.
- [ ] Prévoir la publication des actualités et projets récents dans cette rubrique.

### Services

- [ ] Présenter filage, métier vertical, tablettes, teinture naturelle et interventions sur mesure.
- [ ] Afficher descriptif, public, modalités connues et visuels pour chaque offre.
- [ ] Ajouter un bouton « Demander un devis » par prestation.
- [ ] Expliquer les possibilités d’adaptation et le déroulement possible d’une intervention.
- [ ] Publier des exemples de devis uniquement après validation de leur contenu et de leur présentation.

### Agenda

- [ ] Créer la navigation entre les mois et la liste des événements.
- [ ] Ouvrir les détails d’un événement : titre, description, date, horaires, lieu, public et conditions de participation.
- [ ] Afficher le lien externe d’inscription lorsqu’il existe, sinon le contact.
- [ ] Prévoir une information claire lorsqu’aucun événement n’est annoncé.
- [ ] Rendre les informations consultables sur mobile et au clavier.

### À propos

- [ ] Présenter histoire, mission, équipe et compétences à partir des informations validées.
- [ ] Expliquer l’approche scientifique et pédagogique.
- [ ] Présenter les partenaires avec leurs logos autorisés.
- [ ] Prévoir l’espace des avis et réponses selon les modalités validées.

### Contact

- [ ] Afficher une adresse e-mail visible et cliquable.
- [ ] Ajouter nom, e-mail, motif, message et information ou consentement adapté.
- [ ] Proposer rendez-vous, atelier/intervention, devis et autre demande.
- [ ] Inviter le visiteur à préciser les informations utiles à son projet.

Critère de fin : les six pages sont accessibles depuis le menu et leurs contenus répondent aux deux publics cibles.

## 5. Connecter les fonctionnalités aux données

- [ ] Mettre en place la persistance des contenus administrables.
- [ ] Relier l’accueil et l’agenda aux événements publiés.
- [ ] Relier les partenaires et actualités aux contenus de gestion.
- [ ] Préremplir le motif et la prestation depuis un bouton de devis.
- [ ] Valider les demandes de contact côté serveur et gérer les erreurs de saisie.
- [ ] Transmettre les demandes aux destinataires définis selon le motif.
- [ ] Afficher une confirmation fidèle au résultat réel de l’envoi.
- [ ] Prévoir le traitement d’un échec sans perdre inutilement la saisie.
- [ ] Mettre en place le dépôt des avis et leur validation avant publication.
- [ ] Ajouter les réponses de Neotisse après confirmation de leur fonctionnement.
- [ ] Ne pas rendre publiques les coordonnées privées des contributeurs.

Critère de fin : le formulaire, le calendrier et les avis ont un fonctionnement réel ; ils ne sont pas des simulations d’interface.

## 6. Réaliser l’espace de gestion

- [ ] Mettre en place une connexion sécurisée réservée aux personnes autorisées.
- [ ] Permettre la création, la modification et la suppression d’événements sans coder.
- [ ] Vérifier les dates et informations avant publication d’un événement.
- [ ] Permettre l’ajout et la gestion des partenaires et de leurs logos.
- [ ] Permettre la gestion des actualités selon le périmètre confirmé.
- [ ] Permettre la validation des avis avant publication.
- [ ] Réaliser les autres fonctions d’édition uniquement selon le périmètre retenu.
- [ ] Préparer une prise en main de l’interface avec Neotisse.

Critère de fin : l’association réalise les opérations essentielles sans intervention sur le code.

## 7. Vérifier la qualité et la protection des données

- [ ] Vérifier les pages sur téléphone, tablette et ordinateur, sans débordement horizontal.
- [ ] Vérifier les contrastes, les titres, les libellés de champs et les descriptions d’images.
- [ ] Tester menus, formulaires et agenda au clavier avec un focus visible.
- [ ] Optimiser les images et vérifier les temps de chargement.
- [ ] Préparer les titres SEO, descriptions, adresses lisibles et liens internes utiles.
- [ ] Protéger l’administration et les formulaires contre les accès et soumissions non autorisés.
- [ ] Configurer HTTPS pour l’environnement public.
- [ ] Définir la conservation des données et limiter leur collecte et leur accès.
- [ ] Faire valider et intégrer les mentions légales et la confidentialité.
- [ ] Prévoir la gestion des traceurs selon les outils effectivement utilisés.
- [ ] Mettre en place les sauvegardes et vérifier une restauration.

## 8. Effectuer la recette avec Neotisse

- [ ] Tester le parcours professionnel : découvrir une prestation puis demander un devis.
- [ ] Tester le parcours du public : trouver une intervention et ses informations pratiques.
- [ ] Tester ajout, modification et retrait d’un événement depuis la gestion.
- [ ] Vérifier l’ajout d’un partenaire et la modération d’un avis.
- [ ] Vérifier le routage des demandes pour chaque motif et leur réception réelle.
- [ ] Tester les cas d’erreur : e-mail incorrect, date invalide, absence d’événement et échec d’envoi.
- [ ] Relire les contenus et contrôler les autorisations des médias.
- [ ] Centraliser les retours et corriger les anomalies bloquantes.
- [ ] Faire valider la version finale avant mise en ligne.

Critère de fin : les parcours essentiels fonctionnent et l’association donne son accord sur le résultat.

## 9. Livrer et mettre en ligne

- [ ] Confirmer le domaine, l’hébergement, les services nécessaires et leurs coûts récurrents.
- [ ] Définir qui prend en charge la maintenance après livraison.
- [ ] Préparer la configuration de production sans publier de secrets dans le dépôt.
- [ ] Mettre en ligne après validation et vérifier le fonctionnement sur l’adresse publique.
- [ ] Contrôler la réception des messages sur l’hébergement définitif.
- [ ] Vérifier les réglages d’indexation et supprimer les références aux adresses de développement.
- [ ] Transmettre le code, les accès par un moyen adapté et la documentation.
- [ ] Former Neotisse à la gestion des événements, partenaires et autres contenus retenus.
- [ ] Confirmer la réception des livrables et consignes de sauvegarde.

## Règles de travail

- Réaliser les étapes dans l’ordre des dépendances ; ne pas inventer une réponse à un point client non confirmé.
- Conserver les choix visuels validés et distinguer une suggestion de conception d’une demande du client.
- Rester dans le périmètre du site vitrine : pas de paiement, boutique, billetterie intégrée ou comptes visiteurs.
- Ne pas souscrire de service payant sans accord.
- Faire des commits par étape cohérente, avec un message explicite ; vérifier les fichiers avant tout push.
- Mettre à jour cette liste au fil des vérifications et signaler les éléments restant à réaliser.
