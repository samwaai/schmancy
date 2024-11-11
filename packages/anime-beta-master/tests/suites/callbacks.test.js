import {
  expect,
} from '../utils.js';


import { animate, createTimeline, utils } from '../../src/anime.js';

function setupAnimationCallBack(callbackName, callbackFunc) {
  const parameters = {
    translateX: 100,
    autoplay: false,
    delay: 10,
    duration: 80,
  }
  parameters[callbackName] = callbackFunc;
  return parameters;
}

suite('Callbacks', () => {
  test('onBegin() on animation', () => {
    let callbackCheck = false;
    const animation = animate('#target-id', setupAnimationCallBack('onBegin', () => { callbackCheck = true; }));

    expect(callbackCheck).to.equal(false);
    expect(animation.began).to.equal(false);
    animation.seek(50);
    expect(animation.began).to.equal(true);
    expect(callbackCheck).to.equal(true);
    animation.seek(0);
    expect(animation.began).to.equal(true);
    expect(callbackCheck).to.equal(true);
  });

  test('onBegin() on reversed and looped animation', () => {
    let callbackCheck = false;
    const params = setupAnimationCallBack('onBegin', () => { callbackCheck = true; });
    params.direction = -1;
    params.loop = 2;
    const animation = animate('#target-id', params);

    expect(callbackCheck).to.equal(false);
    expect(animation.began).to.equal(false);
    animation.seek(150);
    expect(animation.began).to.equal(true);
    expect(callbackCheck).to.equal(true);
    animation.seek(0);
    expect(animation.began).to.equal(true);
    expect(callbackCheck).to.equal(true);
  });

  test('onBegin() on timeline', () => {
    let tlCallbackCheck = false;
    let tlAnim1CallbackCheck = false;
    let tlAnim2CallbackCheck = false;

    const tl = createTimeline(setupAnimationCallBack('onBegin', () => { tlCallbackCheck = true; }));
    tl.add('#target-id', setupAnimationCallBack('onBegin', () => { tlAnim1CallbackCheck = true; }))
    tl.add('#target-id', setupAnimationCallBack('onBegin', () => { tlAnim2CallbackCheck = true; }))

    expect(tlCallbackCheck).to.equal(false);
    expect(tlAnim1CallbackCheck).to.equal(false);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(50);
    expect(tlCallbackCheck).to.equal(true);
    expect(tlAnim1CallbackCheck).to.equal(true);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(150);
    expect(tlCallbackCheck).to.equal(true);
    expect(tlAnim1CallbackCheck).to.equal(true);
    expect(tlAnim2CallbackCheck).to.equal(true);
    tl.seek(0);
    expect(tlCallbackCheck).to.equal(true);
    expect(tlAnim1CallbackCheck).to.equal(true);
    expect(tlAnim2CallbackCheck).to.equal(true);
  });

  test('onComplete() on animation', () => {
    let callbackCheck = false;
    const animation = animate('#target-id', setupAnimationCallBack('onComplete', () => { callbackCheck = true; }));
    expect(callbackCheck).to.equal(false);
    animation.seek(50);
    expect(callbackCheck).to.equal(false);
    animation.seek(0);
    expect(callbackCheck).to.equal(false);
    animation.seek(100);
    expect(callbackCheck).to.equal(true);
  });

  test('onComplete() on reversed and looped animation', () => {
    let callbackCheck = false;
    const params = setupAnimationCallBack('onComplete', () => { callbackCheck = true; });
    params.direction = -1;
    params.loop = 2;
    const animation = animate('#target-id', params);
    expect(callbackCheck).to.equal(false);
    animation.seek(150);
    expect(callbackCheck).to.equal(false);
    animation.seek(0);
    expect(callbackCheck).to.equal(false);
    animation.seek(300);
    expect(callbackCheck).to.equal(true);
  });

  test('onComplete() on timeline', () => {
    let tlCallbackCheck = false;
    let tlAnim1CallbackCheck = false;
    let tlAnim2CallbackCheck = false;

    const tl = createTimeline(setupAnimationCallBack('onComplete', () => { tlCallbackCheck = true; }))
    .add('#target-id', setupAnimationCallBack('onComplete', () => { tlAnim1CallbackCheck = true; }))
    .add('#target-id', setupAnimationCallBack('onComplete', () => { tlAnim2CallbackCheck = true; }))

    expect(tlCallbackCheck).to.equal(false);
    expect(tlAnim1CallbackCheck).to.equal(false);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(50);
    expect(tlCallbackCheck).to.equal(false);
    expect(tlAnim1CallbackCheck).to.equal(false);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(150);
    expect(tlCallbackCheck).to.equal(false);
    expect(tlAnim1CallbackCheck).to.equal(true);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(0);
    expect(tlCallbackCheck).to.equal(false);
    expect(tlAnim1CallbackCheck).to.equal(true);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(200);
    expect(tlCallbackCheck).to.equal(true);
    expect(tlAnim1CallbackCheck).to.equal(true);
    expect(tlAnim2CallbackCheck).to.equal(true);
  });

  test('onUpdate() on animation', () => {
    let callbackCheck = false;
    let ticks = 0;

    const animation = animate('#target-id', setupAnimationCallBack('onUpdate', () => { ticks++; callbackCheck = true; }));

    expect(callbackCheck).to.equal(false);
    animation.seek(5);
    expect(ticks).to.equal(1);
    expect(callbackCheck).to.equal(true);
    animation.seek(9); // delay: 10
    expect(ticks).to.equal(2);
    expect(callbackCheck).to.equal(true);
    animation.seek(10); // delay: 10
    expect(callbackCheck).to.equal(true);
    expect(ticks).to.equal(3);
    animation.seek(15);
    expect(ticks).to.equal(4);
  });

  test('onUpdate() on timeline', () => {
    let tlCallbackCheck = false;
    let tlAnim1CallbackCheck = false;
    let tlAnim2CallbackCheck = false;
    let ticks = 0;

    const tl = createTimeline(setupAnimationCallBack('onUpdate', () => { ticks++; tlCallbackCheck = true; }))
    .add('#target-id', setupAnimationCallBack('onUpdate', () => { ticks++; tlAnim1CallbackCheck = true; }))
    .add('#target-id', setupAnimationCallBack('onUpdate', () => { ticks++; tlAnim2CallbackCheck = true; }))

    expect(tlCallbackCheck).to.equal(false);
    expect(tlAnim1CallbackCheck).to.equal(false);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(5);
    expect(ticks).to.equal(1);
    expect(tlCallbackCheck).to.equal(true);
    expect(tlAnim1CallbackCheck).to.equal(false);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(9); // delay: 10
    expect(ticks).to.equal(2);
    expect(tlCallbackCheck).to.equal(true);
    expect(tlAnim1CallbackCheck).to.equal(false);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(10); // delay: 10
    expect(ticks).to.equal(3);
    expect(tlCallbackCheck).to.equal(true);
    expect(tlAnim1CallbackCheck).to.equal(false);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(11); // delay: 10
    expect(ticks).to.equal(5);
    expect(tlCallbackCheck).to.equal(true);
    expect(tlAnim1CallbackCheck).to.equal(true);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(150);
    expect(ticks).to.equal(8);
    expect(tlCallbackCheck).to.equal(true);
    expect(tlAnim1CallbackCheck).to.equal(true);
    expect(tlAnim2CallbackCheck).to.equal(true);
    tl.seek(250);
    expect(ticks).to.equal(10);
    expect(tlCallbackCheck).to.equal(true);
    expect(tlAnim1CallbackCheck).to.equal(true);
    expect(tlAnim2CallbackCheck).to.equal(true);
  });

  test('onRender() on animation', () => {
    let callbackCheck = false;
    let renders = 0;

    const animation = animate('#target-id', setupAnimationCallBack('onRender', () => { renders++; callbackCheck = true; }));

    expect(callbackCheck).to.equal(false);
    animation.seek(5);
    expect(renders).to.equal(1);
    expect(callbackCheck).to.equal(true);
    animation.seek(9); // delay: 10
    expect(renders).to.equal(2);
    expect(callbackCheck).to.equal(true);
    animation.seek(10); // delay: 10
    expect(renders).to.equal(3);
    expect(callbackCheck).to.equal(true);
    animation.seek(15);
    expect(callbackCheck).to.equal(true);
    expect(renders).to.equal(4);
  });

  test('onRender() on timeline', () => {
    let tlCallbackCheck = false;
    let tlAnim1CallbackCheck = false;
    let tlAnim2CallbackCheck = false;

    const tl = createTimeline(setupAnimationCallBack('onRender', () => { tlCallbackCheck = true; }))
    .add('#target-id', setupAnimationCallBack('onRender', () => { tlAnim1CallbackCheck = true; }))
    .add('#target-id', setupAnimationCallBack('onRender', () => { tlAnim2CallbackCheck = true; }))

    expect(tlCallbackCheck).to.equal(false);
    expect(tlAnim1CallbackCheck).to.equal(false);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(5);
    expect(tlCallbackCheck).to.equal(false);
    expect(tlAnim1CallbackCheck).to.equal(false);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(9); // delay: 10
    expect(tlCallbackCheck).to.equal(false);
    expect(tlAnim1CallbackCheck).to.equal(false);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(10); // delay: 10
    expect(tlCallbackCheck).to.equal(false);
    expect(tlAnim1CallbackCheck).to.equal(false);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(50);
    expect(tlCallbackCheck).to.equal(true);
    expect(tlAnim1CallbackCheck).to.equal(true);
    expect(tlAnim2CallbackCheck).to.equal(false);
    tl.seek(150);
    expect(tlCallbackCheck).to.equal(true);
    expect(tlAnim1CallbackCheck).to.equal(true);
    expect(tlAnim2CallbackCheck).to.equal(true);
  });

  test('onLoop() on animation', () => {
    let loops = 0;

    const animation = animate('#target-id', {
      x: 100,
      duration: 80,
      loop: 2,
      loopDelay: 20,
      autoplay: false,
      onLoop: () => loops++,
    });

    animation.seek(5);
    expect(loops).to.equal(0);
    animation.seek(80);
    expect(loops).to.equal(0);
    animation.seek(100);
    expect(loops).to.equal(1);
    animation.seek(180);
    expect(loops).to.equal(1);
    animation.seek(200);
    expect(loops).to.equal(2);
    animation.seek(280);
    expect(loops).to.equal(2);
  });

  test('onLoop() on timeline', () => {
    let loops = 0;

    const animation = createTimeline({
      loop: 1,
      loopDelay: 20,
      autoplay: false,
      onLoop: () => {loops++},
    })
    .add('#target-id', {
      x: 100,
      duration: 80,
      loop: 1,
      loopDelay: 20,
      onLoop: () => {loops++},
    });

    animation.seek(5);
    expect(loops).to.equal(0);
    animation.seek(100);
    expect(loops).to.equal(1);
    animation.seek(180);
    expect(loops).to.equal(1);
    animation.seek(200);
    expect(loops).to.equal(2);
    animation.seek(300);
    expect(loops).to.equal(3);
    animation.seek(380);
    expect(loops).to.equal(3);
    animation.seek(400);
    expect(loops).to.equal(3);
    animation.seek(401);
    expect(loops).to.equal(3);
  });

  test('then() on animation', resolve => {
    animate('#target-id', {
      y: 100,
      duration: 30,
    })
    .then(anim => {
      expect(anim.currentTime).to.equal(30);
      resolve();
    });
  });

  test('then() on timeline', resolve => {
    createTimeline()
    .add('#target-id', {
      x: 100,
      duration: 15,
    })
    .add('#target-id', {
      y: 100,
      duration: 15,
    })
    .then(tl => {
      expect(tl.currentTime).to.equal(30);
      resolve();
    });
  });

  test('onBegin(), onUpdate(), onRender(), onComplete() should trigger on 0 duration animation', resolve => {
    let onBeginCheck = false;
    let onUpdateCheck = false;
    let onRenderCheck = false;
    let onCompleteCheck = false;
    let onLoopCheck = false;

    animate('#target-id', {
      translateX: 100,
      duration: 0,
      onBegin: () => { onBeginCheck = true; },
      onUpdate: () => { onUpdateCheck = true; },
      onRender: () => { onRenderCheck = true; },
      onLoop: () => { onLoopCheck = true; },
      onComplete: () => { onCompleteCheck = true; },
    })
    .then(anim => {
      expect(onBeginCheck).to.equal(true);
      expect(onUpdateCheck).to.equal(true);
      expect(onRenderCheck).to.equal(true);
      expect(onLoopCheck).to.equal(false);
      expect(onCompleteCheck).to.equal(true);
      expect(anim.began).to.equal(true);
      expect(anim.completed).to.equal(true);
      resolve();
    })
  });

  test('onBegin(), onUpdate(), onRender(), onComplete() should trigger on 0 duration timeline', resolve => {
    let onBeginCheck = false;
    let onUpdateCheck = false;
    let onRenderCheck = false;
    let onCompleteCheck = false;
    let onLoopCheck = false;

    let a1onBeginCheck = false;
    let a1onUpdateCheck = false;
    let a1onRenderCheck = false;
    let a1onCompleteCheck = false;
    let a1onLoopCheck = false;

    let a2onBeginCheck = false;
    let a2onUpdateCheck = false;
    let a2onRenderCheck = false;
    let a2onCompleteCheck = false;
    let a2onLoopCheck = false;

    createTimeline({
      defaults: { duration: 0 },
      id: 'TL',
      onBegin: () => { onBeginCheck = true; },
      onUpdate: () => { onUpdateCheck = true; },
      onRender: () => { onRenderCheck = true; },
      onLoop: () => { onLoopCheck = true; },
      onComplete: () => { onCompleteCheck = true; },
    })
    .add('#target-id', {
      translateX: 100,
      id: 'A1',
      onBegin: () => { a1onBeginCheck = true; },
      onUpdate: () => { a1onUpdateCheck = true; },
      onRender: () => { a1onRenderCheck = true; },
      onLoop: () => { a1onLoopCheck = true; },
      onComplete: () => { a1onCompleteCheck = true; },
    })
    .add('#target-id', {
      translateY: 100,
      id: 'A2',
      onBegin: () => { a2onBeginCheck = true; },
      onUpdate: () => { a2onUpdateCheck = true; },
      onRender: () => { a2onRenderCheck = true; },
      onLoop: () => { a2onLoopCheck = true; },
      onComplete: () => { a2onCompleteCheck = true; },
    })
    .then(tl => {
      expect(onBeginCheck).to.equal(true);
      expect(onUpdateCheck).to.equal(true);
      expect(onRenderCheck).to.equal(true);
      expect(onLoopCheck).to.equal(false);
      expect(onCompleteCheck).to.equal(true);
      expect(tl.began).to.equal(true);
      expect(tl.completed).to.equal(true);

      expect(a1onBeginCheck).to.equal(true);
      expect(a1onUpdateCheck).to.equal(true);
      expect(a1onRenderCheck).to.equal(true);
      expect(a1onLoopCheck).to.equal(false);
      expect(a1onCompleteCheck).to.equal(true);

      expect(a2onBeginCheck).to.equal(true);
      expect(a2onUpdateCheck).to.equal(true);
      expect(a2onRenderCheck).to.equal(true);
      expect(a2onLoopCheck).to.equal(false);
      expect(a2onCompleteCheck).to.equal(true);
      resolve()
    })

  });

});
