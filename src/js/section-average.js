/* global d3 */
import animateText from './animate-text';
import pause from './pause';

const FOUL = 'Defensive 3 Seconds';

const $section = d3.select('#average');
const $p = $section.select('p');
const $figure = $section.select('figure');
const $svg = $figure.select('svg');
const $axis = $svg.select('.g-axis');
const $vis = $svg.select('.g-vis');
const $lance = d3.select('#lance');

const scaleX = d3.scaleLinear().domain([12, 36]);
const scaleY = d3.scaleBand().paddingInner(0);

let chartWidth = 0;
let chartHeight = 0;

function toggleFigure({ visible = false, dur = 0 }) {
  const figureW = $figure.node().offsetWidth;
  const figureH = $figure.node().offsetHeight;
  const x = visible ? 0 : -figureW;
  const y = -figureH / 2;
  return new Promise(resolve => {
    $figure
      .transition()
      .duration(dur)
      .ease(d3.easeCubicInOut)
      .style('transform', `translate(${x}px, ${y}px)`)
      .on('end', resolve);
  });
}

function toggleLance({ visible = false, dur = 0 }) {
  const offsetH = $section.node().offsetHeight * 0.5;
  const figureH = $figure.node().offsetHeight * 0.5;
  const imgH = $lance.node().offsetHeight;
  const top = offsetH + figureH - imgH;
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
    $vis
      .selectAll('g')
      .transition()
      .duration(1000)
      .delay(500)
      .ease(d3.easeCubicInOut)
      .attr(
        'transform',
        (d, i) => `translate(${scaleX(d.average)}, ${scaleY(i + 1)})`
      )
      .on('end', resolve);
  });
}

async function run() {
  $section.classed('is-hidden', false);
  await animateText({ sel: $p, visible: true });
  await toggleFigure({ visible: true, dur: 500 });
  await pause(3);
  await toggleLance({ visible: true, dur: 400 });
  await moveDots();
  await pause(1);
  await toggleLance({ visible: false, dur: 400 });
  await pause(3);
  $section.classed('is-hidden', true);
  return true;
}

function resize({ width, height }) {
  const margin = Math.floor(width * 0.05);
  const fontSize = Math.floor(width * 0.025);
  const fontSizeAxis = Math.floor(width * 0.0175);
  const radius = Math.floor(fontSize / 2);
  const strokeWidth = Math.floor(width * 0.005);

  chartWidth = width - margin * 2;
  chartHeight = chartWidth;

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

  $vis
    .selectAll('circle')
    .attr('r', radius)
    .style('stroke-width', `${strokeWidth}px`);
  $vis
    .selectAll('text')
    .attr('x', fontSize * 0.75)
    .attr('y', fontSize / 12)
    .style('font-size', `${fontSize}px`);

  const axisX = d3
    .axisTop(scaleX)
    .tickValues([0, 12, 24, 36, 48])
    .tickSize(-chartHeight);

  $axis.call(axisX);

  $axis.selectAll('text').style('font-size', `${fontSizeAxis}px`);

  toggleFigure({ visible: false });
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
}

export default { init, resize, run };
