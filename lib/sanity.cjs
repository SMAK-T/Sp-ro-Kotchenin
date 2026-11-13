const crypto=require('node:crypto');
const version='v2026-11-01';
function config(){const projectId=process.env.SANITY_PROJECT_ID,dataset=process.env.SANITY_DATASET||'production';if(!/^[a-z0-9]+$/.test(projectId||'')||!/^[-a-z0-9_]+$/.test(dataset))throw Error('Configuration Sanity incomplète.');return {projectId,dataset,readToken:process.env.SANITY_READ_TOKEN,writeToken:process.env.SANITY_WRITE_TOKEN}}
const enabled=()=>process.env.CMS_PROVIDER==='sanity';
async function request(endpoint,{method='GET',body,write=false,headers={}}={}){const c=config(),token=write?c.writeToken:c.readToken;if(!token)throw Error('Jeton Sanity serveur manquant.');const res=await fetch(`https://${c.projectId}.api.sanity.io/${version}/${endpoint}`,{method,headers:{Authorization:`Bearer ${token}`,...headers},body,signal:AbortSignal.timeout(15000)});if(!res.ok)throw Error(`Sanity indisponible (${res.status}).`);return res.json()}
let privateVerified=0;
async function assertPrivate(){if(Date.now()-privateVerified<60000)return;const list=await request('datasets');const ds=list.find(x=>x.name===config().dataset);if(ds?.aclMode!=='private')throw Error('Le dataset Néotisse doit être privé pour protéger les messages et les e-mails.');privateVerified=Date.now()}
const imageProjection='"image": image.asset->url, "imageAlt": image.alt';
const PUBLIC_QUERY=`{
 "events": *[_type == "event" && enabled != false] | order(date asc){"id":_id,title,date,start,place,description,demo,${imageProjection}},
 "services": *[_type == "service" && enabled != false] | order(order asc){"id":coalesce(anchor,_id),title,description,public,modalities,${imageProjection}},
 "partners": *[_type == "partner" && enabled != false] | order(order asc){"id":_id,"name":title,${imageProjection}},
 "reviews": *[_type == "review" && approved == true] | order(createdAt desc){"id":_id,name,rating,message,reply,createdAt,demo},
 "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{title,tagline,email,phone,city,instagram,facebook},
 "slides": *[_type == "homeSlide" && enabled != false] | order(order asc){title,description,${imageProjection}},
 "team": *[_type == "teamMember" && enabled != false] | order(order asc){title,qualification,biography,${imageProjection}},
 "pages": *[_type == "page"]{pageKey,title,description,sections[]{sectionId,title,body},${imageProjection}}
}`;
async function content(){await assertPrivate();const c=config();const params=new URLSearchParams({query:PUBLIC_QUERY,perspective:'published'});const out=await request(`data/query/${c.dataset}?${params}`);return {...out.result,settings:out.result.settings||{email:'asso.neotisse@gmail.com',phone:'06 48 65 58 16',city:'Montpellier, France'}}}
async function mutate(mutations){await assertPrivate();return request(`data/mutate/${config().dataset}?visibility=sync`,{method:'POST',write:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({mutations})})}
async function submission(type,b){const doc={_id:`${type}-${crypto.randomUUID()}`,_type:type,name:b.name,email:b.email,message:b.message,createdAt:new Date().toISOString()};if(type==='message')Object.assign(doc,{motif:b.motif,read:false});else Object.assign(doc,{rating:b.rating,approved:false});return mutate([{create:doc}])}
async function upload(bytes,filename){await assertPrivate();return request(`assets/images/${config().dataset}?filename=${encodeURIComponent(filename)}`,{method:'POST',write:true,headers:{'Content-Type':'application/octet-stream'},body:bytes})}
module.exports={enabled,content,submission,mutate,upload,PUBLIC_QUERY};
