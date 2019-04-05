/* global d3 */
import animateText from './animate-text';
import pause from './pause';

const $section = d3.select('#report');
const $p = $section.select('p');
const $figure = $section.select('figure');

async function run() {
  $section.classed('is-hidden', false);
  await animateText({ sel: $p, visible: true });
  await pause(10);
  $section.classed('is-hidden', true);
  return true;
}

function resize({ width, height }) {}

function init() {
  const data = d3.range(138);
  $figure
    .selectAll('img')
    .data(data)
    .join('img')
    .attr('src', d => `assets/images/report/${d}.png`);
}

export default { init, resize, run };
