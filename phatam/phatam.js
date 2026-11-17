/* Phát âm tiếng Trung – 6 buổi. Dữ liệu: phatam/data.js (window.PA). Dùng helper của trang chính qua window.HSK */
(function(){
const P=window.PA;if(!P)return;
const H=()=>window.HSK;
const $=h=>H().$(h), esc=s=>H().esc(s==null?'':s);
const fmt=s=>esc(s).replace(/\{([^}]*)\}/g,'<b class="asp">$1</b>');
const plain=s=>String(s||'').replace(/[{}]/g,'');
const play=src=>src?H().playClip(src,[0,1e9]):Promise.resolve(false);
const SPK='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
const SLOW='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 16c0-4 3.5-7 8-7s8 3 8 7z" fill="currentColor" opacity=".85"/><path d="M19 13.5c1.2 0 2-.8 2-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="7" cy="18" r="1.6" fill="currentColor"/><circle cx="15" cy="18" r="1.6" fill="currentColor"/></svg>';
const MIC='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
function sbtn(src,slow,label){if(!src)return '';return `<button class="pa-ic${slow?' slow':''}" data-a="${esc(src)}" aria-label="${esc(label||(slow?'Nghe chậm':'Nghe'))}" title="${slow?'Nghe chậm':'Nghe'}">${slow?SLOW:SPK}</button>`}
function wire(root){root.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||!root.contains(b))return;e.stopPropagation();
  root.querySelectorAll('.pa-ic.on,.pa-word.on').forEach(x=>x.classList.remove('on'));b.classList.add('on');play(b.dataset.a).then(()=>b.classList.remove('on'))})}
/* ---------- tiến độ ---------- */
function st(){const S=H().S;S.pa=S.pa||{};return S.pa}
function rec(n,t,v){const o=st()[n]||(st()[n]={});if(v>=(o[t]||0)){o[t]=v;H().save()}}
function pct(n){const b=P.B[n-1],o=st()[n]||{},ks=b.prac.map(s=>s.title);if(!ks.length)return 0;return Math.round(ks.reduce((a,k)=>a+(o[k]||0),0)/ks.length)}
window.PA_PCT=pct;
/* ---------- tổng quan ---------- */
function overview(){
  const v=$(`<div class="pa"><p class="sub" style="margin:0"><a href="#bai-hoc" style="color:var(--brand)">← Bài học HSK 1</a></p>
  <h2>Phát âm tiếng Trung <span class="han" style="color:var(--mute);font-weight:500">汉语语音</span></h2>
  <p class="sub">6 buổi · Thanh mẫu – Vận mẫu – Thanh điệu. Học trước khi vào Bài 1 giáo trình.</p>
  <div class="card pa-anat">
    <div class="pa-syl"><div class="han big">好</div><div class="py">hǎo</div></div>
    <div class="pa-parts">
      <div class="part"><b>h</b><span>Thanh mẫu 声母</span><small>phụ âm đầu · 21 âm</small></div>
      <div class="plus">+</div>
      <div class="part"><b>ao</b><span>Vận mẫu 韵母</span><small>phần vần · 35 vần</small></div>
      <div class="plus">+</div>
      <div class="part"><b>ˇ</b><span>Thanh điệu 声调</span><small>4 thanh + thanh nhẹ</small></div>
    </div>
    <p class="note" style="margin:10px 0 0">Mỗi âm tiết (thường ứng với một chữ Hán) gồm 3 phần như trên.</p>
  </div>
  <div class="card pa-legend"><div><span class="pa-ic static">${SPK}</span> Nghe tốc độ thường</div><div><span class="pa-ic slow static">${SLOW}</span> Nghe chậm để phân tích khẩu hình</div><div><b class="asp" style="font-size:18px">p t k q c ch</b> chữ xanh = âm bật hơi</div><div><span class="pill">GV</span> audio gốc của giáo viên</div></div>
  <div class="grid" id="g" style="margin-top:14px"></div>
  <div class="card" style="margin-top:14px"><h3>Quy trình luyện đọc</h3><ol class="pa-steps"><li><b>Nghe mẫu</b> – bấm loa</li><li><b>Đọc theo</b> – đọc to cùng audio</li><li><b>Tự đọc</b> – không nhìn, không nghe</li><li><b>Nghe lại</b> – bật audio để đối chiếu, tự sửa</li></ol></div></div>`);
  const g=v.querySelector('#g');
  P.B.forEach(b=>{const p=pct(b.n);g.append($(`<a class="les" href="#phat-am-${b.n}"><b>BUỔI ${b.n}</b><span class="pa-bt">${esc(b.sub)}</span><div class="meter" title="${p}%"><i style="width:${p}%"></i></div><small>${p}% bài luyện tập</small></a>`))});
  return v}
