/* global d3 WIDTH HEIGHT */
import slide from './slide';
import animateText from './animate-text';
import pause from './pause';

const $section = d3.select('#outro');

async function run() {
  await slide({ sel: $section, state: 'enter' });
  await slide({ sel: $section, state: 'exit' });
}

function resize() {}

function init() {}

export default { init, resize, run };
