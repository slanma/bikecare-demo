const STORAGE_KEY = 'bikecare-demo-orders-v1';
const STATUSES = ['Přijato', 'Diagnostika', 'Čeká na schválení', 'Oprava', 'Připraveno k vyzvednutí', 'Dokončeno'];
const STEPS = ['Přijato', 'Diagnostika', 'Oprava', 'Hotovo'];

const demoOrders = [
  {code:'BC-2407',name:'Petr Dvořák',phone:'+420 777 204 118',email:'petr@email.cz',bikeType:'Elektrokolo',brand:'Trek',model:'Powerfly 5',issue:'Výměna řetězu a kontrola brzd',preferredDate:'2026-07-11',budget:'Do 3 000 Kč',status:'Diagnostika',price:0,created:'2026-07-10T08:30:00'},
  {code:'BC-2412',name:'Lucie Malá',phone:'+420 602 445 991',email:'lucie@email.cz',bikeType:'Silniční',brand:'Specialized',model:'Tarmac SL6',issue:'Seřízení přehazovačky, řazení přeskakuje',preferredDate:'2026-07-12',budget:'Do 1 500 Kč',status:'Přijato',price:0,created:'2026-07-11T07:55:00'},
  {code:'BC-2389',name:'Marek Svoboda',phone:'+420 731 119 002',email:'marek@email.cz',bikeType:'Horské',brand:'Canyon',model:'Neuron 7',issue:'Velký servis vidlice a tlumiče',preferredDate:'2026-07-10',budget:'Do 5 000 Kč',status:'Oprava',price:4200,created:'2026-07-08T11:20:00'},
  {code:'BC-2371',name:'Eva Jelínková',phone:'+420 604 772 104',email:'eva@email.cz',bikeType:'Městské',brand:'Author',model:'Simplex',issue:'Výměna pláště a duše zadního kola',preferredDate:'2026-07-09',budget:'Do 1 500 Kč',status:'Připraveno k vyzvednutí',price:980,created:'2026-07-07T15:05:00'}
];

let orders = loadOrders();
let currentCode = null;
const $ = (q, ctx=document) => ctx.querySelector(q);
const $$ = (q, ctx=document) => [...ctx.querySelectorAll(q)];

function loadOrders(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || demoOrders; }
  catch { return demoOrders; }
}
function saveOrders(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); }
function esc(value=''){ return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function money(value){ return value ? new Intl.NumberFormat('cs-CZ',{style:'currency',currency:'CZK',maximumFractionDigits:0}).format(value) : '—'; }
function date(value){ return new Intl.DateTimeFormat('cs-CZ',{day:'numeric',month:'long',year:'numeric'}).format(new Date(value)); }
function toast(msg){ const el=$('#toast'); el.textContent=msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),2200); }

function showView(id){
  $$('.view').forEach(v=>v.classList.toggle('active',v.id===id));
  window.scrollTo({top:0,behavior:'smooth'});
  if(id==='admin') renderAdmin();
  if(id==='tracking') setTimeout(()=>$('#tracking-code').focus(),100);
}
$$('[data-view]').forEach(el=>el.addEventListener('click',e=>{ e.preventDefault(); showView(el.dataset.view); }));

function newCode(){
  const max = orders.reduce((n,o)=>Math.max(n,Number(o.code.split('-')[1])||0),2400);
  return `BC-${max+1}`;
}

$('#intake-form').addEventListener('submit', e=>{
  e.preventDefault();
  const data=Object.fromEntries(new FormData(e.currentTarget));
  const order={...data,code:newCode(),status:'Přijato',price:0,created:new Date().toISOString()};
  orders.unshift(order); saveOrders(); currentCode=order.code;
  $('#created-code').textContent=order.code; e.currentTarget.reset(); showView('success');
});
$('#created-code').addEventListener('click',async()=>{ await navigator.clipboard?.writeText($('#created-code').textContent); toast('Servisní kód zkopírován'); });
$('#track-created').addEventListener('click',()=>{ $('#tracking-code').value=currentCode; showView('tracking'); renderTracking(currentCode); });
$('#tracking-form').addEventListener('submit',e=>{e.preventDefault();renderTracking($('#tracking-code').value.trim().toUpperCase());});

