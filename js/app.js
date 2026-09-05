const $=s=>document.querySelector(s);const params=new URLSearchParams(location.search);
async function loadCatalog(){const r=await fetch(FLOPPY_CONFIG.CATALOG_URL);if(!r.ok)throw Error('catalog');return r.json()}
function card(a){return `<a class="card" href="anime.html?id=${encodeURIComponent(a.id)}"><div class="poster"><img src="${a.cover}" alt="${esc(a.title)}" loading="lazy"><span class="badge">${a.status==='Em lançamento'?'NOVO':'HD'}</span></div><div class="card-info"><div class="card-title">${esc(a.title)}</div><div class="card-meta">${a.year} · ${a.genres?.[0]||'Anime'}</div></div></a>`}
function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function setupSearch(){const f=$('#searchForm');if(!f)return;f.addEventListener('submit',e=>{e.preventDefault();const q=$('#searchInput').value.trim();location.href='catalogo.html'+(q?'?q='+encodeURIComponent(q):'')})}
setupSearch();
