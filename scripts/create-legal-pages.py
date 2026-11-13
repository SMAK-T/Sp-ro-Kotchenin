from pathlib import Path
import re

root = Path(__file__).resolve().parent.parent / 'public'
template = (root / 'contact.html').read_text(encoding='utf-8')
header = re.search(r'<header\b.*?</header>', template, re.S)[0]
header = header.replace(' aria-current="page"', '')
footer = re.search(r'<footer\b.*?</footer>', template, re.S)[0]
font_link = re.search(r'<link rel="stylesheet" href="https://fonts.googleapis.com[^"]+">', template)[0]

pages = {
    'mentions-legales.html': ('Mentions légales', '''
<h2>Éditeur et responsabilité éditoriale</h2>
<p>Ce site présente les activités de Néotisse, association loi 1901 consacrée à la médiation scientifique autour des textiles anciens, à la transmission des savoir-faire et à l’archéologie expérimentale.</p>
<p>Éditeur et responsabilité éditoriale : <strong>Néotisse</strong>.</p>
<address><p>Localisation communiquée : Montpellier, France.<br>E-mail : <a href="mailto:asso.neotisse@gmail.com">asso.neotisse@gmail.com</a><br>Téléphone : <a href="tel:+33648655816">06 48 65 58 16</a></p></address>
<p class="legal-pending">L’adresse postale complète du siège et l’identité de la personne représentant l’association pour la direction de la publication restent à renseigner par Néotisse.</p>
<h2>Hébergement du site</h2>
<p>L’hébergeur de la version publique du site n’a pas encore été choisi. Sa dénomination et ses coordonnées seront ajoutées ici lorsque ce choix sera arrêté.</p>
<p>Le service de gestion des contenus utilisé est Sanity. Il permet notamment de gérer les pages, les images, les événements, les avis et les messages. Il ne constitue pas, à lui seul, le choix d’un hébergeur pour le site public.</p>
<h2>Textes, photographies et logos</h2>
<p>Le site associe des contenus et photographies fournis par Néotisse à des photographies d’illustration issues d’Unsplash et de Pexels. Les droits des photographes et les conditions des licences applicables doivent être respectés. Les photographies d’illustration ne représentent pas nécessairement une activité de l’association.</p>
<p>Les logos des partenaires appartiennent à leurs titulaires respectifs. Leur présence présente les partenaires de Néotisse et n’accorde aucun droit de réutilisation.</p>
<p>Pour toute demande concernant un texte, une photographie ou un logo présenté sur le site, contactez <a href="mailto:asso.neotisse@gmail.com">Néotisse</a>.</p>
<h2>Informations et rendez-vous</h2>
<p>Les pages présentent les actions et prestations de l’association. Les conditions d’une intervention sont précisées directement avec Néotisse. Les rendez-vous et avis signalés comme exemples servent à présenter le site et ne constituent ni une inscription ouverte ni des témoignages réels.</p>
<h2>Données personnelles</h2>
<p>Les informations concernant les formulaires et vos droits figurent dans la <a href="politique-confidentialite.html">politique de confidentialité</a>. L’usage des cookies est décrit dans la page <a href="gestion-cookies.html">Gestion des cookies</a>.</p>
'''),
    'gestion-cookies.html': ('Gestion des cookies', '''
<h2>Lors de votre visite</h2>
<p>Dans sa configuration actuelle, le site public de Néotisse n’intègre ni outil publicitaire, ni pixel de suivi des réseaux sociaux, ni outil de mesure d’audience. Aucun cookie optionnel n’est activé pour ces usages.</p>
<p>Le diaporama, le calendrier, le défilement des partenaires et les formulaires ne nécessitent pas de cookie publicitaire pour fonctionner. Il n’y a donc actuellement aucun choix de cookies optionnels à activer ou à désactiver sur cette page.</p>
<h2>Accès à l’administration</h2>
<p>Le back-office est destiné aux personnes autorisées à gérer le site. L’authentification auprès de Sanity et du fournisseur de connexion choisi peut utiliser des cookies ou un stockage local nécessaires à la connexion. Cet usage est distinct de la navigation d’un visiteur sur les pages publiques.</p>
<h2>Ressources et liens externes</h2>
<p>Les polices sont chargées depuis Google Fonts et certaines images depuis le service de diffusion de Sanity. Ces chargements entraînent des requêtes techniques vers ces services, qui reçoivent notamment l’adresse IP nécessaire à la connexion. Ils ne correspondent pas à des boutons de suivi des réseaux sociaux intégrés au site.</p>
<p>Les liens vers Instagram et Facebook ouvrent les sites concernés. Leurs règles de confidentialité et de cookies s’appliquent lorsque vous les consultez.</p>
<h2>Vos réglages</h2>
<p>Vous pouvez consulter, supprimer ou bloquer les cookies dans les paramètres de confidentialité de votre navigateur. Le blocage de cookies d’authentification peut empêcher l’accès au back-office.</p>
<p>Si des fonctionnalités nécessitant des cookies optionnels sont ajoutées ultérieurement, cette page et les moyens de gérer vos choix devront être adaptés avant leur activation.</p>
<p>Pour toute question : <a href="mailto:asso.neotisse@gmail.com">asso.neotisse@gmail.com</a>. Consultez aussi la <a href="politique-confidentialite.html">politique de confidentialité</a>.</p>
'''),
    'politique-confidentialite.html': ('Politique de confidentialité', '''
<h2>Qui utilise vos données ?</h2>
<p>Néotisse, association située à Montpellier, France, utilise les informations transmises sur ce site pour traiter les demandes et gérer les témoignages. Pour toute question concernant vos données, écrivez à <a href="mailto:asso.neotisse@gmail.com">asso.neotisse@gmail.com</a>.</p>
<h2>Formulaire de contact</h2>
<p>Le formulaire recueille votre nom, votre adresse e-mail, le motif choisi et votre message. Ces informations servent à comprendre votre demande, préparer les échanges et vous répondre. Le traitement repose sur votre consentement recueilli dans le formulaire. Les champs signalés comme obligatoires sont nécessaires pour envoyer la demande.</p>
<p>Une demande envoyée est enregistrée dans l’espace de gestion du site. Elle n’est pas affichée publiquement. Évitez de transmettre des informations sensibles ou des renseignements personnels sur d’autres personnes qui ne seraient pas utiles à votre demande.</p>
<h2>Avis et livre d’or</h2>
<p>Le formulaire d’avis recueille un nom ou pseudonyme, une adresse e-mail, une note et un témoignage. L’avis est soumis à la validation de Néotisse. Le nom ou pseudonyme, la note, le témoignage et une éventuelle réponse de l’association peuvent être affichés publiquement après validation et avec votre autorisation. Votre adresse e-mail n’est pas affichée dans les avis publics.</p>
<p>Vous pouvez demander le retrait de votre témoignage ou de votre autorisation de publication en contactant l’association.</p>
<h2>Accès aux données et services techniques</h2>
<p>Les messages et adresses e-mail sont accessibles aux personnes autorisées dans le back-office de Néotisse. Sanity est utilisé pour enregistrer et gérer les contenus, les messages et les avis dans un espace de données privé. Seules les informations destinées au site public sont exposées par son interface de lecture.</p>
<p>Les formulaires ne déclenchent pas actuellement de notification automatique par e-mail. Une réponse à votre demande peut être envoyée depuis la messagerie de l’association, après consultation du message.</p>
<p>Les polices Google Fonts et les images diffusées par Sanity impliquent des connexions à ces fournisseurs. Le serveur utilise également temporairement l’adresse IP de connexion pour limiter les envois abusifs ; ce compteur est conservé en mémoire pendant une fenêtre de quinze minutes.</p>
<p class="legal-pending">L’hébergement public n’étant pas encore choisi, les informations relatives à cet hébergeur restent à compléter. La localisation effective du traitement chez les prestataires et, le cas échéant, les garanties encadrant les transferts hors de l’Espace économique européen doivent également être confirmées avant la mise en ligne publique.</p>
<h2>Conservation des données</h2>
<p class="legal-pending">Les durées de conservation des messages, des avis non publiés et des coordonnées privées doivent être définies par Néotisse. Aucune suppression automatique de ces contenus n’est configurée dans la version actuelle. Cette rubrique doit être complétée avant la mise en ligne publique.</p>
<h2>Vos droits</h2>
<p>Selon votre situation et les conditions prévues par la réglementation, vous pouvez demander l’accès à vos données, leur rectification, leur effacement, la limitation du traitement ou leur portabilité. Vous pouvez retirer votre consentement sans remettre en cause les traitements effectués avant son retrait.</p>
<p>Pour exercer vos droits, contactez <a href="mailto:asso.neotisse@gmail.com">asso.neotisse@gmail.com</a> en précisant votre demande. Vous pouvez également adresser une réclamation à la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">CNIL</a>.</p>
<h2>Cookies</h2>
<p>Consultez la page <a href="gestion-cookies.html">Gestion des cookies</a> pour connaître la configuration actuelle du site et les moyens de réglage disponibles.</p>
'''),
}

