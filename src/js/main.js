/* global d3 WIDTH HEIGHT FONT_SIZE */
import '@babel/polyfill';
import './utils/render-d3-video';
import loadData from './load-data';
import slide from './slide';
import flipbook from './flipbook';
import Intro from './section-intro';
import Refresher from './section-refresher';
import Time from './section-time';
import Average from './section-average';
import Report from './section-report';
import Outro from './section-outro';

const $main = d3.select('main');

async function runAll() {
  console.time('run');
  await Intro.run();
  await Refresher.run();
  await Average.run();
  await Time.run();
  await Report.run();
  await Outro.run();
  console.timeEnd('run');
}

function setupSlide() {
  slide({ sel: d3.select(this), state: 'pre', dur: 0 });
}

window.renderStart = async function renderStart({ width, height }) {
  window.WIDTH = width;
  window.HEIGHT = height;
  window.FONT_SIZE = Math.floor(width * 0.05);

  $main
    .style('width', `${width}px`)
    .style('height', `${height}px`)
    .style('font-size', `${FONT_SIZE}px`);

  d3.selectAll('section').each(setupSlide);

  Intro.resize();
  Refresher.resize();
  Time.resize();
  Average.resize();
  Report.resize();
  Outro.resize();

  await flipbook.init();

  runAll();
  return true;
};

function devStart() {
  if (window.currentTime === undefined) {
    window.DEV = true;
    window.renderStart({ width: 1080, height: 1920 });
  }
}

function init() {
  loadData()
    .then(([time, average]) => {
      Intro.init();
      Refresher.init();
      Time.init({ data: time });
      Average.init({ data: average });
      Report.init();
      Outro.init();
      d3.timeout(devStart, 100);
    })
    .catch(console.error);
}

init();