/* ---------- buổi ---------- */
const TABS=[['learn','Bài học'],['prac','Luyện tập'],['hw','Bài tập về nhà'],['memo','Ghi nhớ']];
function session(n,tab){
  const b=P.B[n-1];if(!b)return overview();tab=tab||'learn';
  const v=$(`<div class="pa"><p class="sub" style="margin:0"><a href="#phat-am" style="color:var(--brand)">← Phát âm · 6 buổi</a></p>
   <h2>Buổi ${n}</h2><p class="sub">${esc(b.sub)}</p>
   <div class="tabs" id="t" role="tablist"></div><div id="p"></div>
   <div class="pa-nav row">${n>1?`<a class="btn ghost sm" href="#phat-am-${n-1}">← Buổi ${n-1}</a>`:''}<span style="flex:1"></span>${n<6?`<a class="btn sm" href="#phat-am-${n+1}">Buổi ${n+1} →</a>`:'<a class="btn sm" href="#bai-1">Vào Bài 1 →</a>'}</div></div>`);
  const t=v.querySelector('#t'),p=v.querySelector('#p');
  const show=k=>{H().stopClip();t.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x.dataset.k===k));p.replaceChildren(PANES[k](b));history.replaceState(null,'','#phat-am-'+n+(k==='learn'?'':'/'+k))};
  TABS.forEach(([k,l])=>{const x=$(`<button role="tab" data-k="${k}">${l}</button>`);x.onclick=()=>show(k);t.append(x)});
  show(TABS.some(x=>x[0]===tab)?tab:'learn');return v}
/* ---------- render các loại mục ---------- */
function head(s,extra){
  const gv=(s.gv||[]).map(g=>`<div class="pa-gv"><span class="pill">GV</span><audio controls preload="none" src="${esc(g.src)}"></audio></div>`).join('');
  return `<div class="pa-h"><h3>${esc(s.title)}</h3>${s.all?`<button class="btn ghost sm" data-a="${esc(s.all)}">${SPK.replace('<svg','<svg class="i"')} Nghe cả mục</button>`:''}</div>${s.hint?`<p class="note">${esc(s.hint)}</p>`:''}${gv}${extra||''}`}
