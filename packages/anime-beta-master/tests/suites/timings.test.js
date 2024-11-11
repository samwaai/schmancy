import {
  expect,
  getChildAtIndex,
} from '../utils.js';

import {
  animate,
  utils
} from '../../src/anime.js';

suite('Timings', () => {
  test('Specified timings parameters', resolve => {
    animate('#target-id', {
      translateX: 100,
      delay: 10,
      duration: 20,
      loop: 1,
      loopDelay: 10,
      onComplete: a => {
        expect(a.currentTime).to.equal(20 + 10 + 20);
        resolve();
      },
    });
  });

  const complexTimingsParams = {
    translateX: {
      to: 50,
      delay: () => 15,
      duration: () => 10,
    },
    translateY: {
      to: 35,
      delay: 10,
      duration: 10,
    },
    translateZ: {
      to: 20,
      delay: 35,
      duration: 30,
    },
    delay: () => 10,
    duration: () => 10,
    loopDelay: 10,
    loop: 1,
    autoplay: false
  };

  test('Iteration currentTime should be negative when a delay is defined', () => {
    const animation = animate('#target-id', complexTimingsParams);
    expect(animation.currentTime).to.equal(-10);
    animation.seek(5)
    expect(animation.currentTime).to.equal(5);
    animation.seek(animation.duration)
    expect(animation.currentTime).to.equal(animation.duration);
  });

  test('Duration must be equal to the highest tween end value minus the delay', () => {
    const animation = animate('#target-id', complexTimingsParams);
    expect(animation.duration).to.equal(55 + 10 + 55);
  });

  test('IterationChangeEndTime must be equal to the highest iterationChangeEndTime of the the longest tween minus the delay', () => {
    const animation = animate('#target-id', complexTimingsParams);
    expect(animation._iterationDuration).to.equal(65 - 10);
  });

  test('Delay should delay the start of the animation', resolve => {
    const start = Date.now();
    const animation = animate('#target-id', {
      x: 100,
      delay: 100,
      duration: 100,
      ease: 'linear',
      onBegin: self => {
        self.pause();
        const current = Date.now() - start;
        expect(current).to.be.closeTo(100, 12);
        expect(utils.get('#target-id', 'x', false)).to.equal(0);
        animation.seek(50);
        expect(utils.get('#target-id', 'x', false)).to.equal(50);
        animation.seek(100);
        expect(utils.get('#target-id', 'x', false)).to.equal(100);
        resolve();
      }
    });
  });

  test('Delayed alternate looped animations should start correctly', () => {
    animate('#target-id', {
      y: -100,
      loop: 2,
      delay: 1000,
      alternate: true,
      autoplay: false,
    });
    expect(utils.get('#target-id', 'y', false)).to.equal(0);
  });

  test('Negative delay on alternate looped animations should render the value in advance', () => {
    const animation = animate('#target-id', {
      scale: [0, 1],
      ease: 'linear',
      loop: true,
      duration: 1000,
      delay: -5250,
      alternate: true,
      autoplay: false,
    });
    animation.seek(0);
    expect(utils.get('#target-id', 'scale', false)).to.equal(.75)
  });
});
