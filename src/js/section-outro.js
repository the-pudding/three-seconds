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

function tick() {
  const cur = d3.now();
  const diff = (cur - timeStart) / 1000;
  const t = diff.toFixed(1);
  $tick.html(`${t.includes('10') ? '???' : t} <span>🤔</span>`);
}

function tickStart() {
  timeStart = d3.now();
  const h = $flipbook.select('img').node().offsetHeight;
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
  await typer.reveal($p);
  await pause(4);
  await slide({ sel: $intertitle, state: 'exit' });
  await tickStart();
  await flipbook.play('#flipbook-point');
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
