/* global d3 */
import animateText from './animate-text';
import pause from './pause';

const $section = d3.select('#refresher');
const $title = $section.select('h1');
const $p = $section.select('p');

async function run() {
  $section.classed('is-hidden', false);
  await animateText({ sel: $p, visible: true });
  await pause(5);
  await animateText({ sel: $p, visible: false });
  $section.classed('is-hidden', true);
  return true;
}

function resize({ width, height }) {}

function init() {}

export default { init, resize, run };
