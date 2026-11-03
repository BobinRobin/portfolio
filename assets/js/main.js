// Активный пункт меню
document.querySelectorAll('nav.links a').forEach(function(a){
  if (a.getAttribute('href') === location.pathname.split('/').pop()) a.classList.add('active');
});
// Год в футере
var y = new Date().getFullYear();
document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = y; });