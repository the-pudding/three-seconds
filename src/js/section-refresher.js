/* global d3 WIDTH HEIGHT  FONT_SIZE */
import slide from './slide';
import typer from './typer';
import pause from './pause';
import animateText from './animate-text';

const $section = d3.select('#refresher');
const $intertitle = $section.select('.intertitle');
const $p = $intertitle.select('p');
const $svg = $section.select('svg');
const $dirk = d3.select('#dirk');
const $wade = d3.select('#wade');
const $paint = d3.select('#paint_1_');

let $tick = null;

let timeStart = 0;
let timer = null;
let done = false;

function tick() {
  const cur = d3.now();
  const diff = (cur - timeStart) / 1000;
  const t = diff.toFixed(1);
  $tick.text(t);
  if (diff >= 3.0 && !done) {
    done = true;
  }
}

function tickStart() {
  timeStart = d3.now();
  animateText({ sel: $tick, state: 'visible' });
  timer = d3.timer(tick);
  return Promise.resolve();
}

function tickStop() {
  timer.stop();
}

function toggleDirk(state) {
  const left = 0.505 * WIDTH;
  if (state === 'enter')
    $dirk
      .transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .style('left', `${left}px`);
  else if (state === 'exit')
    $dirk
      .transition()
      .duration(500)
      .ease(d3.easeCubicIn)
      .style('left', `-${WIDTH - left}px`);

  return Promise.resolve();
}

function toggleWade(state) {
  const right = 0.075 * WIDTH;
  if (state === 'enter')
    $wade
      .transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .style('right', `${right}px`);
  else if (state === 'exit')
    $wade
      .transition()
      .duration(500)
      .ease(d3.easeCubicIn)
      .style('right', `${WIDTH + right}px`);

  return Promise.resolve();
}

function paint() {
  return new Promise(resolve => {
    $paint
      .transition()
      .duration(250)
      .ease(d3.easeCubicInOut)
      .style('fill-opacity', $paint.style('fill-opacity') === '0' ? 1 : 0)
      .on('end', resolve);
  });
}

async function run() {
  await slide({ sel: $section, state: 'enter' });
  await typer.reveal($p);
  await pause(3.5);
  await slide({ sel: $intertitle, state: 'exit' });
  await toggleWade('enter');
  await pause(0.25);
  await toggleDirk('enter');
  await pause(2);
  await tickStart();
  await pause(3);
  await tickStop();
  await paint();
  await paint();
  await paint();
  await paint();
  await paint();
  await paint();
  await paint();
  await paint();
  await paint();
  await paint();
  await paint();
  await paint();
  await toggleWade('exit');
  await toggleDirk('exit');
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {}

function init() {
  $tick = $section
    .append('p')
    .attr('class', 'tick')
    .text('0.0');

  animateText({ sel: $tick, state: 'pre', dur: 0 });
}

export default { init, resize, run };
