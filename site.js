// ---- Language Switch ----
const zhBtn = document.getElementById('btn-zh');
const enBtn = document.getElementById('btn-en');

function setLang(lang){
  document.querySelectorAll('[data-zh]')
    .forEach(e => e.textContent = (lang === 'zh' ? e.dataset.zh : e.dataset.en));
  document.querySelectorAll('[data-zhp]')
    .forEach(e => e.innerHTML = (lang === 'zh' ? e.dataset.zh : e.dataset.en));

  if (zhBtn && enBtn){
    zhBtn.classList.toggle('on', lang === 'zh');
    enBtn.classList.toggle('on', lang !== 'zh');
  }
  document.documentElement.lang = (lang === 'zh' ? 'zh-CN' : 'en');
  localStorage.setItem('lang', lang);
}

if (zhBtn && enBtn){
  zhBtn.addEventListener('click', () => setLang('zh'));
  enBtn.addEventListener('click', () => setLang('en'));
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

// ---- Form Submit (兼容 formsubmit / Formspree) ----
// 兼容两种表单 id：#contact-form（你原 js 的写法）或 #contactForm（当前 HTML 的写法）
const form = document.getElementById('contact-form') || document.getElementById('contactForm');

if (form){
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd  = new FormData(form);
    // 若 HTML 上写了 action（如 formsubmit.co），则优先用；否则退回到 Formspree（请替换 YOUR_FORM_ID）
    const url = form.getAttribute('action') || 'https://formspree.io/f/YOUR_FORM_ID';

    try{
      const res = await fetch(url, {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok){
        alert(document.documentElement.lang === 'zh-CN'
          ? '提交成功，我们会尽快联系您。'
          : 'Thanks! We will contact you soon.');
        form.reset();
      }else{
        throw new Error(String(res.status));
      }
    }catch(err){
      alert(document.documentElement.lang === 'zh-CN'
        ? '提交失败，请稍后再试或直接发邮件到 info@jinsuifood.com'
        : 'Submit failed, please try again or email info@jinsuifood.com');
    }
  });
}
