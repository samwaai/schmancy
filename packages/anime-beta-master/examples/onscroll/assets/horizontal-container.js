import {
  utils,
  onScroll,
  createTimeline,
  animate,
} from '../../../src/anime.js';

const tl = createTimeline({
  autoplay: onScroll({
    target: 'body',
    enter: 'min+=100 top',
    leave: 'max-=100 bottom',
    sync: 1,
    debug: true,
  })
});

utils.$('.card').forEach(($card, i) => {
  tl.add($card, {
    z: [300, i * 2],
    y: [300, 0],
    rotateX: [-180, 0],
    rotateY: [utils.random(-30, 30), 0],
    rotateZ: [utils.random(-30, 30), 0],
    ease: 'inOut(1)',
  });
});

tl.init();

animate('.stack', {
  rotateY: -360,
  autoplay: onScroll({
    container: '.sticky-container',
    target: '.sticky-scroller',
    axis: 'x',
    sync: 1,
    enter: 'left+=100 left',
    leave: 'right-=100 right',
    debug: true,
  }),
})
