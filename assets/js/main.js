// Активный пункт меню
document.querySelectorAll('nav.links a').forEach(function(a){
  if (a.getAttribute('href') === location.pathname.split('/').pop()) a.classList.add('active');
});
// Переключатель языка EN/RU (добавляется автоматически)
(function(){
  var nav = document.querySelector('nav.links');
  if (!nav) return;
  var isEn = document.documentElement.lang === 'en';
  var a = document.createElement('a');
  a.href = isEn ? 'index.html' : 'index-en.html';
  a.textContent = isEn ? 'RU' : 'EN';
  nav.appendChild(a);
})();
// Год в футере
var y = new Date().getFullYear();
document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = y; });