const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});
document.getElementById('year').textContent = new Date().getFullYear();

const words = ['the future of tech.', 'AI & machine learning.', 'useful software.'];
const target = document.getElementById('typed');
let wordIndex = 0, charIndex = 0, deleting = false;
function type() {
  const word = words[wordIndex];
  target.textContent = word.slice(0, charIndex);
  if (!deleting && charIndex < word.length) {
    charIndex++;
    setTimeout(type, 85);
  } else if (deleting && charIndex > 0) {
    charIndex--;
    setTimeout(type, 42);
  } else {
    deleting = !deleting;
    if (!deleting) wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, deleting ? 1300 : 350);
  }
}
type();

const reveals=document.querySelectorAll('.about-grid,.skill-card,.project-card,.learning-row,.contact-section>*');
reveals.forEach(el=>el.classList.add('reveal'));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}}),{threshold:.12});
reveals.forEach(el=>io.observe(el));
const links=[...document.querySelectorAll('.nav-links a')];
const secs=links.map(a=>document.querySelector(a.getAttribute('href')));
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}}),{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(s=>s&&so.observe(s));

// Theme toggle (remembers choice)
const root=document.documentElement,themeBtn=document.getElementById('theme-toggle');
function syncTheme(){const light=root.getAttribute('data-theme')==='light';
  themeBtn.setAttribute('aria-label',light?'Switch to dark theme':'Switch to light theme');
  document.querySelector('meta[name=theme-color]').setAttribute('content',light?'#f6f5fb':'#090914');}
syncTheme();
themeBtn.addEventListener('click',()=>{const next=root.getAttribute('data-theme')==='light'?'dark':'light';
  root.setAttribute('data-theme',next);try{localStorage.setItem('theme',next)}catch(e){}syncTheme();});
// Contact form -> opens email app with message prefilled
const form=document.getElementById('contact-form'),status=document.getElementById('form-status');
form.addEventListener('submit',e=>{
  e.preventDefault();
  const f=Object.fromEntries(new FormData(form));let ok=true;
  ['email','subject','message'].forEach(k=>{const el=form.elements[k];const bad=!f[k].trim()||(k==='email'&&!/^\S+@\S+\.\S+$/.test(f[k]));
    el.parentElement.classList.toggle('invalid',bad);if(bad)ok=false;});
  if(!ok){status.textContent='Please fill in a valid email, a subject and your message.';status.className='form-status full error';return;}
  const body=`${f.message.trim()}\n\n—\nFrom: ${f.name.trim()||'Not given'}\nReply to: ${f.email.trim()}`;
  window.location.href=`mailto:prakash9342413667@gmail.com?subject=${encodeURIComponent(f.subject.trim())}&body=${encodeURIComponent(body)}`;
  status.textContent='Opening your email app… if nothing opens, email me directly below.';status.className='form-status full ok';form.reset();
});

// ---- Effects ----
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches, fine=matchMedia('(pointer: fine)').matches;
// scroll progress
const bar=document.getElementById('progress');
function prog(){const m=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(m>0?scrollY/m:0)+')';}
addEventListener('scroll',prog,{passive:true});prog();
// cursor glow, 3D tilt, magnetic buttons (mouse only)
if(fine&&!calm){
  const glow=document.getElementById('cursor-glow');
  addEventListener('pointermove',e=>{glow.classList.add('on');glow.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;},{passive:true});
  document.addEventListener('mouseleave',()=>glow.classList.remove('on'));
  const tilt=(el,max)=>{
    el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width,y=(e.clientY-b.top)/b.height;
      el.style.setProperty('--ry',((x-.5)*max*2).toFixed(2)+'deg');el.style.setProperty('--rx',((.5-y)*max*2).toFixed(2)+'deg');
      el.style.setProperty('--mx',(x*100)+'%');el.style.setProperty('--my',(y*100)+'%');});
    el.addEventListener('pointerleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg');});};
  tilt(document.querySelector('.profile-card'),9);
  document.querySelectorAll('.skill-card,.project-card').forEach(c=>tilt(c,4));
  document.querySelectorAll('.button,.social-btn').forEach(b=>{
    b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.translate=`${(e.clientX-r.left-r.width/2)*.18}px ${(e.clientY-r.top-r.height/2)*.28}px`;});
    b.addEventListener('pointerleave',()=>{b.style.translate='';});});
}
// particle network background
if(!calm){
  const cv=document.getElementById('bg-canvas'),cx=cv.getContext('2d');let W,H,pts=[],mouse={x:-999,y:-999},raf;
  const col=()=>document.documentElement.getAttribute('data-theme')==='light'?'106,69,224':'155,123,255';
  function size(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);
    const n=Math.min(70,Math.round(W*H/20000));pts=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35}));}
  function draw(){cx.clearRect(0,0,W,H);const c=col();
    for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      cx.fillStyle=`rgba(${c},.7)`;cx.beginPath();cx.arc(p.x,p.y,1.6,0,6.283);cx.fill();}
    for(let i=0;i<pts.length;i++){for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=dx*dx+dy*dy;
      if(d<14400){cx.strokeStyle=`rgba(${c},${.28*(1-d/14400)})`;cx.beginPath();cx.moveTo(pts[i].x,pts[i].y);cx.lineTo(pts[j].x,pts[j].y);cx.stroke();}}
      const mx=pts[i].x-mouse.x,my=pts[i].y-mouse.y,md=mx*mx+my*my;
      if(md<22500){cx.strokeStyle=`rgba(${c},${.5*(1-md/22500)})`;cx.beginPath();cx.moveTo(pts[i].x,pts[i].y);cx.lineTo(mouse.x,mouse.y);cx.stroke();}}
    raf=requestAnimationFrame(draw);}
  addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;},{passive:true});
  addEventListener('resize',size);
  document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(raf);if(!document.hidden)draw();});
  size();draw();
}

