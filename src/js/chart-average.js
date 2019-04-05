/* global d3 */
const FOUL = 'Defensive 3 Seconds';

const $figure = d3.select('#average');
const $svg = $figure.select('svg');
const $axis = $svg.select('.g-axis');
const $vis = $svg.select('.g-vis');
const $lance = d3.select('#lance');

const scaleX = d3.scaleLinear().domain([12, 36]);
const scaleY = d3.scaleBand().paddingInner(0);

let chartWidth = 0;
let chartHeight = 0;

function toggleLance({ on = false, dur = 0 }) {
  const y = on ? 0 : $lance.node().offsetHeight;

  return new Promise(resolve => {
    d3.select('#lance')
      .transition()
      .duration(dur)
      .ease(d3.easeCubicInOut)
      .style('transform', `translate(0px, ${y}px)`)
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
  await toggleLance({ on: true, dur: 400 });
  await moveDots();
  await toggleLance({ on: false, dur: 400 });
  return true;
}

function resize({ width, height }) {
  const margin = Math.floor(width * 0.05);
  const fontSize = Math.floor(width * 0.025);
  const fontSizeAxis = Math.floor(width * 0.0175);
  const radius = Math.floor(fontSize / 2);

  chartWidth = width - margin * 2;
  chartHeight = chartWidth;

  scaleX.range([0, chartWidth]);
  scaleY.rangeRound([0, chartHeight]);

  $figure
    .style('width', `${chartWidth + margin * 2}px`)
    .style('height', `${chartHeight + margin * 2}px`);

  $svg
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
    .attr('x', fontSize * 0.75)
    .attr('y', fontSize / 12)
    .style('font-size', `${fontSize}px`);

  const axisX = d3
    .axisTop(scaleX)
    .tickValues([0, 12, 24, 36, 48])
    .tickSize(-chartHeight);

  $axis.call(axisX);

  $axis.selectAll('text').style('font-size', `${fontSizeAxis}px`);
}

function init({ data }) {
  toggleLance({ on: false });

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
