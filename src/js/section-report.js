/* global d3 WIDTH HEIGHT FONT_SIZE */
import slide from './slide';
import animateText from './animate-text';
import pause from './pause';
import flipbook from './flipbook';
import typer from './typer';

const $section = d3.select('#report');
const $intertitle = $section.select('.intertitle');
const $p = $intertitle.select('p');
const $figure = $section.select('figure');
const $flipbook = $section.select('#flipbook-l2m');
const $flipbook2 = $section.select('#flipbook-spike');

let timeStart = 0;
let timer = null;
let done1 = false;
let done2 = false;

function revealFigure() {
  return new Promise(resolve => {
    $figure.style('opacity', 1);

    $figure
      .selectAll('img')
      .transition()
      .delay(() => Math.random() * 1000)
      .duration(250)
      .ease(d3.easeCubicOut)
      .style('opacity', 1);

    d3.timeout(resolve, 1500);
  });
}

function goToFlip() {
  return new Promise(resolve => {
    const $img = $figure.select('.is-special');
    const { top, left, width, height } = $img.node().getBoundingClientRect();

    $flipbook
      .classed('is-visible', true)
      .style('top', `${top}px`)
      .style('left', `${left}px`)
      .style('width', `${width}px`)
      .style('height', `${height}px`);

    $figure
      .transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .style('opacity', 0.1)
      .on('end', resolve);

    // .style('border-color', colors.fg);
  });
}

function scaleFlip(scale) {
  return new Promise(resolve => {
    $flipbook
      .transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .style('transform', `scale(${scale})`)
      .on('end', resolve);
  });
}

function tick() {
  const cur = d3.now();
  const diff = (cur - timeStart) / 1000;
  if (diff > 1.5 && !done1) {
    $flipbook
      .selectAll('img')
      .transition()
      .ease(d3.easeCubicOut)
      .duration(500)
      .style('transform', `scale(2)`);
    done1 = true;
  }
  if (diff > 5.3 && !done2) {
    $flipbook
      .selectAll('img')
      .transition()
      .ease(d3.easeCubicOut)
      .duration(100)
      .style('transform', `scale(1)`);
    done2 = true;
  }
}

function tickStart() {
  timeStart = d3.now();
  timer = d3.timer(tick);
  return Promise.resolve();
}

function tickStop() {
  timer.stop();
}

async function run() {
  await slide({ sel: $section, state: 'enter' });
  // await animateText({ sel: $p, visible: true });
  // await pause(2);
  await typer.reveal($p);
  await pause(5);
  await slide({ sel: $intertitle, state: 'exit' });
  await revealFigure();
  await pause(1);
  await goToFlip();
  await pause(1);
  scaleFlip(6);
  await tickStart();
  await flipbook.play({ id: '#flipbook-l2m', early: 0.95 });
  await tickStop();
  await scaleFlip(1);
  // await pause(0.5);
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {
  // const borderWidth = Math.floor(WIDTH * 0.005);
  // $figure.selectAll('img').style('border-width', `${borderWidth}px`);
  // $flipbook.style('border-width', `${borderWidth}px`);
}

function init() {
  const data = d3.range(138);
  const special = 9 * 7 + 3;
  $figure
    .selectAll('img')
    .data(data)
    .join('img')
    .attr('src', d => `assets/images/report/${d}.png`)
    .classed('is-special', d => d === special);

  const firstFrame = $flipbook.attr('data-src');

  $figure.select('.is-special').attr('src', `${firstFrame}/1.png`);
}

export default { init, resize, run };