// ---- Auto-load projects from GitHub ----
// Status comes from each repo's TOPICS (only the repo owner can edit them):
//   Every repo is shown as Complete, except those with the "in-progress" topic. CP-style repos are hidden.
//   "no-portfolio" -> hide that repo from this page
const GH_USER='prakash9342413667-stack';
// Hides competitive-programming / practice-problem repos (matched on name, description and topics)
const CP_WORDS=/(^|[^a-z0-9])(cp|competitive|leetcode|codeforces|codechef|hackerrank|atcoder|problems?|problem-solving)([^a-z0-9]|$)/i;
const isDone=r=>(r.topics||[]).some(x=>x==='completed'||x==='complete');
const isCP=r=>CP_WORDS.test([r.name,r.description||'',...(r.topics||[])].join(' '));
(async function loadRepos(){
  const box=document.getElementById('gh-projects');if(!box)return;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  try{
    let data;
    try{const c=JSON.parse(sessionStorage.getItem('gh_repos')||'null');if(c&&Date.now()-c.t<6e5)data=c.d;}catch(e){}
    if(!data){
      const res=await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`);
      if(!res.ok)throw new Error(res.status);
      data=await res.json();
      try{sessionStorage.setItem('gh_repos',JSON.stringify({t:Date.now(),d:data}));}catch(e){}
    }
    const repos=data.filter(r=>!r.fork&&r.name.toLowerCase()!==GH_USER.toLowerCase()+'.github.io'&&!(r.topics||[]).includes('no-portfolio')&&!isCP(r));
    if(!repos.length){box.innerHTML='<p class="gh-note">No projects to show yet. New repositories on GitHub will appear here automatically.</p>';return;}
    const hidden=['completed','complete','in-progress','no-portfolio'];
    box.innerHTML=repos.map(r=>{
      const t=r.topics||[],done=!t.includes('in-progress');
      const tags=[r.language,...t.filter(x=>!hidden.includes(x))].filter(Boolean).slice(0,5).map(x=>`<span>${esc(x)}</span>`).join('');
      const name=r.name.replace(/[-_]+/g,' ');
      return `<article class="project-card gh-card"><div class="project-content">
        <div class="project-label">GITHUB REPOSITORY</div><h3>${esc(name)}</h3>
        <p>${esc(r.description||'No description yet. Add one in the repository settings on GitHub.')}</p>
        ${tags?`<div class="tags">${tags}</div>`:''}
        <div class="project-status"><span class="status ${done?'complete':'in-progress'}">${done?'Complete':'In Progress'}</span></div>
      </div><a class="project-arrow" href="${esc(r.html_url)}" target="_blank" rel="noopener" aria-label="Open ${esc(r.name)} on GitHub">↗</a></article>`;
    }).join('');
  }catch(err){
    box.innerHTML=`<p class="gh-note">Couldn't load projects from GitHub right now. <a class="text-link" href="https://github.com/${GH_USER}?tab=repositories" target="_blank" rel="noopener">View them on GitHub ↗</a></p>`;
  }
})();
