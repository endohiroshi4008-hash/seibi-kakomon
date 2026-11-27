// 端末にサイトを保存して、2回目以降は通信を待たずに開く。版（V）が変わったら古い保存分を消す
const V='e1915c9f67',C='seibi-'+V,RT='seibi-rt';
const PRE=['./','questions.json?v='+V];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>Promise.all(PRE.map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>{if(!r.ok)throw new Error(u);return c.put(u,r)})))))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('seibi-')&&k!==C&&k!==RT).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 if(u.pathname.endsWith('/version.json')||u.pathname.endsWith('/sw.js'))return;
 if(r.mode==='navigate'){e.respondWith(caches.open(C).then(c=>c.match('./')).then(m=>m||fetch(r)));return}
 // 図とフォントは版をまたいで保存（URLに中身のハッシュが付いている）。それ以外は今の版の保存場所へ
 const k=/\/(figs|fonts)\//.test(u.pathname)?RT:C;
 e.respondWith(caches.open(k).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok&&u.search)c.put(r,res.clone());return res}))))});
