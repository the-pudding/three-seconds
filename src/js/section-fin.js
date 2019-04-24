/* global d3 WIDTH HEIGHT FONT_SIZE SQUARE */
import slide from './slide';
import pause from './pause';

const $section = d3.select('#fin');

async function run() {
  await slide({ sel: $section, state: 'enter' });
  await pause(3);
  return true;
}

function resize() {}

function init() {}

export default { init, resize, run };
