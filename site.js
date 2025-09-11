const zhBtn=document.getElementById('btn-zh');const enBtn=document.getElementById('btn-en');
function setLang(lang){document.querySelectorAll('[data-zh]').forEach(e=>e.textContent=lang==='zh'?e.dataset.zh:e.dataset.en);
document.querySelectorAll('[data-zhp]').forEach(e=>e.innerHTML=lang==='zh'?e.dataset.zh:e.dataset.en);
zhBtn.classList.toggle('on',lang==='zh');enBtn.classList.toggle('on',lang!=='zh');document.documentElement.lang=lang==='zh'?'zh-CN':'en';localStorage.setItem('lang',lang)}
zhBtn.addEventListener('click',()=>setLang('zh'));enBtn.addEventListener('click',()=>setLang('en'));setLang(localStorage.getItem('lang')||'zh');
const m=document.getElementById('contact-modal'); const mOpen=document.querySelectorAll('[data-open-modal]'); const mClose=document.querySelectorAll('[data-close-modal]');
mOpen.forEach(b=>b.addEventListener('click',()=>m.classList.add('on'))); mClose.forEach(b=>b.addEventListener('click',()=>m.classList.remove('on')));
const form=document.getElementById('contact-form');
form.addEventListener('submit', async (e)=>{e.preventDefault();const fd = new FormData(form);const url = 'https://formspree.io/f/YOUR_FORM_ID';const res = await fetch(url,{method:'POST',body:fd,headers:{'Accept':'application/json'}}).catch(()=>null);if(res && res.ok){alert(document.documentElement.lang==='zh-CN'?'提交成功，我们会尽快联系您。':'Thanks! We will contact you soon.');form.reset();}else{alert(document.documentElement.lang==='zh-CN'?'提交失败，请稍后再试或直接发邮件到 info@jinsuifood.com':'Submit failed, please try again or email info@jinsuifood.com');}});