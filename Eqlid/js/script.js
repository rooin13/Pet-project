let tabBtn = document.querySelectorAll('.tab-nav__btn');
let tabItem = document.querySelectorAll('.tab-item');
tabBtn.forEach(function (element) {
  element.addEventListener('click', function (e) {
    const path = e.currentTarget.dataset.path;

    tabBtn.forEach(function (btn) { btn.classList.remove('tab-nav__btn--active') });
    e.currentTarget.classList.add('tab-nav__btn--active');

    tabItem.forEach(function (element) { element.classList.remove('tab-item--active') });
    document.querySelector(`[data-target="${path}"]`).classList.add('tab-item--active');
  });
});

document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("burger").addEventListener("click", function(){
    document.querySelector("header").classList.toggle("open")

  })
})

const swiper = new Swiper('.swiper-container', {
  // Optional parameters
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  
  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
  a11y: {
    paginationBulletMessage: 'Тут название слайда {{index}}',
  }
});

document.addEventListener('DOMContentLoaded', (e)=>{
  document.getElementById("open-search-form").addEventListener('click', (e) =>{
    document.getElementById('search-form').classList.add('search-form-show')  
  })
})

document.addEventListener('DOMContentLoaded', (e)=>{
  document.getElementById("search-form-close").addEventListener('click', (e) =>{
    document.getElementById('search-form').classList.remove('search-form-show')
  })
})