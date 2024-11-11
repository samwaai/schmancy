import {
  createTimeline,
  stagger,
  utils,
  engine,
} from '../../lib/anime.esm.js';

const [$animProgress] = utils.$('#animation-progress');
const [$animationCurrentTime] = utils.$('#animation-currentTime');

const [$engineFramerate] = utils.$('#engine-frameRate');
const [$engineFPS] = utils.$('#engine-fps');

const [$enginePlaybackrate] = utils.$('#engine-playbackRate');
const [engineSpeedEl] = utils.$('#engine-speed');

const [$animFramerate] = utils.$('#animation-frameRate');
const [$animationFPS] = utils.$('#animation-fps');

const [$animPlaybackrate] = utils.$('#animation-playbackRate');
const [$animSpeed] = utils.$('#animation-speed');

const [$animTimeDrift] = utils.$('#animation-time-drift');

const animation = createTimeline({
  loop: true,
  onUpdate: (self) => {
    /** @type {HTMLInputElement} */
    ($animProgress).value = `${self._iterationTime / self._iterationDuration}`;
    /** @type {HTMLInputElement} */
    ($animationCurrentTime).value = `${self.currentTime}`;
  },
})
.add('.square', {
  translateY: [{ to: '-10rem', duration: 300 }, { to: '0rem', ease: 'inOut', duration: 700 }],
  scaleX: [{ to: .8 }, { to: 1, ease: 'inOut' }],
  scaleY: [{ to: 2, duration: 500}, { to: 1, ease: 'inOut', duration: 350 }],
  delay: stagger(100),
});

const startTime = Date.now();

$engineFramerate.oninput = () => {
  engine.frameRate = +/** @type {HTMLInputElement} */($engineFramerate).value;
  /** @type {HTMLInputElement} */
  ($engineFPS).value = `${engine.frameRate}`;
}

$enginePlaybackrate.oninput = () => {
  engine.playbackRate = +/** @type {HTMLInputElement} */($enginePlaybackrate).value;
  /** @type {HTMLInputElement} */
  (engineSpeedEl).value = `${engine.playbackRate}`;
}

$animFramerate.oninput = () => {
  animation.frameRate = +/** @type {HTMLInputElement} */($animFramerate).value;
  /** @type {HTMLInputElement} */
  ($animationFPS).value = `${animation.frameRate}`;
}

$animPlaybackrate.oninput = () => {
  animation.playbackRate = +/** @type {HTMLInputElement} */($animPlaybackrate).value;
  /** @type {HTMLInputElement} */
  ($animSpeed).value = `${animation.playbackRate}`;
}

setInterval(() => {
  const elapsed = Date.now() - startTime;
  /** @type {HTMLInputElement} */
  ($animTimeDrift).value = (animation.currentTime - elapsed) + 'ms';
}, 1000);
