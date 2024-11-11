import {
  animate,
  createTimer,
  utils,
  stagger,
} from '../../src/anime.js';

const [$jsClock] = utils.$('#js-clock');
const [$animeClock] = utils.$('#anime-clock');
const [$driftClock] = utils.$('#drift-clock');
const [$jsLoops] = utils.$('#js-loops');
const [$animeLoops] = utils.$('#anime-loops');

let jsLoops = 0;
let animeLoops = 0;

const timer = createTimer({
  duration: 1000,
  loop: true,
  onLoop: () => {
    $animeLoops.innerHTML = ++animeLoops;
  }
})

const startTime = Date.now();

setInterval(() => {
  const elapsed = Date.now() - startTime;
  $jsClock.innerHTML = elapsed + 'ms';
  $animeClock.innerHTML = timer.currentTime + 'ms';
  $driftClock.innerHTML = (timer.currentTime - elapsed) + 'ms';
  $jsLoops.innerHTML = ++jsLoops;
}, 1000);
