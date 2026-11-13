export const structure=S=>S.list().title('Néotisse').items([
  S.listItem().title('Coordonnées et identité').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
  S.divider(),
  ...[['page','Pages du site'],['homeSlide','Diaporama d’accueil'],['event','Agenda et rendez-vous'],['service','Ateliers et prestations'],['partner','Partenaires'],['teamMember','Équipe']].map(([type,title])=>S.documentTypeListItem(type).title(title)),
  S.divider(),
  S.listItem().title('Avis à valider').child(S.documentList().title('Avis à valider').filter('_type == "review" && approved != true')),
  S.documentTypeListItem('review').title('Livre d’or et réponses'),
  S.documentTypeListItem('message').title('Messages reçus'),
])