function wordCard(w){return `<div class="pa-word" data-a="${esc(w.a)}" role="button" tabindex="0" aria-label="Nghe ${esc(w.h)}">${w.e?`<span class="emo" aria-hidden="true">${w.e}</span>`:''}<span class="han hz">${esc(w.h)}</span>${w.p?`<span class="py">${fmt(w.p)}</span>`:''}${w.m?`<span class="mn">${esc(w.m)}</span>`:''}<span class="ctl">${sbtn(w.a,0)}${sbtn(w.as,1)}</span></div>`}
const R={
 intro:s=>{let h=head(s);
   s.groups.forEach(g=>{if(!g.ls.length&&!g.label)return;h+=`${g.label?`<p class="pa-gl">${esc(g.label)}</p>`:''}<div class="pa-letters">${g.ls.map(l=>`<span>${esc(l)}</span>`).join('')}</div>`});
   if(s.imgs)h+=`<div class="pa-imgs">${s.imgs.map(i=>`<figure><img src="${esc(i)}" alt="Sơ đồ khẩu hình" loading="lazy"></figure>`).join('')}</div>`;
   if(s.video)h+=`<video class="pa-video" controls preload="metadata" playsinline src="${esc(s.video)}"></video>`;
   if(s.cap)h+=s.cap.map(c=>`<p class="note">${esc(c)}</p>`).join('');return h},
 how:s=>head(s)+`<div class="pa-how">${s.it.map(x=>{const tags=x.d[0]&&x.d[0].includes(' · ')?x.d[0]:'';const rest=tags?x.d.slice(1):x.d;
   return `<div class="it"><div class="sym">${esc(x.s)}</div><div>${tags?`<div class="tags">${tags.split(' · ').map(t=>`<span>${esc(t)}</span>`).join('')}</div>`:''}${rest.map(r=>r.startsWith('Mẹo')?`<p class="tip">${esc(r.replace(/^Mẹo:\s*/,'').replace(/Mẹo:\s*/g,'· '))}</p>`:`<p>${esc(r)}</p>`).join('')}</div></div>`}).join('')}</div>`,
 tones:s=>{const C=[[5,5],[3,5],[2,1,4],[5,1]],M=['ā','á','ǎ','à'];
   const svg=(c,i)=>{const X=c.length===3?[14,50,86]:[14,86],pts=c.map((y,j)=>`${X[j]},${(5-y)*18+8}`).join(' ');
     return `<svg viewBox="0 0 100 88" class="tone" aria-label="Đường thanh ${i+1}">${[1,2,3,4,5].map(y=>`<line x1="8" x2="92" y1="${(5-y)*18+8}" y2="${(5-y)*18+8}" class="gl"/><text x="2" y="${(5-y)*18+11}" class="gt">${y}</text>`).join('')}<polyline points="${pts}" class="tl"/>${c.map((y,j)=>`<circle cx="${X[j]}" cy="${(5-y)*18+8}" r="3.4" class="td"/>`).join('')}</svg>`};
   return head(s)+`<div class="pa-tones">${C.map((c,i)=>`<div class="tn"><b>Thanh ${i+1}</b>${svg(c,i)}<div class="mk">${M[i]}</div><p>${esc(s.d[i]||'')}</p></div>`).join('')}</div>${s.note?`<p class="pa-noteb">${esc(s.note)}</p>`:''}`},
 words:s=>{let h=head(s);
   if(s.rules)h+=`<div class="pa-noteb">${s.rules.filter(r=>r!=='Quy tắc').map(r=>`<p>${esc(r)}</p>`).join('')}</div>`;
   const pairs=s.it.some(x=>x.pair);
   h+=pairs?`<div class="pa-pairs">${s.it.map((x,i)=>x.pair?`<div class="pr"><span class="no">${i+1}</span>${wordCard(x.pair[0])}<span class="vs">vs</span>${wordCard(x.pair[1])}</div>`:wordCard(x)).join('')}</div>`
     :`<div class="pa-words${s.it.every(x=>!x.m)?' compact':''}">${s.it.map(wordCard).join('')}</div>`;
   if(s.note)h+=`<p class="pa-noteb">${esc(s.note)}</p>`;return h},
 sent:s=>head(s)+`<div class="pa-sents">${s.it.map((x,i)=>`<div class="sn">${x.lab?`<span class="pill">${esc(x.lab)}</span>`:`<span class="no">${i+1}</span>`}<div class="tx"><div class="han zh">${esc(x.h)}</div>${x.p?`<div class="py">${fmt(x.p)}</div>`:''}${x.m?`<div class="mn">${esc(x.m)}</div>`:''}</div><span class="ctl">${sbtn(x.a,0)}${sbtn(x.as,1)}</span></div>`).join('')}</div>`,
 rule:s=>head(s)+`<div class="pa-rule">${s.rows.map(r=>{const op=r.length>2&&r.every(c=>c.t.join('').length<16);
   return `<div class="rr${op?' op':''}">${r.map(c=>{const t=c.t.join('\n');if(/^\d$/.test(t))return `<span class="no">${t}</span>`;
     if(c.a)return `<button class="pa-chip" data-a="${esc(c.a)}"><span class="han">${esc(c.t[0])}</span>${c.t[1]?`<small>${esc(c.t[1])}</small>`:''}${SPK.replace('<svg','<svg class="i"')}</button>`;
     if(op)return `<span class="${/^[+=]$/.test(t)?'sym':'cell'}">${esc(t)}</span>`;
     return `<div class="cell">${c.t.map((x,k)=>`<p${k===0&&c.t.length>1?' class="b"':''}>${esc(x)}</p>`).join('')}</div>`}).join('')}</div>`}).join('')}</div>`,
 formula:s=>head(s)+`<div class="pa-fm">${s.blocks.map(bl=>`<div class="bl"><p class="b">${esc(bl.h)}</p>${bl.fs.map((f,k)=>`<div class="fr"><div class="pa-rule"><div class="rr op">${f.map(x=>/^[+=]$/.test(x)?`<span class="sym">${x}</span>`:`<span class="cell">${esc(x)}</span>`).join('')}</div></div>${bl.fs.length>1&&bl.ex[k]?`<span class="ex">${fmt(bl.ex[k])}</span>`:''}</div>`).join('')}${bl.fs.length===1?`<p class="ex">Ví dụ: ${bl.ex.map(fmt).join(' · ')}</p>`:''}</div>`).join('')}</div>${s.note?`<p class="pa-noteb">${esc(s.note)}</p>`:''}`,
 blocks:s=>head(s)+`<div class="pa-memo">${s.blocks.map(bl=>`<div class="card"><b>${esc(bl.t)}</b>${bl.list.length>1?`<ul>${bl.list.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:`<p>${esc(bl.list[0])}</p>`}</div>`).join('')}</div>`,
 table:s=>head(s)+`<div class="tblwrap pa-tbl"><table>${s.rows.map((r,i)=>`<tr>${r.map((c,j)=>i===0||j===0?`<th>${esc(c)}</th>`:`<td>${fmt(c)}</td>`).join('')}</tr>`).join('')}</table></div>${(s.cap||[]).map(c=>`<p class="note">${esc(c)}</p>`).join('')}`,
 syll:s=>{const four=s.tok.length%4===0&&!s.tok[0].startsWith('(');
   return head(s)+`<div class="pa-syll${four?' four':''}">${s.tok.map(t=>`<span>${fmt(t)}</span>`).join('')}</div><ol class="pa-steps sm"><li>Nghe mẫu</li><li>Đọc theo</li><li>Tự đọc</li><li>Nghe lại đối chiếu</li></ol>`}
};
function sectionEl(s,i){const el=$(`<section class="card pa-sec" id="pa-s${i}"></section>`);el.innerHTML=(R[s.type]||R.rule)(s);wire(el);
  el.querySelectorAll('.pa-word').forEach(w=>w.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();w.click()}}));return el}
/* ---------- bài tập ---------- */
const NUM={a:'āáǎà',e:'ēéěè',i:'īíǐì',o:'ōóǒò',u:'ūúǔù',ü:'ǖǘǚǜ'};
function num2mark(s){return s.replace(/v/g,'ü').replace(/([a-zü]+)([1-5])/gi,(m,syl,t)=>{t=+t;if(t===5)return syl;const l=syl.toLowerCase();
  let i=l.search(/[ae]/);if(i<0)i=l.indexOf('ou');if(i<0){const vs=[...l].map((c,k)=>'aeiouü'.includes(c)?k:-1).filter(k=>k>=0);i=vs.length?vs[vs.length-1]:-1}
  if(i<0)return syl;const c=l[i];return syl.slice(0,i)+NUM[c][t-1]+syl.slice(i+1)})}
const norm=s=>num2mark(plain(s).toLowerCase()).normalize('NFC').replace(/[\s'’·\-–]/g,'');
function scoreBox(n,s,ok,tot){const p=Math.round(ok/tot*100);rec(n,s.title,p);return `<div class="pa-score"><span class="score">${ok}/${tot}</span><span class="tag ${p>=80?'':'no'}">${p}%</span><span class="note">Đã lưu vào bảng điểm.</span></div>`}
const X={
 choice:(s,n)=>{const el=$(`<div>${head(s)}<div class="pa-qs"></div><div class="row" style="margin-top:12px"><button class="btn" data-sub>Nộp bài</button><button class="btn ghost" data-rs>Làm lại</button></div><div data-res></div></div>`),A={};
   const qs=el.querySelector('.pa-qs');
   s.q.forEach((q,i)=>{const it=$(`<div class="pa-q"><span class="no">${i+1}</span>${sbtn(q.a,0,'Nghe câu '+(i+1))}<div class="opts">${q.o.map((o,j)=>`<button data-j="${j}"><b>${'AB'[j]}.</b> ${fmt(o)}</button>`).join('')}</div></div>`);
     it.querySelectorAll('.opts button').forEach(b=>b.onclick=()=>{if(el.dataset.done)return;A[i]=+b.dataset.j;it.querySelectorAll('.opts button').forEach(x=>x.classList.toggle('sel',x===b))});qs.append(it)});
   el.querySelector('[data-sub]').onclick=()=>{if(el.dataset.done)return;el.dataset.done=1;let ok=0;
     s.q.forEach((q,i)=>{const bs=qs.children[i].querySelectorAll('.opts button');bs.forEach((b,j)=>{if(j===s.k[i])b.classList.add('ok');else if(j===A[i])b.classList.add('bad')});if(A[i]===s.k[i])ok++;
       qs.children[i].insertAdjacentHTML('beforeend',`<span class="han pa-ans">${esc(q.h)}</span>`)});
     el.querySelector('[data-res]').innerHTML=scoreBox(n,s,ok,s.q.length)};
   el.querySelector('[data-rs]').onclick=()=>el.replaceWith(X.choice(s,n));return el},
 tone:(s,n)=>{const el=$(`<div>${head(s)}<div class="pa-qs"></div><div class="row" style="margin-top:12px"><button class="btn" data-sub>Nộp bài</button><button class="btn ghost" data-rs>Làm lại</button></div><div data-res></div></div>`),A={};
   const qs=el.querySelector('.pa-qs');
   s.q.forEach((q,i)=>{const it=$(`<div class="pa-q"><span class="no">${i+1}</span>${sbtn(q.a,0)}<b class="pa-syl1">${esc(q.s)}</b><div class="pa-tbtn">${[1,2,3,4].map(t=>`<button data-t="${t}">${t}</button>`).join('')}</div></div>`);
     it.querySelectorAll('.pa-tbtn button').forEach(b=>b.onclick=()=>{if(el.dataset.done)return;A[i]=+b.dataset.t;it.querySelectorAll('.pa-tbtn button').forEach(x=>x.classList.toggle('sel',x===b))});qs.append(it)});
   el.querySelector('[data-sub]').onclick=()=>{if(el.dataset.done)return;el.dataset.done=1;let ok=0;
     s.q.forEach((q,i)=>{const it=qs.children[i];it.querySelectorAll('.pa-tbtn button').forEach(b=>{const t=+b.dataset.t;if(t===s.k[i])b.classList.add('ok');else if(t===A[i])b.classList.add('bad')});if(A[i]===s.k[i])ok++;
       it.insertAdjacentHTML('beforeend',`<span class="pa-ans">${fmt(s.kp[i]||'')} <span class="han">${esc(q.h)}</span></span>`)});
     el.querySelector('[data-res]').innerHTML=scoreBox(n,s,ok,s.q.length)};
   el.querySelector('[data-rs]').onclick=()=>el.replaceWith(X.tone(s,n));return el},
 reflex:(s,n)=>{const el=$(`<div>${head(s)}<p class="note">Đọc to trước, sau đó bấm <b>Nghe đáp án</b> để đối chiếu.</p><div class="pa-words">${s.q.map((q,i)=>`<div class="pa-word rf"><span class="han hz">${esc(q.h)}</span>${q.p?`<span class="py">${fmt(q.p)}</span>`:''}${q.m?`<span class="mn">${esc(q.m)}</span>`:''}<span class="py rv" hidden>${fmt((s.k&&s.k[i]||'').split(' – ').pop())}</span><button class="btn ghost sm" data-i="${i}">Nghe đáp án</button></div>`).join('')}</div></div>`);
   let seen=new Set();el.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i,c=b.parentNode;const rv=c.querySelector('.rv');if(rv&&rv.textContent.trim())rv.hidden=false;play(s.q[i].a);seen.add(i);if(seen.size===s.q.length)rec(n,s.title,100)});return el},
 fix:(s,n)=>{const el=$(`<div>${head(s)}<p class="note">Tìm chỗ sai (nếu có) và viết lại cho đúng, rồi xem đáp án và tự chấm.</p><div class="pa-qs">${s.q.map((q,i)=>`<div class="pa-fx"><div><span class="no">${i+1}</span><span class="han-mix">${esc(q)}</span></div><input type="text" placeholder="Viết lại cho đúng (có thể gõ số thanh: yu2)" aria-label="Câu ${i+1}"><div class="row"><button class="btn ghost sm" data-i="${i}">Xem đáp án</button><span class="pa-ans" hidden>${fmt(s.k[i]||'')}</span><span class="self" hidden><button class="btn sm" data-y>Mình làm đúng</button><button class="btn ghost sm" data-n>Chưa đúng</button></span></div></div>`).join('')}</div><div data-res></div></div>`);
   const R2={};const upd=()=>{if(Object.keys(R2).length===s.q.length){const ok=Object.values(R2).filter(Boolean).length;el.querySelector('[data-res]').innerHTML=scoreBox(n,s,ok,s.q.length)}};
   el.querySelectorAll('.pa-fx').forEach((f,i)=>{f.querySelector('[data-i]').onclick=e=>{f.querySelector('.pa-ans').hidden=false;f.querySelector('.self').hidden=false;e.target.hidden=true};
     f.querySelector('[data-y]').onclick=()=>{R2[i]=1;f.classList.add('ok');f.classList.remove('bad');upd()};f.querySelector('[data-n]').onclick=()=>{R2[i]=0;f.classList.add('bad');f.classList.remove('ok');upd()}});return el},
 dict:(s,n)=>{const el=$(`<div>${head(s)}<p class="note">Nghe audio của giáo viên, viết phiên âm có dấu thanh. Có thể gõ số thanh sau mỗi âm tiết, ví dụ <code>ni3 hao3</code> → nǐ hǎo.</p><div class="pa-dict">${Array.from({length:s.count},(_,i)=>`<label><span class="no">(${i+1})</span><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false"><span class="pv"></span></label>`).join('')}</div><div class="row" style="margin-top:12px"><button class="btn" data-sub>Kiểm tra</button><button class="btn ghost" data-rs>Làm lại</button></div><div data-res></div></div>`);
   el.querySelectorAll('.pa-dict input').forEach(inp=>inp.addEventListener('input',()=>{const m=num2mark(inp.value);inp.nextElementSibling.textContent=m!==inp.value?m:''}));
   el.querySelector('[data-sub]').onclick=()=>{let ok=0;el.querySelectorAll('.pa-dict label').forEach((l,i)=>{const inp=l.querySelector('input'),k=s.k[i]||'';const good=norm(inp.value)===norm(k);if(good)ok++;
     l.classList.toggle('ok',good);l.classList.toggle('bad',!good);l.querySelector('.pv').innerHTML=good?'✓':`→ ${fmt(k)}`});el.querySelector('[data-res]').innerHTML=scoreBox(n,s,ok,s.count)};
   el.querySelector('[data-rs]').onclick=()=>el.replaceWith(X.dict(s,n));return el}
};
/* ---------- thu âm ---------- */
let mr=null,chunks=[],recBtn=null;
async function startRec(btn,onDone){if(!navigator.mediaDevices||!window.MediaRecorder){alert('Trình duyệt này chưa hỗ trợ thu âm. Hãy dùng Chrome, Edge hoặc Safari mới.');return}
  if(mr){stopRec();return}
  try{const st=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];mr=new MediaRecorder(st);recBtn=btn;btn.classList.add('rec');
    mr.ondataavailable=e=>chunks.push(e.data);mr.onstop=()=>{st.getTracks().forEach(t=>t.stop());const blob=new Blob(chunks,{type:mr.mimeType||'audio/webm'});btn.classList.remove('rec');mr=null;onDone(blob)};mr.start()}
  catch(e){alert('Không mở được micro. Hãy cho phép trang dùng micro rồi thử lại.')}}
function stopRec(){if(mr&&mr.state!=='inactive')mr.stop()}
const PANES={
 learn:b=>{const v=$(`<div><div class="card pa-goal"><h3>Mục tiêu buổi học</h3><ul>${b.goals.map(g=>`<li>${esc(g)}</li>`).join('')}</ul></div><nav class="pa-toc" aria-label="Mục lục"></nav><div class="pa-list"></div></div>`);
   const toc=v.querySelector('.pa-toc'),list=v.querySelector('.pa-list');
   b.learn.forEach((s,i)=>{list.append(sectionEl(s,i));const a=$(`<a href="#">${esc(s.title.replace(/^(Ví dụ|Phân biệt|Cách phát âm):?\s*/,m=>m))}</a>`);a.onclick=e=>{e.preventDefault();v.querySelector('#pa-s'+i).scrollIntoView({behavior:'smooth',block:'start'})};toc.append(a)});
   return v},
 prac:b=>{const v=$(`<div><p class="sub">Bài tập nghe và nhận diện của Buổi ${b.n}. Điểm cao nhất của mỗi bài được lưu vào <a href="#bang-diem" style="color:var(--brand)">Bảng điểm</a>.</p></div>`);
   b.prac.forEach(s=>{const c=$(`<section class="card pa-sec"></section>`);const inner=(X[s.type]||(()=>$('<div></div>')))(s,b.n);c.append(inner);wire(c);v.append(c)});return v},
 hw:b=>{const hw=b.hw;const v=$(`<div><div class="card"><h3>${esc(hw.title)}</h3><p class="note">Nghe mẫu → đọc theo → bấm <b>micro</b> để thu giọng của bạn → nghe lại so sánh với mẫu. Khi đã tự tin, bấm <b>Thu âm cả bài</b> và đọc lần lượt 30 từ để gửi giáo viên.</p>
   <div class="row"><button class="btn" data-all>${MIC.replace('<svg','<svg class="i"')} Thu âm cả bài</button><span class="note" data-st></span></div><div data-out></div></div>
   <div class="pa-hw">${hw.items.map((x,i)=>`<div class="hw"><span class="no">${i+1}</span><div class="tx"><span class="han hz">${esc(x.h)}</span><span class="py">${fmt(x.p)}</span></div><span class="ctl">${sbtn(x.a,0)}${sbtn(x.as,1)}<button class="pa-ic mic" data-r="${i}" aria-label="Thu âm từ ${i+1}" title="Thu âm">${MIC}</button><button class="pa-ic me" data-m="${i}" hidden aria-label="Nghe giọng của bạn" title="Nghe giọng của bạn">Tôi</button></span></div>`).join('')}</div></div>`);
   wire(v);const mine={};
   v.querySelectorAll('[data-r]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();const i=+btn.dataset.r;startRec(btn,blob=>{if(mine[i])URL.revokeObjectURL(mine[i]);mine[i]=URL.createObjectURL(blob);const m=v.querySelector(`[data-m="${i}"]`);m.hidden=false;play(mine[i])})});
   v.querySelectorAll('[data-m]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();const u=mine[+btn.dataset.m];if(u){const a=new Audio(u);a.play()}});
   const all=v.querySelector('[data-all]'),stx=v.querySelector('[data-st]');
   all.onclick=()=>{if(mr){stopRec();return}stx.textContent='Đang thu… đọc lần lượt các từ, bấm lại để dừng.';all.lastChild.textContent=' Dừng thu';
     startRec(all,blob=>{all.lastChild.textContent=' Thu âm cả bài';stx.textContent='';const u=URL.createObjectURL(blob),ext=(blob.type.includes('mp4')?'m4a':'webm');
       const nm=`BTVN-Buoi${b.n}-${(H().S.name||'hoc-vien').replace(/[^\p{L}\p{N}]+/gu,'-')}.${ext}`;
       v.querySelector('[data-out]').innerHTML=`<div class="pa-recout"><audio controls src="${u}"></audio><a class="btn ghost sm" href="${u}" download="${esc(nm)}">Tải file ghi âm</a></div><p class="note">Gửi file này cho giáo viên qua Zalo/Messenger.</p>`;rec(b.n,'BTVN',100)})};
   return v},
 memo:b=>$(`<div><div class="pa-memo">${b.memo.map(m=>`<div class="card"><b>${esc(m.t)}</b><p>${esc(m.d)}</p></div>`).join('')}</div></div>`)
};
window.PAV=function(h){const m=h.match(/^phat-am(?:-(\d))?(?:\/(\w+))?$/);if(!m||!m[1])return overview();return session(+m[1],m[2])};
window.PA_BOARD=function(){return P.B.map(b=>({n:b.n,sub:b.sub,p:pct(b.n),d:st()[b.n]||{}}))};
})();
