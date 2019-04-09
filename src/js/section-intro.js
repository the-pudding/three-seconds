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

async function run() {
  await slide({ sel: $section, state: 'enter' });
  await animateText({ sel: $p, visible: true });
  await pause(1);
  await flipbook.play('#flipbook-1');
  await animateText({ sel: $p, visible: false });
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {}

function init() {}

export default { init, resize, run };
