var LANG_MAP = {
  'index.html':'index-en.html','index-en.html':'index.html',
  'infrastructure.html':'infrastructure-en.html','infrastructure-en.html':'infrastructure.html',
  'integrations.html':'integrations-en.html','integrations-en.html':'integrations.html',
  'database.html':'database-en.html','database-en.html':'database.html',
  'incidents.html':'incidents-en.html','incidents-en.html':'incidents.html',
  'mlops.html':'mlops-en.html','mlops-en.html':'mlops.html',
  'articles.html':'articles-en.html','articles-en.html':'articles.html',
  'playbook.html':'playbook-en.html','playbook-en.html':'playbook.html',
  'lessons.html':'lessons-en.html','lessons-en.html':'lessons.html',
  'business.html':'business-en.html','business-en.html':'business.html'
};
function currentFile(){ return location.pathname.split('/').pop() || 'index.html'; }

// Навигация: 5 основных + «Ещё» (единый источник для всех страниц)
(function(){
  var nav = document.querySelector('nav.links'); if(!nav) return;
  var isEn = document.documentElement.lang === 'en';
  var cur = currentFile();
  var primary = isEn
    ? [['index-en.html','Home'],['business-en.html','Impact'],['incidents-en.html','Cases'],['infrastructure-en.html','Stack'],['index-en.html#contact','Contact']]
    : [['index.html','Главная'],['business.html','Эффективность'],['incidents.html','Кейсы'],['infrastructure.html','Стек'],['index.html#contact','Контакты']];
  var extra = isEn
    ? [['integrations-en.html','Integrations'],['database-en.html','Database'],['mlops-en.html','MLOps'],['articles-en.html','Articles'],['playbook-en.html','Playbook'],['lessons-en.html','Lessons']]
    : [['integrations.html','Интеграции'],['database.html','База данных'],['mlops.html','MLOps'],['articles.html','Статьи'],['playbook.html','Playbook'],['lessons.html','Уроки']];
  nav.innerHTML = '';
  primary.forEach(function(item){
    var a = document.createElement('a');
    a.href = item[0]; a.textContent = item[1];
    if (item[0] === cur) a.classList.add('active');
    nav.appendChild(a);
  });
  var det = document.createElement('details'); det.className = 'more';
  var sum = document.createElement('summary'); sum.textContent = (isEn ? 'More' : 'Ещё') + ' ▾'; det.appendChild(sum);
  var menu = document.createElement('div'); menu.className = 'more-menu';
  extra.forEach(function(item){
    var a = document.createElement('a'); a.href = item[0]; a.textContent = item[1];
    if (item[0] === cur) a.classList.add('active');
    menu.appendChild(a);
  });
  det.appendChild(menu); nav.appendChild(det);
})();

// Автоопределение языка: гео-регион по IP, затем язык браузера
(function(){
  try { if(localStorage.getItem('lang')) return; } catch(e){}
  function apply(isRu){
    try {
      var file = currentFile(); var counterpart = LANG_MAP[file];
      if(!isRu && counterpart && counterpart.indexOf('-en') !== -1){ localStorage.setItem('lang','en'); location.replace(counterpart); return; }
      localStorage.setItem('lang', isRu ? 'ru' : 'en');
    } catch(err){}
  }
  var settled = false;
  function decide(isRu){ if(settled) return; settled = true; apply(isRu); }
  try {
    fetch('https://ipwho.is/').then(function(r){ return r.json(); }).then(function(d){
      var code = (d && d.country_code) ? String(d.country_code) : ''; decide(code === 'RU');
    }).catch(function(){ fallbackToBrowserLang(); });
  } catch(e){ fallbackToBrowserLang(); }
  function fallbackToBrowserLang(){ var lang = (navigator.language || navigator.userLanguage || '').toLowerCase(); decide(lang.indexOf('ru') === 0); }
})();

// Переключатель языка: остаётся на текущей странице
(function(){
  var nav = document.querySelector('nav.links'); if(!nav) return;
  var counterpart = LANG_MAP[currentFile()]; if(!counterpart) return;
  var a = document.createElement('a'); a.href = counterpart;
  a.textContent = (document.documentElement.lang === 'en') ? 'RU' : 'EN';
  a.setAttribute('data-lang-switch','1');
  a.addEventListener('click', function(){ try { localStorage.setItem('lang', document.documentElement.lang === 'en' ? 'ru' : 'en'); } catch(e){} });
  nav.appendChild(a);
})();

// Кнопка меню (hamburger)
(function(){
  var header = document.querySelector('header.nav'); if(!header) return;
  var links = header.querySelector('nav.links'); if(!links) return;
  var btn = document.createElement('button'); btn.className = 'hamburger'; btn.setAttribute('aria-label','Меню');
  btn.innerHTML = '<span></span><span></span><span></span>';
  header.insertBefore(btn, links);
  btn.addEventListener('click', function(){ header.classList.toggle('open'); });
})();

