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

// let borderWidth = 0;

function revealFigure() {
  return new Promise(resolve => {
    $figure.style('opacity', 1);

    $figure
      .selectAll('img')
      .transition()
      .delay(() => Math.random() * 2000)
      .duration(250)
      .ease(d3.easeCubicOut)
      .style('opacity', 1);

    d3.timeout(resolve, 2250);
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

async function run() {
  await slide({ sel: $section, state: 'enter' });
  // await animateText({ sel: $p, visible: true });
  // await pause(2);
  await typer.reveal($p);
  await pause(4.5);
  await slide({ sel: $intertitle, state: 'exit' });
  await revealFigure();
  await pause(2);
  await goToFlip();
  await pause(1);
  scaleFlip(6);
  await flipbook.play('#flipbook-l2m');
  await scaleFlip(1);
  await pause(0.5);
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {
  // const chartHeight = HEIGHT * 0.67;

  // $figure.style('height', `${chartHeight}px`);

  const borderWidth = Math.floor(WIDTH * 0.005);

  $figure.selectAll('img').style('border-width', `${borderWidth}px`);
  $flipbook.style('border-width', `${borderWidth}px`);
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
