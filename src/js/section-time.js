/* global d3 WIDTH HEIGHT FONT_SIZE */
import slide from './slide';
import animateText from './animate-text';
import pause from './pause';
import typer from './typer';
import colors from './colors';

const FOUL = 'Defensive 3 Seconds';
const MINUTES = d3.range(0, 48);
const QUARTER_MINS = 12;
const BIN = 3;
const BAND_PAD = 0.25;

const $section = d3.select('#time');
const $intertitle = $section.select('.intertitle');
const $p = $intertitle.select('p');
const $figure = $section.select('figure');
const $svg = $figure.select('svg');
const $axis = $svg.select('.g-axis');
const $vis = $svg.select('.g-vis');

let chartWidth = 0;
let chartHeight = 0;
let maxCount = 0;
let totalCount = 0;
let targetCount = 0;
let strokeWidth = 0;

const scaleX = d3.scaleBand().paddingInner(BAND_PAD);

const scaleY = d3.scaleLinear().clamp(true);

function quarter(q) {
  return new Promise(resolve => {
    const x = scaleX(QUARTER_MINS * (q - 1));
    const y = chartHeight + strokeWidth * 2;

    $vis
      .select('.quarter')
      .transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .attr('transform', `translate(${x}, ${y})`)
      .style('opacity', 1)
      .select('text')
      .text(`Q${q}`);

    $vis
      .selectAll('.minute')
      .transition()
      .duration(500)
      // .delay((d, i) => i * 10)
      .ease(d3.easeCubicInOut)
      .style('fill', d => (d.quarter === q ? colors.primary : colors.bgInvert))
      .style('opacity', d => (d.quarter === q ? 1 : 0.5))
      .on('end', (d, i, n) => {
        if (i === n.length - 1) resolve();
      });
  });
}

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

function moveBars() {
  return new Promise(resolve => {
    $vis
      .selectAll('.minute')
      .transition()
      .duration(1000)
      .delay((d, i) => i * 10)
      .ease(d3.easeCubicInOut)
      .attr('y', d => chartHeight - scaleY(d.count))
      .attr('height', d => scaleY(d.count))
      .on('end', (d, i, n) => {
        if (i === n.length - 1) resolve();
      });
  });
}

function revealFigure() {
  return new Promise(resolve => {
    $figure
      .transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .style('opacity', 1)
      .on('end', resolve);
  });
}

async function run() {
  await slide({ sel: $section, state: 'enter' });
  // await animateText({ sel: $p, visible: true });
  await typer.reveal($p);
  await pause(3.5);
  await revealFigure();
  await slide({ sel: $intertitle, state: 'exit' });
  // await pause(2);
  // revealFigure();
  // await pause(1);
  await moveBars();
  // await pause(1);
  await quarter(1);
  await pause(0.5);
  await quarter(2);
  await pause(0.5);
  await quarter(3);
  await pause(0.5);
  await quarter(4);
  await pause(2.5);
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {
  const margin = Math.floor(WIDTH * 0.04);
  strokeWidth = Math.floor(WIDTH * 0.005);

  chartWidth = WIDTH - margin * 2;
  chartHeight = HEIGHT * 0.67 - margin * 6;

  scaleX.rangeRound([0, chartWidth]);

  scaleY.range([strokeWidth + 1, chartHeight]);

  $figure
    .style('width', `${chartWidth + margin * 2}px`)
    .style('height', `${chartHeight + margin * 6}px`);

  $vis.attr('transform', `translate(${margin}, ${margin * 2})`);

  $vis
    .select('.quarter')
    .attr(
      'transform',
      `translate(${-scaleX(QUARTER_MINS)}, ${chartHeight + strokeWidth * 2})`
    );

  const quarterW = scaleX.bandwidth() * (1 + BAND_PAD) * (QUARTER_MINS / BIN);

  $vis
    .select('.quarter rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', quarterW)
    .attr('height', strokeWidth * 4);

  $vis
    .select('.quarter text')
    .attr('x', quarterW / 2)
    .attr('y', strokeWidth * 4);

  $vis
    .selectAll('.minute')
    .attr('x', d => scaleX(d.minute))
    .attr('y', d => chartHeight - scaleY(targetCount))
    .attr('width', scaleX.bandwidth())
    .attr('height', scaleY(targetCount))
    .style('stroke-width', strokeWidth);
}

function init({ data }) {
  const data3 = data.filter(d => d.minute <= 48);

  const minuteData = MINUTES.map(d => {
    const match = data3.find(v => v.minute === d);
    return {
      minute: d,
      quarter: Math.floor(d / 12) + 1,
      foul: FOUL,
      count: 0,
      ...match,
    };
  });

  const nestedData = d3
    .nest()
    .key(d => Math.floor(d.minute / BIN))
    .rollup(values => {
      return {
        ...values[0],
        count: d3.sum(values, v => v.count),
      };
    })
    .entries(minuteData);

  const binData = nestedData.map(d => d.value);

  maxCount = d3.max(binData, d => d.count);
  totalCount = d3.sum(binData, d => d.count);
  targetCount = Math.round(totalCount / binData.length);

  scaleX.domain(binData.map(d => d.minute));
  scaleY.domain([0, maxCount]);

  const $q = $vis
    .append('g')
    .attr('class', 'quarter')
    .style('opacity', 0);

  $q.append('rect');
  $q.append('text')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'hanging');

  $vis
    .selectAll('.minute')
    .data(binData)
    .join('rect')
    .attr('class', 'minute')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 0)
    .attr('height', 0);
}

export default { init, resize, run };
