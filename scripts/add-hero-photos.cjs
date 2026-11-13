const fs=require('node:fs'),path=require('node:path');
process.loadEnvFile(path.resolve(__dirname,'../.env.local'));
const sanity=require('../lib/sanity.cjs');
(async()=>{
 const additions=require('./hero-additions.json');
 const changes=[];
 for(const [i,x]of additions.entries()){
  const uploaded=await sanity.upload(fs.readFileSync(path.resolve(__dirname,'../public/assets/media',x.image)),x.image);
  changes.push({createOrReplace:{_id:'homeSlide-web-'+(i+2),_type:'homeSlide',title:x.title,description:x.description,order:i+2,enabled:true,image:{_type:'image',asset:{_type:'reference',_ref:uploaded.document._id},alt:x.imageAlt}}});
 }
 await sanity.mutate(changes);
 const content=await sanity.content();
 console.log('Images actives du hero : '+content.slides.length);
 if(content.slides.length!==5)throw Error('Le hero ne contient pas exactement cinq images.');
})().catch(e=>{console.error(e.message);process.exitCode=1});