for file, (title, content) in pages.items():
    links = ''.join(f'<link rel="stylesheet" href="{css}">' for css in [
        'styles.css', 'editorial.css', 'page-buttons.css', 'button-system.css?v=legal-pages',
        'compact-footer.css?v=legal-links', 'typography.css', 'legal.css?v=1'])
    html = f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} — Néotisse</title><meta name="description" content="{title} du site de l’association Néotisse, Montpellier.">{font_link}{links}<script src="app.js" defer></script></head><body class="legal-page"><a class="skip" href="#main">Aller au contenu</a>{header}<main id="main"><div class="legal-heading"><h1>{title}</h1><p>Néotisse · Montpellier, France</p></div><article class="legal-copy">{content}<p class="legal-date">Mise à jour : 13 novembre 2026.</p></article></main>{footer}</body></html>'''
    (root / file).write_text(html, encoding='utf-8')

legal_nav = '<nav class="footer-legal-links" aria-label="Informations légales"><a href="mentions-legales.html">Mentions légales</a><a href="gestion-cookies.html">Gestion des cookies</a><a href="politique-confidentialite.html">Politique de confidentialité</a></nav>'
for p in root.glob('*.html'):
    s = p.read_text(encoding='utf-8')
    if 'id="site-footer"' not in s:
        continue
    if 'class="footer-legal-links"' not in s:
        s = s.replace('<a href="#main">Retour en haut ↑</a>', legal_nav + '<a href="#main">Retour en haut ↑</a>')
    if 'href="legal.css' not in s:
        s = s.replace('</head>', '<link rel="stylesheet" href="legal.css?v=1"></head>')
    p.write_text(s, encoding='utf-8')

# Expose the privacy information where data is collected.
p = root / 'contact.html'
s = p.read_text(encoding='utf-8')
s = s.replace('pour traiter ma demande.</label>', 'pour traiter ma demande. <a href="politique-confidentialite.html">Politique de confidentialité</a>.</label>')
p.write_text(s, encoding='utf-8')
p = root / 'index.html'
s = p.read_text(encoding='utf-8')
s = s.replace('Votre e-mail reste privé.</p>', 'Votre e-mail reste privé. <a href="politique-confidentialite.html">Politique de confidentialité</a>.</p>')
p.write_text(s, encoding='utf-8')
print('Trois pages créées et liens ajoutés dans les footers.')
