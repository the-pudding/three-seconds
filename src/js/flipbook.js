/* global d3 WIDTH HEIGHT */
// promise version of load image
import loadImage from './utils/load-image';

async function preload(el) {
  const $f = d3.select(el);
  const src = $f.attr('data-src');
  const frames = +$f.attr('data-frames');
  const start = 1;
  const end = frames + 1;
  const images = d3.range(start, end);

  if (!window.DEV) {
    for (const i of images) {
      await loadImage(`${src}/${i}.png`);
    }
  }

  $f.append('img').attr('src', `${src}/${start}.png`);
  $f.append('div').attr('class', 'flipbook__overlay');
  return Promise.resolve();
}

async function init() {
  const nodes = d3.selectAll('.flipbook').nodes();
  for (const n of nodes) {
    await preload(n);
  }
  return Promise.resolve();
}

function play({ id, early, loops = 1 }) {
  return new Promise(resolve => {
    const $f = d3.select(id);
    const $img = $f.select('img');
    const src = $f.attr('data-src');
    const frames = +$f.attr('data-frames');
    const rate = +$f.attr('data-rate');

    let counter = 1;
    let baseElapsed = 0;
    const end = early ? early * frames : frames;
    const timer = d3.timer(elapsed => {
      const frame = Math.max(
        1,
        Math.min(frames, Math.round(((elapsed - baseElapsed) / 1000) * rate))
      );
      $img.attr('src', `${src}/${frame}.png`);
      // loop
      if (counter < loops) {
        if (frame >= frames) {
          counter += 1;
          baseElapsed = elapsed;
        }
      } else {
        if (frame >= frames) timer.stop();
        if (frame >= end) resolve();
      }
    });
  });
}

export default { init, play };
