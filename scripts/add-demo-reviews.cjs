const fs=require('node:fs'),path=require('node:path');process.loadEnvFile(path.resolve(__dirname,'../.env.local'));const sanity=require('../lib/sanity.cjs');
const samples=[
 ['Camille','Un atelier accessible et passionnant. Manipuler les fibres après les explications permet de mieux comprendre les gestes et l’histoire du textile.'],
 ['Alex','Une belle découverte du filage au fuseau. Le rythme laisse le temps d’observer, de poser des questions et de faire ses premiers essais.'],
 ['Lou','Le tissage aux tablettes m’a donné un autre regard sur les motifs. Voir le galon se construire rend la technique beaucoup plus concrète.'],
 ['Noa','Une rencontre qui relie les objets anciens aux gestes d’aujourd’hui. Les échanges donnent envie de poursuivre la découverte.'],
 ['Morgan','La démonstration de teinture naturelle était très claire. J’ai aimé découvrir les plantes, les fibres et les différentes étapes de préparation.'],
 ['Charlie','Un moment convivial, adapté à des personnes qui découvrent le sujet. Les explications et la pratique se complètent très bien.'],
];
const documents=samples.map(([name,message],i)=>({_id:'review-demo-'+(i+1),_type:'review',name:name+' — exemple',message,rating:5,approved:true,demo:true,createdAt:new Date(Date.UTC(2026,10,6-i,12)).toISOString()}));
(async()=>{await sanity.mutate(documents.map(doc=>({createOrReplace:doc})));for(const file of ['data/seed.json','data/private/content.json']){const p=path.resolve(__dirname,'..',file);if(!fs.existsSync(p))continue;const db=JSON.parse(fs.readFileSync(p));db.reviews=db.reviews.filter(r=>!r.demo);db.reviews.push(...documents.map(d=>({id:d._id,name:d.name,message:d.message,rating:d.rating,published:true,demo:true,createdAt:d.createdAt})));fs.writeFileSync(p,JSON.stringify(db,null,2))}console.log('Six avis fictifs de démonstration publiés dans Sanity, sans modifier les avis réels.');})().catch(e=>{console.error(e.message);process.exitCode=1});
