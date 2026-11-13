import {defineType,defineField} from 'sanity'
const f=(name,title,type='string',extra={})=>defineField({name,title,type,...extra})
const required=Rule=>Rule.required()
const order=f('order','Ordre d’affichage','number',{initialValue:0,validation:Rule=>Rule.integer().min(0)})
const enabled=f('enabled','Afficher sur le site','boolean',{initialValue:true,description:'Désactivez pour masquer cet élément. Publiez ensuite vos modifications.'})
const photo=(title='Photo',mandatory=true)=>f('image',title,'image',{options:{hotspot:true},validation:R=>mandatory?R.required().assetRequired():R,fields:[f('alt','Description de l’image','string',{validation:required})]})
const doc=(name,title,fields,preview)=>defineType({name,title,type:'document',fields,preview:preview||{select:{title:'title',media:'image'}},orderings:fields.some(field=>field.name==='order')?[{title:'Ordre d’affichage',name:'orderAsc',by:[{field:'order',direction:'asc'}]}]:fields.some(field=>field.name==='createdAt')?[{title:'Plus récents',name:'recent',by:[{field:'createdAt',direction:'desc'}]}]:[]})
export const schemaTypes=[
 defineType({name:'sitePhoto',title:'Photothèque du site',type:'document',fields:[
  f('title','Nom de l’image','string',{readOnly:true}),
  f('image','Aperçu','image',{readOnly:true}),
  f('category','Type','string',{readOnly:true}),
  f('locations','Utilisée dans','array',{of:[{type:'string'}],readOnly:true}),
  f('localFile','Fichier du site','string',{readOnly:true}),
  f('assetUrl','Lien vers l’image','url',{readOnly:true}),
 ],preview:{select:{title:'title',media:'image',locations:'locations'},prepare({title,media,locations}){return {title,media,subtitle:(locations||[]).join(' · ')}}}}),
 doc('siteSettings','Coordonnées et identité',[
  f('title','Nom de l’association','string',{initialValue:'Néotisse',validation:required}),f('tagline','Signature'),
  f('email','Adresse e-mail','string',{validation:R=>R.required().email()}),f('phone','Téléphone'),f('city','Localisation'),f('instagram','Instagram','url'),f('facebook','Facebook','url'),
 ]),
 doc('page','Page du site',[
  f('pageKey','Page','string',{options:{list:[{title:'Accueil',value:'index'},{title:'Nos actions',value:'actions'},{title:'Services',value:'services'},{title:'Agenda',value:'agenda'},{title:'À propos',value:'a-propos'},{title:'Contact',value:'contact'}]},validation:required}),
  f('title','Titre principal','string',{validation:required}),f('description','Texte d’introduction','text',{rows:4}),{...photo('Photo du haut de page',false),hidden:({document})=>document?.pageKey==='index'},
  f('sections','Textes des sections','array',{description:'Les identifiants correspondent aux sections existantes du site. La mise en page est conservée.',of:[{type:'object',name:'pageSection',title:'Section',fields:[f('sectionId','Identifiant de la section','string',{validation:required}),f('title','Titre'),f('body','Paragraphes','text',{rows:8})],preview:{select:{title:'title',subtitle:'sectionId'}}}]}),
 ],{select:{title:'title',subtitle:'pageKey',media:'image'}}),
 doc('homeSlide','Image du diaporama',[f('title','Titre de la légende','string',{validation:required}),f('description','Légende courte','text',{rows:2}),photo(),order,enabled]),
 doc('event','Rendez-vous',[f('title','Titre','string',{validation:required}),f('date','Date','date',{validation:required}),f('start','Horaires'),f('place','Lieu'),f('description','Description','text',{rows:5}),photo(),f('demo','Rendez-vous de démonstration','boolean',{initialValue:false}),enabled],{select:{title:'title',subtitle:'date',media:'image'}}),
 doc('service','Atelier ou prestation',[f('title','Nom','string',{validation:required}),f('anchor','Identifiant du lien','string',{description:'Exemple : filage. À conserver pour les liens existants.',validation:R=>R.required().regex(/^[a-z0-9-]+$/)}),f('description','Présentation','text',{rows:5}),f('public','Public concerné','text',{rows:3}),f('modalities','Modalités','text',{rows:4}),photo(),order,enabled]),
 doc('partner','Partenaire',[f('title','Nom du partenaire','string',{validation:required}),photo('Logo autorisé'),order,enabled]),
 doc('teamMember','Membre de l’équipe',[f('title','Nom','string',{validation:required}),f('qualification','Formation et spécialité'),f('biography','Présentation','text',{rows:6}),photo('Portrait'),order,enabled]),
 doc('review','Avis du livre d’or',[
  f('name','Nom ou pseudonyme','string',{validation:required}),f('email','E-mail privé','string',{validation:R=>R.email()}),f('rating','Note sur 5','number',{validation:R=>R.required().integer().min(1).max(5)}),
  f('message','Témoignage','text',{validation:required,rows:6}),f('reply','Réponse de Néotisse','text',{rows:4}),
  f('demo','Avis fictif de démonstration','boolean',{initialValue:false,description:'Cochez pour un exemple de mise en page, pas un témoignage réel.'}),f('approved','Avis validé pour publication','boolean',{initialValue:false,description:'Validez puis publiez pour afficher cet avis sur le site.'}),f('createdAt','Reçu le','datetime',{readOnly:true}),
 ],{select:{title:'name',message:'message',approved:'approved',id:'_id'},prepare({title,message,approved,id}){const status=id?.startsWith('drafts.')?'Brouillon / modifications à publier':approved?'Publié sur le site':'Non publié / à valider';return {title,subtitle:status+' · '+(message||'')}}}),
 doc('message','Message reçu',[
  f('name','Nom','string',{readOnly:true}),f('email','Adresse e-mail','string',{readOnly:true}),f('motif','Motif','string',{readOnly:true}),f('message','Message','text',{readOnly:true,rows:10}),f('createdAt','Reçu le','datetime',{readOnly:true}),f('read','Traité / lu','boolean',{initialValue:false}),
 ],{select:{title:'name',subtitle:'motif'}}),
]
