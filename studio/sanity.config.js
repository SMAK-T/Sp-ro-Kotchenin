import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes/index.js'
import {structure} from './structure.js'
const projectId=process.env.SANITY_STUDIO_PROJECT_ID
const dataset=process.env.SANITY_STUDIO_DATASET || 'production'
if(!projectId) throw new Error('Renseignez SANITY_STUDIO_PROJECT_ID dans studio/.env.local pour connecter le CMS Néotisse à votre projet Sanity.')
export default defineConfig({
  name:'neotisse',title:'Néotisse · Gestion du site',projectId,dataset,
  basePath:'/',plugins:[structureTool({title:'Contenus du site',structure})],schema:{types:schemaTypes},
  document:{newDocumentOptions:(options)=>options.filter(o=>o.templateId!=='siteSettings'),actions:(prev,ctx)=>ctx.schemaType==='siteSettings'?prev.filter(a=>!['delete','duplicate','unpublish'].includes(a.action)):prev},
})
