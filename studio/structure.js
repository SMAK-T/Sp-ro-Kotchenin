export const structure=S=>S.list().title('Néotisse').items([
  S.listItem().title('Coordonnées et identité').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
  S.listItem().title('Photothèque — images du site').child(S.list().title('Photothèque').items([
    S.documentTypeListItem('sitePhoto').title('Toutes les images utilisées'),
    S.listItem().title('Photographies').child(S.documentList().title('Photographies').schemaType('sitePhoto').filter('_type == "sitePhoto" && category == "Photographie"')),
    S.listItem().title('Logos').child(S.documentList().title('Logos').schemaType('sitePhoto').filter('_type == "sitePhoto" && category == "Logo"')),
  ])),
  S.divider(),
  ...[['page','Pages du site'],['homeSlide','Diaporama d’accueil'],['event','Agenda et rendez-vous'],['service','Ateliers et prestations'],['partner','Partenaires'],['teamMember','Équipe']].map(([type,title])=>S.documentTypeListItem(type).title(title)),
  S.divider(),
  S.listItem().title('Avis non publiés / à valider').child(S.documentList().title('Avis non publiés / à valider').schemaType('review').filter('_type == "review" && (approved != true || _id in path("drafts.**"))').defaultOrdering([{field:'createdAt',direction:'desc'}])),
  S.listItem().title('Avis publiés sur le site').child(S.documentList().title('Avis publiés sur le site').schemaType('review').filter('_type == "review" && approved == true && !(_id in path("drafts.**"))').defaultOrdering([{field:'createdAt',direction:'desc'}])),

  S.documentTypeListItem('message').title('Messages reçus'),
])
