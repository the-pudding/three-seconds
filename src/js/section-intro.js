/* global d3 WIDTH HEIGHT */
import slide from './slide';
import animateText from './animate-text';
import pause from './pause';
import video from './flipbook';
import loadImage from './utils/load-image';
import flipbook from './flipbook';

const $section = d3.select('#intro');
// const $title = $section.select('h1');
const $p = $section.select('p');
const $lebron = d3.select('#lebron');

function toggleLebron({ visible = false, dur = 0 }) {
  const x = visible ? 0 : -$lebron.node().offsetWidth;

  return new Promise(resolve => {
    $lebron
      .transition()
      .duration(dur)
      .ease(d3.easeCubicInOut)
      .style('transform', `translate(${x}px, 0px) rotate(40deg)`)
      .on('end', resolve);
  });
}

async function run() {
  await slide({ sel: $section, state: 'enter' });
  await toggleLebron({ visible: true, dur: 400 });
  await pause(2);
  await animateText({ sel: $p, visible: true });
  await pause(4);

  // await flipbook.play('#flipbook-1');
  // await animateText({ sel: $p, visible: false });
  toggleLebron({ visible: false, dur: 500 });
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {
  toggleLebron({ visible: false });
}

function init() {}

export default { init, resize, run };
