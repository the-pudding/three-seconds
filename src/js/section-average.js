/* global d3 WIDTH HEIGHT FONT_SIZE */
import slide from './slide';
import animateText from './animate-text';
import typer from './typer';
import pause from './pause';

const FOUL = 'Defensive 3 Seconds';

const $section = d3.select('#average');
const $intertitle = $section.select('.intertitle');
const $p = $intertitle.select('p');
const $figure = $section.select('figure');
const $svg = $figure.select('svg');
const $axis = $svg.select('.g-axis');
const $vis = $svg.select('.g-vis');
const $lance = d3.select('#lance');

const scaleX = d3.scaleLinear().domain([12, 36]);
const scaleY = d3.scaleBand().paddingInner(0);

let chartWidth = 0;
let chartHeight = 0;

function toggleLance({ visible = false, dur = 0 }) {
  const figureH = $figure.node().offsetHeight;
  const imgH = $lance.node().offsetHeight;
  const offsetH = 0.5 * HEIGHT;
  const top = offsetH + figureH / 2 - imgH;
  const x = visible ? 0 : $lance.node().offsetWidth;

  return new Promise(resolve => {
    $lance
      .transition()
      .duration(dur)
      .ease(d3.easeCubicInOut)
      .style('top', `${top}px`)
      .style('transform', `translate(${x}px, 0px)`)
      .on('end', resolve);
  });
}

function moveDots() {
  return new Promise(resolve => {
    let done = false;
    $vis
      .selectAll('g')
      .transition()
      .duration(1000)
      .delay(d => (d.foul === FOUL ? 2000 : 500))
      .ease(d3.easeCubicInOut)
      .attr(
        'transform',
        (d, i) => `translate(${scaleX(d.average)}, ${scaleY(i + 1)})`
      )
      .on('end', d => {
        if (d.foul !== FOUL) {
          done = true;
          resolve();
        }
      });
  });
}

function revealFigure() {
  return new Promise(resolve => {
    $figure
      .transition()
      .duration(0)
      .ease(d3.easeCubicOut)
      .style('opacity', 1)
      .on('end', resolve);
  });
}

async function run() {
  await slide({ sel: $section, state: 'enter' });
  // await animateText({ sel: $p, visible: true });
  await typer.reveal($p);
  await pause(4);
  await revealFigure();
  await slide({ sel: $intertitle, state: 'exit' });
  await pause(0.25);

  animateText({
    sel: $figure.select('.observe--expectation'),
    state: 'visible',
  });

  await pause(4);
  await moveDots();
  await toggleLance({ visible: true, dur: 500 });
  animateText({ sel: $figure.select('.observe--expectation'), state: 'exit' });
  animateText({ sel: $figure.select('.observe--reality'), state: 'visible' });
  await pause(2);
  await toggleLance({ visible: false, dur: 500 });
  await pause(4);
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {
  const margin = Math.floor(WIDTH * 0.05);
  const fontSize = Math.floor(FONT_SIZE * 0.67);
  const radius = Math.floor(fontSize * 0.5);

  chartWidth = WIDTH - margin * 2;
  chartHeight = HEIGHT * 0.75 - margin * 2;

  scaleX.range([0, chartWidth]);
  scaleY.rangeRound([0, chartHeight]);

  $figure
    .style('width', `${chartWidth + margin * 2}px`)
    .style('height', `${chartHeight + margin * 2}px`);

  $vis.attr('transform', `translate(${margin}, ${margin})`);
  $axis.attr('transform', `translate(${margin}, ${margin})`);

  $vis
    .selectAll('g')
    .attr('transform', (d, i) => `translate(${scaleX(24)}, ${scaleY(i + 1)})`);

  $vis.selectAll('circle').attr('r', radius);

  $vis
    .selectAll('text')
    .attr('x', fontSize)
    .attr('y', fontSize / 12)
    .style('font-size', `${fontSize}px`);

  const axisX = d3
    .axisTop(scaleX)
    .tickValues([0, 12, 24, 36, 48])
    .tickSize(-chartHeight);

  $axis.call(axisX);

  $svg
    .select('.quarter--2')
    .attr('transform', `translate(${WIDTH * 0.275}, ${margin})`);

  $svg
    .select('.quarter--3')
    .attr('transform', `translate(${WIDTH * 0.725}, ${margin})`);

  toggleLance({ visible: false });
}

function init({ data }) {
  const avgData = data.filter(d => d.use);
  avgData.sort((a, b) => d3.descending(a.average, b.average));

  scaleY.domain(d3.range(avgData.length + 1));

  $vis
    .selectAll('g')
    .data(avgData)
    .join(enter => {
      const $g = enter.append('g');
      $g.attr('class', 'foul').classed('is-highlight', d => d.foul === FOUL);
      $g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 0);
      $g.append('text')
        .text(d => d.foul)
        .attr('alignment-baseline', 'middle');
      return $g;
    });

  const $period = $figure.append('div').attr('class', 'periods');

  $period
    .append('p')
    .attr('class', 'period period--2')
    .text('Q2');

  $period
    .append('p')
    .attr('class', 'period period--half')
    .text('Halftime');

  $period
    .append('p')
    .attr('class', 'period period--3')
    .text('Q3');

  const $oE = $figure.append('p').attr('class', 'observe observe--expectation');

  $oE.append('span').text('Expectation');

  const $oR = $figure.append('p').attr('class', 'observe observe--reality');

  $oR.append('span').text('Reality');

  animateText({ sel: $oE, state: 'pre', dur: 0 });
  animateText({ sel: $oR, state: 'pre', dur: 0 });
}

export default { init, resize, run };
