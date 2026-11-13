const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
process.loadEnvFile(path.resolve(__dirname,'../.env.local'));
const sanity=require('../lib/sanity.cjs');
const base=path.resolve(__dirname,'../public');
const pages={'index.html':'Accueil','actions.html':'Nos actions','services.html':'Services','agenda.html':'Agenda','a-propos.html':'À propos','contact.html':'Contact'};
async function query(query){
 const url=`https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v2026-11-01/data/query/${process.env.SANITY_DATASET||'production'}?${new URLSearchParams({query,perspective:'published'})}`;
 const res=await fetch(url,{headers:{Authorization:`Bearer ${process.env.SANITY_READ_TOKEN}`}});
 if(!res.ok)throw Error('Lecture Sanity impossible : '+res.status);
 return (await res.json()).result;
}
(async()=>{
 const records=new Map();
 const add=(asset,title,location,localFile='')=>{
  if(!records.has(asset._id))records.set(asset._id,{asset,title,locations:new Set(),localFile});
  const record=records.get(asset._id);record.locations.add(location);if(localFile)record.localFile=localFile;
 };
 const assets=await query('*[_type == "sanity.imageAsset"]{_id,sha1hash,url,originalFilename}');
 const byHash=new Map(assets.map(a=>[a.sha1hash,a]));
 const files=new Map();
 for(const [file,page]of Object.entries(pages)){
  const html=fs.readFileSync(path.join(base,file),'utf8');
  for(const match of html.matchAll(/<img\b[^>]*\bsrc="(assets\/[^"]+)"[^>]*>/g)){
   const local=decodeURIComponent(match[1]);if(!files.has(local))files.set(local,new Set());files.get(local).add(page);
  }
 }
 for(const [local,locations]of files){
  const bytes=fs.readFileSync(path.join(base,local));
  const hash=crypto.createHash('sha1').update(bytes).digest('hex');
  let asset=byHash.get(hash);
  if(!asset){asset=(await sanity.upload(bytes,path.basename(local))).document;byHash.set(hash,asset);}
  for(const location of locations)add(asset,path.basename(local),location,local);
 }
 const docs=await query('*[!(_id in path("drafts.**")) && _type != "sitePhoto" && defined(image.asset)]{_type,title,name,pageKey,"asset":image.asset->{_id,url,originalFilename},enabled}');
 const labels={homeSlide:'Diaporama d’accueil',event:'Agenda',service:'Services',partner:'Partenaires',teamMember:'À propos — équipe',page:'Page'};
 for(const doc of docs){
  if(doc.enabled===false||!doc.asset)continue;
  add(doc.asset,doc.asset.originalFilename||doc.title||'Photo',`${labels[doc._type]||doc._type} — ${doc.pageKey||doc.title||doc.name||''}`);
 }
 const mutations=[...records.values()].map(r=>({createOrReplace:{
  _id:'sitePhoto-'+r.asset._id,_type:'sitePhoto',title:r.title,
  image:{_type:'image',asset:{_type:'reference',_ref:r.asset._id}},
  category:/logo/i.test(r.title+' '+r.localFile)?'Logo':'Photographie',
  locations:[...r.locations].sort(),localFile:r.localFile,assetUrl:r.asset.url,
 }}));
 await sanity.mutate(mutations);
 console.log(`${mutations.length} images répertoriées avec leurs emplacements, sans modifier les contenus du site.`);
})().catch(e=>{console.error(e.message);process.exitCode=1});