function stepIndex(status){ if(status==='Přijato')return 0;if(['Diagnostika','Čeká na schválení'].includes(status))return 1;if(status==='Oprava')return 2;return 3; }
function renderTracking(code){
  const target=$('#tracking-result'); const o=orders.find(x=>x.code.toUpperCase()===code);
  target.classList.remove('hidden');
  if(!o){target.innerHTML=`<div class="empty"><h3>Zakázku jsme nenašli</h3><p>Zkontrolujte prosím kód. Pro vyzkoušení použijte <b>BC-2407</b>.</p></div>`;return;}
  const active=stepIndex(o.status);
  target.innerHTML=`<div class="track-top"><div><small>${esc(o.brand)} ${esc(o.model)}</small><h3>${esc(o.issue)}</h3><span class="code">${esc(o.code)}</span></div><span class="status-pill">${esc(o.status)}</span></div>
    <div class="timeline">${STEPS.map((s,i)=>`<div class="timeline-step ${i<active?'done':''} ${i===active?'current':''}">${s}</div>`).join('')}</div>
    <div class="track-grid"><div class="info-box"><small>Preferovaný termín</small><strong>${date(o.preferredDate)}</strong></div><div class="info-box"><small>Aktuální kalkulace</small><strong>${money(o.price)}</strong></div></div>`;
}

function renderAdmin(){
  const q=$('#admin-search').value.toLowerCase(); const filter=$('#status-filter').value;
  const filtered=orders.filter(o=>(filter==='all'||o.status===filter)&&[o.code,o.name,o.brand,o.model,o.issue].join(' ').toLowerCase().includes(q));
  const active=orders.filter(o=>o.status!=='Dokončeno').length;
  const ready=orders.filter(o=>o.status==='Připraveno k vyzvednutí').length;
  const revenue=orders.reduce((n,o)=>n+(Number(o.price)||0),0);
  $('#stats').innerHTML=[['Aktivní zakázky',active],['Dnes přijato',orders.filter(o=>o.created.slice(0,10)===new Date().toISOString().slice(0,10)).length],['K vyzvednutí',ready],['Hodnota zakázek',money(revenue)]].map(x=>`<div class="stat-card"><small>${x[0]}</small><strong>${x[1]}</strong></div>`).join('');
  $('#orders-body').innerHTML=filtered.map(o=>`<tr><td class="order-code">${esc(o.code)}</td><td>${esc(o.name)}</td><td>${esc(o.brand)} ${esc(o.model)}</td><td class="issue" title="${esc(o.issue)}">${esc(o.issue)}</td><td><select class="status-select" data-code="${o.code}">${STATUSES.map(s=>`<option ${s===o.status?'selected':''}>${s}</option>`).join('')}</select></td><td>${money(o.price)}</td><td><button class="table-btn" data-detail="${o.code}">Detail</button></td></tr>`).join('');
  $('#empty-orders').classList.toggle('hidden',filtered.length>0);
  $$('.status-select').forEach(s=>s.addEventListener('change',()=>updateStatus(s.dataset.code,s.value)));
  $$('[data-detail]').forEach(b=>b.addEventListener('click',()=>openDetail(b.dataset.detail)));
}
function updateStatus(code,status){ const o=orders.find(x=>x.code===code);o.status=status;saveOrders();renderAdmin();toast(`Zakázka ${code}: ${status}`); }
function openDetail(code){
  const o=orders.find(x=>x.code===code); if(!o)return;
  $('#dialog-code').textContent=`${o.code} · ${o.brand} ${o.model}`;
  $('#dialog-content').innerHTML=`<div class="dialog-grid"><div class="info-box"><small>Zákazník</small><strong>${esc(o.name)}</strong><br>${esc(o.phone)}<br>${esc(o.email)}</div><div class="info-box"><small>Kolo</small><strong>${esc(o.bikeType)}</strong><br>${esc(o.brand)} ${esc(o.model)}</div><div class="info-box"><small>Požadavek</small><strong>${esc(o.issue)}</strong><br>${esc(o.budget)}</div><div class="info-box"><small>Cena zakázky</small><input id="detail-price" type="number" min="0" step="50" value="${o.price||''}" placeholder="Doplnit cenu v Kč"></div></div><div class="dialog-actions"><button type="button" id="save-detail" class="btn primary">Uložit cenu</button><button type="button" id="delete-order" class="btn secondary">Smazat demo zakázku</button></div>`;
  $('#order-dialog').showModal();
  $('#save-detail').onclick=()=>{o.price=Number($('#detail-price').value)||0;saveOrders();$('#order-dialog').close();renderAdmin();toast('Cena byla uložena');};
  $('#delete-order').onclick=()=>{if(confirm(`Opravdu smazat ${code}?`)){orders=orders.filter(x=>x.code!==code);saveOrders();$('#order-dialog').close();renderAdmin();}};
}

$('#admin-search').addEventListener('input',renderAdmin); $('#status-filter').addEventListener('change',renderAdmin);
$('#status-filter').innerHTML+=STATUSES.map(s=>`<option>${s}</option>`).join('');
$('#today-label').textContent=new Intl.DateTimeFormat('cs-CZ',{weekday:'long',day:'numeric',month:'long'}).format(new Date());
const minDate=new Date().toISOString().slice(0,10); $('[name="preferredDate"]').min=minDate;$('[name="preferredDate"]').value=minDate;
saveOrders();
