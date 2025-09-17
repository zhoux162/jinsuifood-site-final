// ---- Language Switch (safe for data-zh / data-zhp) ----
const zhBtn = document.getElementById('btn-zh');
const enBtn = document.getElementById('btn-en');

function setLang(lang){
  const isZh = (lang === 'zh');

  // 纯文本：data-zh / data-en
  document.querySelectorAll('[data-zh]').forEach(el=>{
    const zh = el.getAttribute('data-zh');
    const en = el.getAttribute('data-en');
    const val = isZh ? (zh || en) : (en || zh);
    if (val != null && val !== '') el.textContent = val; // 缺省不覆盖
  });

  // 允许 HTML：data-zhp / data-en
  document.querySelectorAll('[data-zhp]').forEach(el=>{
    const zh = el.getAttribute('data-zhp');
    const en = el.getAttribute('data-en');
    const val = isZh ? (zh || en) : (en || zh);
    if (val != null && val !== '') el.innerHTML = val;   // 缺省不覆盖
  });

  if (zhBtn && enBtn){
    zhBtn.classList.toggle('on', isZh);
    enBtn.classList.toggle('on', !isZh);
  }
  document.documentElement.lang = isZh ? 'zh-CN' : 'en';
  localStorage.setItem('lang', lang);
}

if (zhBtn && enBtn){
  zhBtn.addEventListener('click', ()=>setLang('zh'));
  enBtn.addEventListener('click', ()=>setLang('en'));
}
setLang(localStorage.getItem('lang') || 'zh');

// ---- Modal (Contact) ----
const m = document.getElementById('contact-modal');
const mOpen = document.querySelectorAll('[data-open-modal]');
const mClose = document.querySelectorAll('[data-close-modal]');
if (m){
  mOpen.forEach(b => b.addEventListener('click', () => m.classList.add('on')));
  mClose.forEach(b => b.addEventListener('click', () => m.classList.remove('on')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') m.classList.remove('on'); });
}

// ---- Form Submit（兼容 formsubmit / Formspree） ----
const form = document.getElementById('contact-form') || document.getElementById('contactForm');
if (form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // 交给 fetch 提交
    const fd  = new FormData(form);
    const url = form.getAttribute('action') || 'https://formspree.io/f/YOUR_FORM_ID';
    try{
      const res = await fetch(url, { method:'POST', body:fd, headers:{ 'Accept':'application/json' }});
      if (res.ok){
        alert(document.documentElement.lang === 'zh-CN' ? '提交成功，我们会尽快联系您。' : 'Thanks! We will contact you soon.');
        form.reset();
      }else{ throw new Error(String(res.status)); }
    }catch(err){
      alert(document.documentElement.lang === 'zh-CN'
        ? '提交失败，请稍后再试或直接发邮件到 info@jinsuifood.com'
        : 'Submit failed, please try again or email info@jinsuifood.com');
    }
  });
}

// --- Company Slider: autoplay + arrows + dots + swipe ---
(function(){
  const slider = document.getElementById('company-slider');
  if(!slider) return;

  const track = slider.querySelector('.slider-track');
  const slides = Array.from(track ? track.children : []);
  if (!track || slides.length === 0) return;

  // 兜底：关键样式（防止 CSS 未加载时不能横滑）
  const cs = getComputedStyle(track);
  if (cs.display !== 'flex') track.style.display = 'flex';
  if (cs.overflowX === 'visible') track.style.overflowX = 'auto';
  slides.forEach(img=>{
    img.style.flex = '0 0 100%';
    img.style.width = '100%';
    img.style.height = img.style.height || '100%';
    img.style.objectFit = img.style.objectFit || 'cover';
  });

  const prev = slider.querySelector('.slider-nav.prev');
  const next = slider.querySelector('.slider-nav.next');
  const dotsWrap = slider.querySelector('.slider-dots');

  let idx = 0, timer = null;

  // dots
  dotsWrap.innerHTML = '';
  slides.forEach((_, i)=>{
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', '第 '+(i+1)+' 张');
    dot.addEventListener('click', ()=>go(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots(){
    Array.from(dotsWrap.children).forEach((d,i)=>d.classList.toggle('on', i===idx));
  }
  function go(n){
    idx = (n + slides.length) % slides.length;
    const w = track.clientWidth || slider.clientWidth || window.innerWidth;
    track.scrollTo({left: idx * w, behavior: 'smooth'});
    updateDots();
  }
  function nextSlide(){ go(idx+1); }

  prev && prev.addEventListener('click', ()=>go(idx-1));
  next && next.addEventListener('click', ()=>go(idx+1));

  // 自动播放：悬停/触摸/聚焦暂停
  function start(){ stop(); timer = setInterval(nextSlide, 4000); }
  function stop(){ if(timer) clearInterval(timer), timer = null; }
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', start);

  // 触控滑动
  let sx = 0;
  track.addEventListener('touchstart', e=>{ sx = e.touches[0].clientX; stop(); }, {passive:true});
  track.addEventListener('touchend', e=>{
    const dx = e.changedTouches[0].clientX - sx;
    if(Math.abs(dx) > 40) (dx < 0 ? nextSlide() : go(idx-1));
    start();
  }, {passive:true});

  // 手动拖动/窗口变化时校准索引
  track.addEventListener('scroll', ()=>{
    if(track._t) return;
    track._t = setTimeout(()=>{
      const w = track.clientWidth || 1;
      idx = Math.round(track.scrollLeft / w);
      updateDots(); track._t = null;
    }, 100);
  });
  window.addEventListener('resize', ()=>go(idx));

  // 等图片就绪后启动
  const imgs = track.querySelectorAll('img');
  let loaded = 0;
  imgs.forEach(img=>{
    if (img.complete) { if(++loaded === imgs.length) afterLoad(); }
    else img.addEventListener('load', ()=>{ if(++loaded === imgs.length) afterLoad(); });
  });
  function afterLoad(){ updateDots(); go(0); start(); }
})();
