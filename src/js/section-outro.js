/* global d3 WIDTH HEIGHT FONT_SIZE */
import slide from './slide';
import animateText from './animate-text';
import pause from './pause';

const $section = d3.select('#outro');
const $p = $section.select('p');

async function run() {
  await slide({ sel: $section, state: 'enter' });
  await animateText({ sel: $p, visible: true });
  await pause(5);
  await slide({ sel: $section, state: 'exit' });
}

function resize() {}

function init() {}

export default { init, resize, run };