// Переключатель темы
(function(){
  var header = document.querySelector('header.nav'); if(!header) return;
  var btn = document.createElement('button'); btn.className = 'theme-toggle'; btn.setAttribute('aria-label','Тема'); btn.textContent = '🌙';
  try { if(localStorage.getItem('theme') === 'light'){ document.documentElement.setAttribute('data-theme','light'); btn.textContent='☀️'; } } catch(e){}
  header.appendChild(btn);
  btn.addEventListener('click', function(){
    var next = (document.documentElement.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    btn.textContent = (next === 'light') ? '☀️' : '🌙';
    try { localStorage.setItem('theme', next); } catch(e){}
  });
})();

// Scroll-reveal
(function(){
  var els = document.querySelectorAll('.card, .star, .timeline .step, section h2, .hero .chips, .hero p');
  els.forEach(function(el){ el.classList.add('reveal'); });
  if(!('IntersectionObserver' in window)){ els.forEach(function(el){ el.classList.add('visible'); }); return; }
  var io = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(function(el){ io.observe(el); });
})();

// Lazy loading
(function(){
  var imgs = document.querySelectorAll('img[data-src]'); if(!imgs.length) return;
  if(!('IntersectionObserver' in window)){ imgs.forEach(function(i){ i.src = i.getAttribute('data-src'); i.classList.add('loaded'); }); return; }
  var io = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if(e.isIntersecting){ var i=e.target; i.src=i.getAttribute('data-src'); i.classList.add('loaded'); io.unobserve(i); } }); }, { rootMargin: '200px' });
  imgs.forEach(function(img){ img.classList.add('lazy'); io.observe(img); });
})();

// Год в футере
(function(){ var y = new Date().getFullYear(); document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = y; }); })();
// Интерактивные вкладки контуров (data-tab-target)
(function(){
  var btns = document.querySelectorAll('.tab-btn[data-tab-target]');
  if(!btns.length) return;
  btns.forEach(function(btn){
    btn.addEventListener('click', function(){
      var target = btn.getAttribute('data-tab-target');
      btns.forEach(function(b){ b.classList.toggle('active', b === btn); });
      document.querySelectorAll('.tab-pane').forEach(function(p){
        p.classList.toggle('active', p.id === target);
      });
    });
  });
})();
//

// Rainbow-подсветка кода (контраст как в Rainbow CSV): ключевые слова, строки, числа,
// комментарии, пути, флаги, переменные - каждый тип своим цветом.
(function(){
  var blocks = document.querySelectorAll('pre code');
  if(!blocks.length) return;
  var KEYWORDS = new Set([
    'CURL','PYTHON','PYTHON3','SUDO','KUBECTL','GIT','CD','EXPORT','DOCKER','HELM','SYSTEMCTL',
    'GREP','AWK','SED','TAR','SCP','SSH','CREATE','SELECT','INSERT','UPDATE','DELETE','FROM','WHERE',
    'AND','OR','NOT','JOIN','DISTRIBUTE','BY','SHARD','KEY','TABLE','INDEX','VALUES','DEFAULT','SET',
    'CONFIG','DOCKER-COMPOSE','BASH','SH','CHMOD','CHOWN','CP','MV','RM','MKDIR','TOUCH','CAT','ECHO',
    'PIP','UV','ARGO','ARGOCD','TERRAFORM','VAULT','K3S','K3SCTL','NPM','RESTART','ENABLE','DISABLE',
    'DAEMON-RELOAD','STATUS','LOG','LOGS','GET','APPLY','EXEC','PORT-FORWARD','RUN','PULL',
    'LIMIT','AS','CASE','WHEN','THEN','ELSE','END','DESCRIBE','JQ','PS','DF','DU','FIND','LS'
  ]);
  function esc(s){
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function tokenize(text){
    var re = new RegExp(
      '(#[^\\n]*|(?<!:)\\/\\/[^\\n]*|--[ \\t][^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)' +  // 1 комментарий
      '|("(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')' +                      // 2 строка
      '|(\\b\\d+(?:\\.\\d+)?\\b)' +                                              // 3 число
      '|(\\$\\{[^}]*\\}|\\$[A-Za-z_][A-Za-z0-9_]*|\\{\\{[^}]*\\}\\})' +          // 4 переменная
      '|(--?[A-Za-z][A-Za-z0-9-]*)' +                                            // 5 флаг
      '|((?:\\/~|\\.{1,2}\\/|\\b[a-z]:\\\\)[^\\s\'"]*|(?<=\\s)\\/[^\\s\'"]*)' +  // 6 путь
      '|(\\b[A-Za-z_][A-Za-z0-9_.-]*\\b)',                                       // 7 слово
      'g');
    var out = '', last = 0, m;
    while((m = re.exec(text))){
      out += esc(text.slice(last, m.index));
      var cls;
      if(m[1]) cls = 'tok-c';
      else if(m[2]) cls = 'tok-s';
      else if(m[3]) cls = 'tok-n';
      else if(m[4]) cls = 'tok-v';
      else if(m[5]) cls = 'tok-f';
      else if(m[6]) cls = 'tok-p';
      else if(m[7]) cls = KEYWORDS.has(m[7].toUpperCase()) ? 'tok-k' : '';
      out += cls ? ('<span class="'+cls+'">'+esc(m[0])+'</span>') : esc(m[0]);
      last = m.index + m[0].length;
    }
    out += esc(text.slice(last));
    return out;
  }
  blocks.forEach(function(code){
    if(code.getAttribute('data-rainbow')) return;
    code.innerHTML = tokenize(code.textContent);
    code.setAttribute('data-rainbow','1');
  });
})();