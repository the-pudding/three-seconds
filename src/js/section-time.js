/* global d3 WIDTH HEIGHT */
import slide from './slide';
import animateText from './animate-text';
import pause from './pause';

const FOUL = 'Defensive 3 Seconds';
const MINUTES = d3.range(0, 48);
const QUARTER_MINS = 12;
const BIN = 1;

const $section = d3.select('#time');
const $p = d3.select('p');
const $figure = $section.select('figure');
const $svg = $figure.select('svg');
const $axis = $svg.select('.g-axis');
const $vis = $svg.select('.g-vis');

let chartWidth = 0;
let chartHeight = 0;
let maxCount = 0;
let totalCount = 0;
let targetCount = 0;

const scaleX = d3.scaleBand().paddingInner(0);

const scaleY = d3.scaleLinear().clamp(true);

function quarter(q) {
  return new Promise(resolve => {
    $vis
      .select('.quarter')
      .transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .attr(
        'transform',
        `translate(${scaleX(QUARTER_MINS * (q - 1))}, ${chartHeight})`
      )
      .style('opacity', 1)
      .select('text')
      .text(`Q${q}`);

    $vis
      .selectAll('.minute')
      .transition()
      .duration(500)
      // .delay((d, i) => i * 10)
      .ease(d3.easeCubicInOut)
      .style('fill', d => (d.quarter === q ? '#282828' : '#949494'))
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

async function run() {
  await slide({ sel: $section, state: 'enter' });
  await animateText({ sel: $p, visible: true });
  // await toggleFigure({ visible: true, dur: 500 });
  await pause(3);
  await moveBars();
  await pause(1);
  await quarter(1);
  await pause(2);
  await quarter(2);
  await pause(2);
  await quarter(3);
  await pause(2);
  await quarter(4);
  await pause(2);
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {
  const margin = Math.floor(WIDTH * 0.04);
  const strokeWidth = Math.floor(WIDTH * 0.005);

  chartWidth = WIDTH - margin * 2;
  chartHeight = WIDTH - margin * 4;

  scaleX.rangeRound([0, chartWidth]);

  scaleY.range([strokeWidth + 1, chartHeight]);

  $figure
    .style('width', `${chartWidth + margin * 2}px`)
    .style('height', `${chartHeight + margin * 4}px`);

  $vis.attr('transform', `translate(${margin}, ${margin * 2})`);

  $vis
    .select('.quarter')
    .attr('transform', `translate(${-scaleX(QUARTER_MINS)}, ${chartHeight})`);

  const quarterW = scaleX.bandwidth() * (QUARTER_MINS / BIN);

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

  // toggleFigure({ visible: false });
}

function init({ data }) {
  const data3 = data.filter(d => d.foul === FOUL).filter(d => d.minute <= 48);

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
    .key(d => Math.floor((d.minute - 1) / BIN))
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
