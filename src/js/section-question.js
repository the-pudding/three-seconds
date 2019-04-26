/* global d3 WIDTH HEIGHT FONT_SIZE SQUARE */
import slide from './slide';
import pause from './pause';
import flipbook from './flipbook';
import typer from './typer';

const $section = d3.select('#question');
const $intertitle = $section.select('.intertitle');
const $p = $intertitle.select('p');
const $flipbook = $section.select('#flipbook-harden');

function reaction() {
  d3.timeout(() => {
    flipbook.play({ id: '#flipbook-harden' });
  }, 300);
  return Promise.resolve();
}

async function run() {
  await slide({ sel: $section, state: 'enter' });
  await typer.reveal($p);
  await pause(2);
  d3.select('#fin').style('transform', `translate(0,0)`);
  await reaction();
  await slide({ sel: $intertitle, state: 'exit' });
  await pause(0.25);
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {
  if (SQUARE) {
    $p.html('<span><em>What’s the point?</em></span>');
  }
}

function init() {}

export default { init, resize, run };
