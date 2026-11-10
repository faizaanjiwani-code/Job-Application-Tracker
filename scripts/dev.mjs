import http from 'node:http'; import {DatabaseSync} from 'node:sqlite'; import {readFile,mkdir} from 'node:fs/promises';
await import('./build.mjs'); await mkdir('.sites-runtime',{recursive:true});
const sqlite=new DatabaseSync('.sites-runtime/folio.sqlite');
const applied=sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='jobs'").get();
if(!applied)sqlite.exec(await readFile('drizzle/0000_folio.sql','utf8'));
const DB={prepare(sql){let args=[];return {bind(...a){args=a;return this},async all(){return {results:sqlite.prepare(sql).all(...args)}},async first(){return sqlite.prepare(sql).get(...args)||null},async run(){return sqlite.prepare(sql).run(...args)}}},async batch(stmts){sqlite.exec('BEGIN');try{const r=[];for(const s of stmts)r.push(await s.run());sqlite.exec('COMMIT');return r}catch(e){sqlite.exec('ROLLBACK');throw e}}};
const {default:worker}=await import('../dist/server/index.js?'+Date.now());
const p=process.argv.indexOf('--port'),port=p>=0?Number(process.argv[p+1]):4173;
http.createServer(async(req,res)=>{try{let body='';for await(const chunk of req){body+=chunk;if(body.length>1500000){res.writeHead(413);res.end();return}}const request=new Request(`http://${req.headers.host}${req.url}`,{method:req.method,headers:{...req.headers,'oai-authenticated-user-id':'local-owner'},...(req.method==='GET'||req.method==='HEAD'?{}:{body})});const response=await worker.fetch(request,{DB},{waitUntil:p=>p.catch(console.error)});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()))}catch(e){console.error(e);res.writeHead(500);res.end('Local preview error')}}).listen(port,'127.0.0.1',()=>console.log(`Local: http://localhost:${port}`));
