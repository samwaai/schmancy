import {
  utils,
  onScroll,
  createTimeline,
  animate,
} from '../../../src/anime.js';

animate('#edges .target', {
  rotate: 360,
  autoplay: onScroll({
    container: '#edges .container',
    enter: 'top bottom',
    leave: 'bottom top',
    sync: 1,
    debug: true
  })
})

animate('#edges-inverted .target', {
  rotate: 360,
  autoplay: onScroll({
    container: '#edges-inverted .container',
    enter: 'bottom top',
    leave: 'top bottom',
    sync: 1,
    debug: true
  })
})

animate('#offsets .target', {
  rotate: 360,
  autoplay: onScroll({
    container: '#offsets .container',
    enter: 'top+=20 bottom-=100',
    leave: 'bottom-=20 top+=100',
    sync: 1,
    debug: true
  })
})

animate('#hori-edges .target', {
  rotate: 360,
  autoplay: onScroll({
    container: '#hori-edges .container',
    axis: 'x',
    enter: 'top bottom',
    leave: 'bottom top',
    sync: 1,
    debug: true
  })
})

animate('#hori-edges-inverted .target', {
  rotate: 360,
  autoplay: onScroll({
    container: '#hori-edges-inverted .container',
    axis: 'x',
    enter: 'bottom top',
    leave: 'top bottom',
    sync: 1,
    debug: true
  })
})

animate('#hori-offsets .target', {
  rotate: 360,
  autoplay: onScroll({
    container: '#hori-offsets .container',
    axis: 'x',
    enter: 'left+=20 right-=120',
    leave: 'right-=20 left+=120',
    sync: 1,
    debug: true
  })
})
