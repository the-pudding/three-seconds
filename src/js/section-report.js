/* global d3 WIDTH HEIGHT */
import slide from './slide';
import animateText from './animate-text';
import pause from './pause';

const $section = d3.select('#report');
const $p = $section.select('p');
const $figure = $section.select('figure');

async function run() {
  await slide({ sel: $section, state: 'enter' });
  await animateText({ sel: $p, visible: true });
  await pause(10);
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {}

function init() {
  const data = d3.range(138);
  $figure
    .selectAll('img')
    .data(data)
    .join('img')
    .attr('src', d => `assets/images/report/${d}.png`);
}

export default { init, resize, run };
