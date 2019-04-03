/* global d3 */
const FOUL = 'Defensive 3 Seconds';
const MARGIN = 32;
const RADIUS = 8;

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
    .selectAll('g')
    .transition()
    .duration(1000)
    .delay((d, i) => i * 100)
    .ease(d3.easeBackOut.overshoot(2))
    .attr(
      'transform',
      (d, i) => `translate(${scaleX(d.average)}, ${scaleY(i)})`
    );
}

function init({ data, w, h }) {
  const avgData = data.filter(d => d.use);
  avgData.sort((a, b) => d3.descending(a.average, b.average));

  width = w * 0.8 - MARGIN * 2;
  height = width;

  scaleX = d3
    .scaleLinear()
    .domain([0, 48])
    .range([0, width])
    .clamp(true);

  scaleY = d3
    .scaleBand()
    .domain(d3.range(avgData.length))
    .rangeRound([0, height])
    .paddingInner(0);

  $figure
    .style('width', `${width + MARGIN * 2}px`)
    .style('height', `${height + MARGIN * 2}px`);

  $svg
    .style('width', `${width + MARGIN * 2}px`)
    .style('height', `${height + MARGIN * 2}px`);

  $vis.attr('transform', `translate(${MARGIN}, ${MARGIN})`);

  $vis
    .selectAll('g')
    .data(avgData)
    .join(enter => {
      const $g = enter.append('g');
      $g.attr('class', 'foul');
      $g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', RADIUS);
      $g.append('text').text(d => d.foul);
      return $g;
    })
    .attr('transform', (d, i) => `translate(${scaleX(24)}, ${scaleY(i)})`);
}

export default { init, reveal };
