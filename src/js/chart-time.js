/* global d3 */
const FOUL = 'Defensive 3 Seconds';
const MINUTES = d3.range(1, 49);

const $figure = d3.select('#time');
const $svg = $figure.select('svg');
const $axis = $svg.select('.g-axis');
const $vis = $svg.select('.g-vis');

let chartWidth = 0;
let chartHeight = 0;
let maxCount = 0;
let totalCount = 0;
let targetCount = 0;

const scaleX = d3
  .scaleBand()
  .domain(MINUTES)
  .paddingInner(0.1);

const scaleY = d3.scaleLinear().clamp(true);

function run() {
  return new Promise((resolve, reject) => {
    $vis
      .selectAll('rect')
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

function resize({ width, height }) {
  const margin = Math.floor(width * 0.04);
  chartWidth = width - margin * 2;
  chartHeight = chartWidth;

  scaleX.rangeRound([0, chartWidth]);

  scaleY.range([0, chartHeight]);

  $figure
    .style('width', `${chartWidth + margin * 2}px`)
    .style('height', `${chartHeight + margin * 2}px`);

  $svg
    .style('width', `${chartWidth + margin * 2}px`)
    .style('height', `${chartHeight + margin * 2}px`);

  $vis.attr('transform', `translate(${margin}, ${margin})`);

  $vis
    .selectAll('rect')
    .attr('x', d => scaleX(d.minute))
    .attr('y', d => chartHeight - scaleY(targetCount))
    .attr('width', scaleX.bandwidth())
    .attr('height', scaleY(targetCount));
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

  maxCount = d3.max(minuteData, d => d.count);
  totalCount = d3.sum(minuteData, d => d.count);
  targetCount = Math.round(totalCount / minuteData.length);

  scaleY.domain([0, maxCount]);

  $vis
    .selectAll('rect')
    .data(minuteData)
    .join('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 0)
    .attr('height', 0);
}

export default { init, resize, run };
