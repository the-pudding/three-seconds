/* global d3 WIDTH HEIGHT FONT_SIZE */
import slide from './slide';
import animateText from './animate-text';
import pause from './pause';
import flipbook from './flipbook';
import typer from './typer';

const $section = d3.select('#outro');
const $intertitle = $section.select('.intertitle');
const $p = $intertitle.select('p');
const $flipbook = $section.select('#flipbook-point');

let $tick = null;
let timeStart = null;
let timer = null;
let done2X = false;
let done3X = false;
let done4X = false;
function tick() {
  const cur = d3.now();
  const diff = (cur - timeStart) / 1000;
  const t = diff.toFixed(1);
  $tick.html(`${diff > 10 || t.includes('10') ? '???' : t} <span>🤔</span>`);
  if (diff > 2.5 && !done2X) {
    $flipbook
      .selectAll('img')
      .transition()
      .ease(d3.easeCubicOut)
      .duration(500)
      .style('transform', `translate(${WIDTH * 0.125}px,0) scale(1.5)`);
    done2X = true;
  }
  if (diff > 6.5 && !done3X) {
    $flipbook
      .selectAll('img')
      .transition()
      .ease(d3.easeCubicOut)
      .duration(500)
      .style('transform', `translate(${WIDTH * 0.25}px,0) scale(2)`);
    done3X = true;
  } else if (diff > 10.5 && !done4X) {
    $flipbook
      .selectAll('img')
      .transition()
      .ease(d3.easeCubicOut)
      .duration(100)
      .style('transform', `translate(0,0) scale(1)`);
    done4X = true;
  }
}

function tickStart() {
  timeStart = d3.now();
  const h = $flipbook.node().offsetWidth;
  const y = HEIGHT * 0.55 + h / 2;
  $tick.style('top', `${y}px`);
  animateText({ sel: $tick, state: 'visible' });
  timer = d3.timer(tick);
  return Promise.resolve();
}

function tickStop() {
  timer.stop();
}

async function run() {
  await slide({ sel: $section, state: 'enter' });
  // await typer.reveal($p);
  // await pause(4);
  await slide({ sel: $intertitle, state: 'exit', dur: 0 });
  await tickStart();
  await flipbook.play({ id: '#flipbook-point' });
  await tickStop();
  await slide({ sel: $section, state: 'exit' });
}

function resize() {}

function init() {
  $tick = $section
    .append('p')
    .attr('class', 'tick')
    .html('0.0 <span>🤔</span>');

  animateText({ sel: $tick, state: 'pre', dur: 0 });
}

export default { init, resize, run };
