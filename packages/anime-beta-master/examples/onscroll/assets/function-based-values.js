import {
  utils,
  animate,
  onScroll,
  stagger,
} from '../../../src/anime.js';

const isLandscapeMedia = matchMedia('(orientation: landscape)');

utils.$('.section').forEach($section => {
  animate($section.querySelectorAll('.card'), {
    rotate: [stagger(utils.random(-1, 1, 2)), stagger(15)],
    transformOrigin: ['75% 75%', '75% 75%'],
    ease: 'inOut(2)',
    autoplay: onScroll({
      axis: () => isLandscapeMedia.matches ? 'x' : 'y',
      enter: () => isLandscapeMedia.matches ? 'start+=25vw max-=25vw' : 'start max',
      leave: () => isLandscapeMedia.matches ? 'end-=25vw min+=25vw' : 'end min',
      sync: .5,
      debug: true,
    }),
  });
});
