import {
  createAnimatable,
  utils,
  stagger,
  animate,
} from '../../lib/anime.esm.js';

const [ $container ] = utils.$('.container');
const grid = [10, 10];
const from = 'center';

const heartParticles = [
  0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
  0.0, 0.6, 1.0, 0.6, 0.0, 0.0, 0.6, 1.0, 0.6, 0.0,
  0.6, 1.0, 1.0, 1.0, 0.6, 0.6, 1.0, 1.0, 1.0, 0.6,
  0.8, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.8,
  1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
  0.8, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.8,
  0.0, 0.8, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.8, 0.0,
  0.0, 0.0, 0.8, 1.0, 1.0, 1.0, 1.0, 0.8, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.8, 1.0, 1.0, 0.8, 0.0, 0.0, 0.0,
  0.0, 0.0, 0.0, 0.0, 0.6, 0.6, 0.0, 0.0, 0.0, 0.0,
]

heartParticles.forEach(p => {
  const $dot = document.createElement('div');
  $container.appendChild($dot);
  utils.set($dot, { scale: p ? p : .3 });
});

const $particles = utils.$('.container div');

utils.set($particles, {
  opacity: stagger([1, .1], { grid, from }),
  background: stagger([80, 20], { grid, from,
    modifier: v => `hsl(4, 70%, ${v}%)`,
  }),
  boxShadow: stagger([4, 1], { grid, from,
    modifier: v => `0px 0px ${utils.round(v, 0)}em 0px var(--red)`,
  }),
});

const reveal = animate($particles, {
  x: { from: () => utils.random(-200, 200) },
  y: { from: () => utils.random(-200, 200) },
  scale: [1, .2],
  opacity: [0, 1],
  delay: stagger(100, { ease: 'out(3)'}),
  duration: 1250,
  composition: 'blend',
})

const pulse = animate($particles, {
  x: stagger(2, { grid, from, axis: 'x', }),
  scale: { from: stagger(.2, { grid, from })},
  delay: stagger(100, { grid, from, ease: 'outQuad' }),
  loop: true,
  alternate: true,
  duration: 500,
  ease: 'inOutQuad',
  composition: 'blend',
})

// utils.set($container, {
//   transformOrigin: '0em 0em',
// })

// animate($container, {
//   scale: [1, 1.5],
//   ease: 'in(4)',
//   duration: reveal.duration
// })
