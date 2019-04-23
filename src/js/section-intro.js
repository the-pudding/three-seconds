/* global d3 WIDTH HEIGHT */
import slide from './slide';
import animateText from './animate-text';
import pause from './pause';

const $section = d3.select('#intro');
const $byline = $section.select('.byline');
const $logo = $section.select('.logo');
const $lebron = d3.select('#lebron');

function slideTitle({ sel, dur = 500, delay = 0 }) {
  return new Promise(resolve => {
    sel
      .transition()
      .delay(delay)
      .duration(dur)
      .ease(d3.easeCubicOut)
      .style('left', `${WIDTH * 0.05}px`)
      .on('end', resolve);
  });
}

function slideX({ sel, dur = 500, delay = 0 }) {
  return new Promise(resolve => {
    sel
      .transition()
      .delay(delay)
      .duration(dur)
      .ease(d3.easeCubicOut)
      .attr('transform', `translate(0, 0)`)
      .on('end', resolve);
  });
}

function toggleLebron({ visible = false, dur = 0 }) {
  const x = visible ? 0 : $lebron.node().offsetWidth;

  return new Promise(resolve => {
    $lebron
      .transition()
      .duration(dur)
      .ease(d3.easeCubicInOut)
      .style('transform', `translate(${x}px, 0px) rotate(-30deg) scaleX(-1)`)
      .on('end', resolve);
  });
}

async function run() {
  await slide({ sel: $section, state: 'enter' });
  await slideX({ sel: d3.select('#three') });
  slideX({ sel: d3.select('#key') });
  slideX({ sel: d3.select('#paint'), delay: 150 });
  await slideTitle({ sel: d3.select('.intro__title--2'), delay: 400 });
  await pause(0.5);
  toggleLebron({ visible: true, dur: 500 });
  await pause(0.25);
  await animateText({ sel: $byline, state: 'visible' });
  await pause(1.5);
  await animateText({ sel: $logo, state: 'visible' });
  await pause(2);
  toggleLebron({ visible: false, dur: 500 });
  await slide({ sel: $section, state: 'exit' });
  return true;
}

function resize() {
  toggleLebron({ visible: false });
  $section
    .selectAll('#court path')
    .attr('transform', `translate(-${WIDTH}, 0)`);
}

function init() {
  animateText({ sel: $byline, state: 'pre', dur: 0 });
}

export default { init, resize, run };
