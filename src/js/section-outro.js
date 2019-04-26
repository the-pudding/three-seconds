/* global d3 WIDTH HEIGHT FONT_SIZE */
import slide from './slide';
import animateText from './animate-text';
import pause from './pause';
import flipbook from './flipbook';

const $section = d3.select('#outro');
const $intertitle = $section.select('.intertitle');
const $p = $intertitle.select('p');
const $flipbook = $section.select('#flipbook-point');
const $flipbook2 = $section.select('#flipbook-nurse');

let $tick = null;
let timeStart = null;
let timer = null;
let done2X = false;
let done3X = false;

function tick() {
  const cur = d3.now();
  const diff = (cur - timeStart) / 1000;
  const t = diff.toFixed(1);
  $tick.html(
    `${diff >= 9 || t.includes('9.') ? '???' : t}<span>seconds</span>`
  );
  if (diff > 2.5 && !done2X) {
    $flipbook
      .selectAll('img')
      .transition()
      .ease(d3.easeCubicOut)
      .duration(500)
      .style('transform', `translate(${WIDTH * 0.125}px,0) scale(1.55)`);
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
  }
}

function slideFig() {
  d3.select('#l2m')
    .transition()
    .duration(500)
    .ease(d3.easeCubicIn)
    .style('left', `-${WIDTH}px`);
}

function tickStart() {
  timeStart = d3.now();
  const h = $flipbook.node().offsetWidth;
  const y = HEIGHT * 0.525 + h / 2;
  $tick.style('top', `${y}px`);
  animateText({ sel: $tick, state: 'visible' });
  animateText({
    sel: $section.select('.observe'),
    state: 'visible',
    delay: 500,
  });
  timer = d3.timer(tick);
  return Promise.resolve();
}

function tickStop() {
  timer.stop();
}

function reverseReaction() {
  $flipbook2
    .transition()
    .duration(500)
    .ease(d3.easeCubicIn)
    .style('left', `${WIDTH * 1.375}px`)
    // .style('bottom', `${HEIGHT * 0.5}px`)
    .on('end', () => {
      $flipbook2.classed('is-visible', false);
    });
}

function reaction() {
  $flipbook2
    .transition()
    .duration(500)
    .delay(4500)
    .ease(d3.easeCubicOut)
    .style('left', `${WIDTH * (0.815 - 0.05)}px`)
    .on('end', () => {
      d3.timeout(reverseReaction, 4000);
    })
    .on('start', () => {
      const h = $flipbook2.node().offsetWidth;
      const hf = $flipbook.node().offsetHeight / 2;
      $flipbook2
        .style('top', `${HEIGHT / 2 + hf}px`)
        .style('height', `${h}px`)
        .classed('is-visible', true);
    });
  d3.timeout(() => {
    flipbook.play({ id: '#flipbook-nurse' });
  }, 4500 + 300);
  return Promise.resolve();
}

async function run() {
  await slide({ sel: $section, state: 'enter', early: 0.6 });
  await slide({ sel: $intertitle, state: 'exit', dur: 0 });
  await tickStart();
  await reaction();
  await flipbook.play({ id: '#flipbook-point', early: 0.95 });
  await tickStop();
  slideFig();
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {}

function init() {
  $tick = $section
    .append('p')
    .attr('class', 'tick')
    .html('0.0<span>seconds</span>');

  animateText({ sel: $tick, state: 'pre', dur: 0 });

  const $o = $section
    .append('p')
    .attr('class', 'observe')
    .html('<span>...When it’s ignored</span>');

  animateText({ sel: $o, state: 'pre', dur: 0 });
}

export default { init, resize, run };
