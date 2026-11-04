var LANG_MAP = {
  'index.html':'index-en.html','index-en.html':'index.html',
  'infrastructure.html':'infrastructure-en.html','infrastructure-en.html':'infrastructure.html',
  'integrations.html':'integrations-en.html','integrations-en.html':'integrations.html',
  'database.html':'database-en.html','database-en.html':'database.html',
  'incidents.html':'incidents-en.html','incidents-en.html':'incidents.html',
  'mlops.html':'mlops-en.html','mlops-en.html':'mlops.html',
  'articles.html':'articles-en.html','articles-en.html':'articles.html',
  'playbook.html':'playbook-en.html','playbook-en.html':'playbook.html',
  'lessons.html':'lessons-en.html','lessons-en.html':'lessons.html'
};
function currentFile(){ return location.pathname.split('/').pop() || 'index.html'; }

// Активный пункт меню
(function(){
  var cur = currentFile();
  document.querySelectorAll('nav.links a').forEach(function(a){
    if (a.getAttribute('href') === cur) a.classList.add('active');
  });
})();

// Автоопределение языка (один раз, запоминается)
(function(){
  try {
    if(localStorage.getItem('lang')) return;
    var lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    var isRu = lang.indexOf('ru') === 0;
    var file = currentFile();
    var counterpart = LANG_MAP[file];
    if(!isRu && counterpart && counterpart.indexOf('-en') !== -1){
      localStorage.setItem('lang','en');
      location.replace(counterpart);
      return;
    }
    localStorage.setItem('lang', isRu ? 'ru' : 'en');
  } catch(e){}
})();

// Переключатель языка: остаётся на текущей странице
(function(){
  var nav = document.querySelector('nav.links'); if(!nav) return;
  var counterpart = LANG_MAP[currentFile()]; if(!counterpart) return;
  var a = document.createElement('a');
  a.href = counterpart;
  a.textContent = (document.documentElement.lang === 'en') ? 'RU' : 'EN';
  a.setAttribute('data-lang-switch','1');
  a.addEventListener('click', function(){
    try { localStorage.setItem('lang', document.documentElement.lang === 'en' ? 'ru' : 'en'); } catch(e){}
  });
  nav.appendChild(a);
})();

// Кнопка меню (hamburger)
(function(){
  var header = document.querySelector('header.nav'); if(!header) return;
  var links = header.querySelector('nav.links'); if(!links) return;
  var btn = document.createElement('button');
  btn.className = 'hamburger'; btn.setAttribute('aria-label','Меню');
  btn.innerHTML = '<span></span><span></span><span></span>';
  header.insertBefore(btn, links);
  btn.addEventListener('click', function(){ header.classList.toggle('open'); });
})();

// Переключатель темы
(function(){
  var header = document.querySelector('header.nav'); if(!header) return;
  var btn = document.createElement('button');
  btn.className = 'theme-toggle'; btn.setAttribute('aria-label','Тема');
  btn.textContent = '🌙';
  try { if(localStorage.getItem('theme') === 'light'){ document.documentElement.setAttribute('data-theme','light'); btn.textContent='☀️'; } } catch(e){}
  header.appendChild(btn);
  btn.addEventListener('click', function(){
    var next = (document.documentElement.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    btn.textContent = (next === 'light') ? '☀️' : '🌙';
    try { localStorage.setItem('theme', next); } catch(e){}
  });
})();

// Scroll-reveal анимация
(function(){
  var els = document.querySelectorAll('.card, .star, .timeline .step, section h2, .hero .chips, .hero p');
  els.forEach(function(el){ el.classList.add('reveal'); });
  if(!('IntersectionObserver' in window)){ els.forEach(function(el){ el.classList.add('visible'); }); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(function(el){ io.observe(el); });
})();

// Lazy loading изображений
(function(){
  var imgs = document.querySelectorAll('img[data-src]');
  if(!imgs.length) return;
  if(!('IntersectionObserver' in window)){ imgs.forEach(function(i){ i.src = i.getAttribute('data-src'); i.classList.add('loaded'); }); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ var i=e.target; i.src=i.getAttribute('data-src'); i.classList.add('loaded'); io.unobserve(i); } });
  }, { rootMargin: '200px' });
  imgs.forEach(function(img){ img.classList.add('lazy'); io.observe(img); });
})();

// Год в футере
(function(){
  var y = new Date().getFullYear();
  document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = y; });
})();