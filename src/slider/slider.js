import Swiper from 'swiper'

var mySwiper = new Swiper ('.swiper-1', {
  direction: "horizontal",
  loop: true,

  pagination: {
    el: '.swiper-pag-1',
    clickable : true,
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-next-1',
    prevEl: '.swiper-prev-1',
  },
})