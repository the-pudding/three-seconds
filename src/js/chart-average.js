/* global d3 */
const FOUL = 'Defensive 3 Seconds';
let margin = 0;
let fontSize = 0;
let radius = 0;

const $figure = d3.select('#average');
const $svg = $figure.select('svg');
const $axis = $svg.select('.g-axis');
const $vis = $svg.select('.g-vis');

let scaleX = null;
let scaleY = null;
let width = 0;
let height = 0;

function reveal() {
  d3.select('#lance').classed('is-reveal', true);

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
    .on('end', () => {
      d3.select('#lance').classed('is-reveal', false);
    });
}

function init({ data, w, h }) {
  const avgData = data.filter(d => d.use);
  avgData.sort((a, b) => d3.descending(a.average, b.average));

  margin = Math.floor(w * 0.05);
  fontSize = Math.floor(w * 0.025);
  radius = Math.floor(fontSize / 2);

  width = w - margin * 2;
  height = width;

  scaleX = d3
    .scaleLinear()
    .domain([12, 36])
    .range([0, width]);

  scaleY = d3
    .scaleBand()
    .domain(d3.range(avgData.length + 1))
    .rangeRound([0, height])
    .paddingInner(0);

  $figure
    .style('width', `${width + margin * 2}px`)
    .style('height', `${height + margin * 2}px`);

  $svg
    .style('width', `${width + margin * 2}px`)
    .style('height', `${height + margin * 2}px`);

  $vis.attr('transform', `translate(${margin}, ${margin})`);
  $axis.attr('transform', `translate(${margin}, ${margin})`);

  $vis
    .selectAll('g')
    .data(avgData)
    .join(enter => {
      const $g = enter.append('g');
      $g.attr('class', 'foul').classed('is-highlight', d => d.foul === FOUL);
      $g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', radius);
      $g.append('text')
        .text(d => d.foul)
        .attr('alignment-baseline', 'middle')
        // .attr('text-anchor', 'end')
        .attr('x', fontSize * 0.75)
        .attr('y', fontSize / 12)
        .style('font-size', `${fontSize}px`);
      return $g;
    })
    .attr('transform', (d, i) => `translate(${scaleX(24)}, ${scaleY(i + 1)})`);

  const axisX = d3
    .axisTop(scaleX)
    .tickValues([0, 12, 24, 36, 48])
    .tickSize(-height);

  $axis.call(axisX);

  $axis.selectAll('text').style('font-size', `${Math.floor(w * 0.0175)}px`);
}

export default { init, reveal };
