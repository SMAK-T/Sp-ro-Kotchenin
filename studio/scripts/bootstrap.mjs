import {getCliClient} from 'sanity/cli'
import fs from 'node:fs'
import path from 'node:path'
import {spawnSync} from 'node:child_process'
async function main(){
const root=path.resolve(process.cwd(),'..'),projectId='095bdt53',dataset='production'
const client=getCliClient({apiVersion:'2026-11-01'}).withConfig({projectId,dataset,useCdn:false})
const datasets=await client.datasets.list()
const existing=datasets.find(item=>item.name===dataset)
if(!existing){await client.datasets.create(dataset,{aclMode:'private'});console.log('Dataset privé production créé.')}
else if(existing.aclMode!=='private'){await client.datasets.edit(dataset,{aclMode:'private'});console.log('Dataset production rendu privé.')}
else console.log('Dataset production : privé.')
const cli=path.resolve('node_modules/sanity/bin/sanity')
function run(args,secret=false){const result=spawnSync(process.execPath,[cli,...args],{cwd:process.cwd(),encoding:'utf8',env:process.env,maxBuffer:5*1024*1024});if(result.status!==0&&args[0]==='cors'&&String(result.stderr+result.stdout).includes('Duplicate origin'))return '';if(result.status!==0)throw Error(secret?'Impossible de créer le jeton serveur.':String(result.stderr||'Commande Sanity échouée.'));return result.stdout}
for(const origin of ['http://localhost:3333','http://127.0.0.1:3333','http://localhost:3002','http://localhost:3000'])run(['cors','add',origin,'--credentials','--yes'])
console.log('Origines locales du CMS configurées.')
const envPath=path.join(root,'.env.local');if(fs.existsSync(envPath))process.loadEnvFile(envPath)
let env=fs.existsSync(envPath)?fs.readFileSync(envPath,'utf8'):''
function set(key,value){const expression=new RegExp('^'+key+'=.*$','m');env=expression.test(env)?env.replace(expression,key+'='+value):env+'\n'+key+'='+value}
for(const [name,role]of [['SANITY_READ_TOKEN','viewer'],['SANITY_WRITE_TOKEN','editor']]){
if(process.env[name])continue
const output=run(['tokens','create','Néotisse serveur '+role+' '+Date.now(),'--project',projectId,'--role',role,'--yes','--json'],true)
let parsed;try{parsed=JSON.parse(output)}catch{throw Error('Réponse du jeton non reconnue. Aucun secret affiché.')}
function secretIn(value){if(!value||typeof value!=='object')return null;for(const key of ['token','key'])if(typeof value[key]==='string'&&value[key].length>20)return value[key];for(const child of Object.values(value)){const found=secretIn(child);if(found)return found}return null}
const secret=secretIn(parsed);if(!secret)throw Error('Jeton absent de la réponse Sanity.')
set(name,secret);fs.writeFileSync(envPath,env.trim()+'\n',{mode:0o600});console.log('Accès serveur '+role+' enregistré dans le fichier privé.')
}
set('SANITY_PROJECT_ID',projectId);set('SANITY_DATASET',dataset);set('SANITY_STUDIO_URL','/studio/');set('CMS_PROVIDER','local');fs.writeFileSync(envPath,env.trim()+'\n',{mode:0o600});
console.log('Configuration terminée. Importer et vérifier les contenus avant de basculer CMS_PROVIDER=sanity.')

}
main().catch(()=>{console.error('Configuration interrompue : vérifier la connexion Sanity et les droits sur le projet. Aucun secret affiché.');process.exitCode=1})
