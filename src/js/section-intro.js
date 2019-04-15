/* global d3 WIDTH HEIGHT */
import slide from './slide';
import animateText from './animate-text';
import pause from './pause';

const $section = d3.select('#intro');
const $byline = $section.select('.byline');
const $lebron = d3.select('#lebron');

function toggleLebron({ visible = false, dur = 0 }) {
  const x = visible ? 0 : $lebron.node().offsetWidth;

  return new Promise(resolve => {
    $lebron
      .transition()
      .duration(dur)
      .ease(d3.easeCubicInOut)
      .style('transform', `translate(${x}px, 0px) rotate(-35deg) scaleX(-1)`)
      .on('end', resolve);
  });
}

async function run() {
  await slide({ sel: $section, state: 'enter' });
  await toggleLebron({ visible: true, dur: 400 });
  await pause(3);
  await animateText({ sel: $byline, state: 'visible' });
  await pause(4);
  toggleLebron({ visible: false, dur: 500 });
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {
  toggleLebron({ visible: false });
  const stroke = Math.floor(WIDTH * 0.004);
  $section.select('h1').style('-webkit-text-stroke-width', `${stroke}px`);
}

function init() {
  animateText({ sel: $byline, state: 'pre', dur: 0 });
}

export default { init, resize, run };
