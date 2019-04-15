/* global d3 WIDTH HEIGHT  FONT_SIZE */
import slide from './slide';
import animateText from './animate-text';
import typer from './typer';
import pause from './pause';

const $section = d3.select('#refresher');
const $intertitle = $section.select('.intertitle');
const $p = $intertitle.select('p');

async function run() {
  await slide({ sel: $section, state: 'enter' });
  // await animateText({ sel: $p, visible: true });
  await typer.reveal($p);
  await pause(3.5);
  await slide({ sel: $intertitle, state: 'exit' });
  await pause(8);
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {}

function init() {}

export default { init, resize, run };
