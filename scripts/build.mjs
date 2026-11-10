import {mkdir,readFile,writeFile,cp} from 'node:fs/promises';
await mkdir('dist/server',{recursive:true}); await mkdir('dist/.openai',{recursive:true});
const html=await readFile('web/index.html','utf8'),css=await readFile('web/style.css','utf8'),js=await readFile('web/app.js','utf8');
const source=await readFile('server/worker.js','utf8');
await writeFile('dist/server/index.js',`const ASSETS = ${JSON.stringify({html,css,js})};\n`+source.replace("import { ASSETS } from './assets.js';",''));
await cp('.openai/hosting.json','dist/.openai/hosting.json'); await cp('drizzle','dist/drizzle',{recursive:true});
console.log('Built Folio Worker and database migrations.');
