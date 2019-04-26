/* global d3 WIDTH HEIGHT FONT_SIZE SQUARE */
import slide from './slide';
import animateText from './animate-text';
import pause from './pause';
import flipbook from './flipbook';
import typer from './typer';

const $section = d3.select('#report');
const $intertitle = $section.select('.intertitle');
const $p = $intertitle.select('p');
const $figure = d3.select('#l2m');
const $flipbook = $section.select('#flipbook-l2m');
const $flipbook2 = $section.select('#flipbook-spike');

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
  });
}

function scaleFlip() {
  return new Promise(resolve => {
    const {
      width,
      height,
      top,
      left,
    } = $flipbook.node().getBoundingClientRect();
    const scale = (WIDTH * (SQUARE ? 0.6 : 0.9)) / width;
    const w = width * scale;
    const h = height * scale;
    const t = top - h / 2 + height / 2;
    const l = Math.ceil(left - w / 2 + width / 2);

    $flipbook
      .select('img')
      .transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .style('transform', 'scale(1.02)');

    $flipbook
      .transition()
      .duration(500)
      .ease(d3.easeCubicInOut)
      .style('width', `${w}px`)
      .style('height', `${h}px`)
      .style('top', `${t}px`)
      .style('left', `${l}px`)
      .on('end', resolve);
  });
}

function reverseReaction() {
  $flipbook2
    .transition()
    .duration(250)
    .ease(d3.easeCubicIn)
    .style('left', `${WIDTH * (SQUARE ? 1.325 : 1.375)}px`)
    // .style('bottom', `${HEIGHT * 0.5}px`)
    .on('end', () => {
      $flipbook2.classed('is-visible', false);
    });
}

function reaction() {
  $flipbook2
    .transition()
    .duration(500)
    .delay(1250)
    .ease(d3.easeCubicOut)
    .style('left', `${WIDTH * ((SQUARE ? 0.83 : 0.815) - 0.05)}px`)
    .on('end', () => {
      d3.timeout(reverseReaction, 2000);
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
    flipbook.play({ id: '#flipbook-spike', loops: 3 });
  }, 1250);
  return Promise.resolve();
}

async function run() {
  await slide({ sel: $section, state: 'enter' });
  await typer.reveal($p);
  await pause(4);
  await slide({ sel: $intertitle, state: 'exit' });
  await revealFigure();
  await pause(1);
  await goToFlip();
  await pause(1);
  scaleFlip();
  animateText({ sel: $section.select('.observe'), state: 'visible' });
  // await tickStart();
  await reaction();
  await flipbook.play({ id: '#flipbook-l2m', early: 0.9 });
  // await tickStop();
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {
  const data = d3.range(138);
  const special = SQUARE ? 9 * 7 + 4 : 9 * 7 + 4;
  $figure
    .selectAll('img')
    .data(data)
    .join('img')
    .attr('src', d => `assets/images/report/${d}.png`)
    .classed('is-special', d => d === special);

  const firstFrame = $flipbook.attr('data-src');

  $figure.select('.is-special').attr('src', `${firstFrame}/1.png`);

  if (SQUARE) {
    const $span = $intertitle.selectAll('span');
    $span.filter((d, i) => i === 1).style('margin-right', '400px');
  }
}

function init() {
  const $o = $section
    .append('p')
    .attr('class', 'observe')
    .html('<span>When it’s called...</span>');

  animateText({ sel: $o, state: 'pre', dur: 0 });
}

export default { init, resize, run };
