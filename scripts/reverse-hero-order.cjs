const fs=require('node:fs'),path=require('node:path');
process.loadEnvFile(path.resolve(__dirname,'../.env.local'));
(async()=>{
 const project=process.env.SANITY_PROJECT_ID,dataset=process.env.SANITY_DATASET||'production';
 const query='*[_type == "homeSlide" && enabled != false] | order(order asc){_id,order}';
 const res=await fetch(`https://${project}.api.sanity.io/v2026-11-01/data/query/${dataset}?${new URLSearchParams({query,perspective:'published'})}`,{headers:{Authorization:`Bearer ${process.env.SANITY_READ_TOKEN}`}});
 if(!res.ok)throw Error('Lecture impossible : '+res.status);
 const {result}=await res.json();
 const sanity=require('../lib/sanity.cjs');
 await sanity.mutate([...result].reverse().map((x,i)=>({patch:{id:x._id,set:{order:i}}})));
 console.log(result.length+' images réordonnées dans Sanity.');
})().catch(e=>{console.error(e.message);process.exitCode=1});
