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
    if (val != null && val !== '') el.textContent = val; // 缺省不覆盖，避免 'undefined'
  });

  // 允许 HTML：data-zhp / data-en
  document.querySelectorAll('[data-zhp]').forEach(el=>{
    const zh = el.getAttribute('data-zhp');  // ← 用 data-zhp
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
// 兼容两种表单 id：#contact-form（旧写法）或 #contactForm（当前 HTML）
const form = document.getElementById('contact-form') || document.getElementById('contactForm');

if (form){
  form.addEventListener('submit', async (e) => {
    // 让验证码脚本负责校验；我们始终阻止原生提交并用 fetch 提交到 action 或 Formspree
    e.preventDefault();

    const fd  = new FormData(form);
    // 若 HTML 写了 action（如 formsubmit.co），优先使用；否则退回到 Formspree（请替换 YOUR_FORM_ID）
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
food.com');
    }
  });
}
