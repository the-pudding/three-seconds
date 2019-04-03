/* global d3 */
const FOUL = 'Defensive 3 Seconds';
const MARGIN = 32;

const $figure = d3.select('#time');
const $svg = $figure.select('svg');
const $axis = $svg.select('.g-axis');
const $vis = $svg.select('.g-vis');

let scaleX = null;
let scaleY = null;
let width = 0;
let height = 0;

function reveal() {
  $vis
    .selectAll('rect')
    .transition()
    .duration(1000)
    .delay((d, i) => i * 10)
    .ease(d3.easeCubicInOut)
    .attr('y', d => height - scaleY(d.count))
    .attr('height', d => scaleY(d.count));
}

function init({ data, w, h }) {
  const minutes = d3.range(1, 49);
  const data3 = data.filter(d => d.foul === FOUL).filter(d => d.minute <= 48);

  const minuteData = minutes.map(d => {
    const match = data3.find(v => v.minute === d);
    return {
      minute: d,
      quarter: Math.floor(d / 12) + 1,
      foul: FOUL,
      count: 0,
      ...match,
    };
  });

  const maxCount = d3.max(minuteData, d => d.count);
  const totalCount = d3.sum(minuteData, d => d.count);
  const targetCount = Math.round(totalCount / minuteData.length);

  width = w - MARGIN * 2;
  height = width;

  scaleX = d3
    .scaleBand()
    .domain(minutes)
    .rangeRound([0, width])
    .paddingInner(0.1);

  scaleY = d3
    .scaleLinear()
    .domain([0, maxCount])
    .range([0, height])
    .clamp(true);

  $figure
    .style('width', `${width + MARGIN * 2}px`)
    .style('height', `${height + MARGIN * 2}px`);

  $svg
    .style('width', `${width + MARGIN * 2}px`)
    .style('height', `${height + MARGIN * 2}px`);

  $vis.attr('transform', `translate(${MARGIN}, ${MARGIN})`);

  $vis
    .selectAll('rect')
    .data(minuteData)
    .join('rect')
    .attr('x', d => scaleX(d.minute))
    .attr('y', d => height - scaleY(targetCount))
    .attr('width', scaleX.bandwidth())
    .attr('height', scaleY(targetCount));
}

export default { init, reveal };
