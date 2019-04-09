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

  for (const i of images) {
    await loadImage(`${src}/${i}.png`);
  }

  $f.append('img').attr('src', `${src}/${start}.png`);
  return Promise.resolve();
}

async function init() {
  const flipbooks = d3.selectAll('.flipbook').nodes();
  for (const f of flipbooks) {
    await preload(f);
  }
  return Promise.resolve();
}

function play(id) {
  return new Promise(resolve => {
    const $f = d3.select(id);
    const $img = $f.select('img');
    const src = $f.attr('data-src');
    const frames = +$f.attr('data-frames');
    const rate = +$f.attr('data-rate');
    const timer = d3.timer(elapsed => {
      const frame = Math.max(
        1,
        Math.min(frames, Math.round((elapsed / 1000) * rate))
      );
      $img.attr('src', `${src}/${frame}.png`);
      if (frame >= frames) {
        timer.stop();
        resolve();
      }
    });
  });
}

export default { init, play };
