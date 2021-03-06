/* global d3 WIDTH HEIGHT FONT_SIZE SQUARE */
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
import Question from './section-question';
import Fin from './section-fin';
import typer from './typer';

const $main = d3.select('main');

async function runAll() {
  const start = d3.now();
  await Intro.run();
  await Refresher.run();
  await Average.run();
  await Time.run();
  await Report.run();
  await Outro.run();
  await Question.run();
  // await Fin.run();
  const end = d3.now();
  const diff = end - start;
  const frames = (diff / 1000) * 60;
  console.log({ frames });
}

function setupSlide() {
  const sel = d3.select(this);
  slide({ sel, state: 'pre', dur: 0 });
  const $intertitle = sel.select('.intertitle');
  const $p = $intertitle.select('p');
  typer.prepare($p);
}

window.renderD3Video = async function renderD3Video({ width, height }) {
  window.WIDTH = width;
  window.HEIGHT = height;
  window.SQUARE = width === height;
  window.FONT_SIZE = Math.floor(width * 0.05);

  $main
    .style('width', `${width}px`)
    .style('height', `${height}px`)
    .style('font-size', `${FONT_SIZE}px`)
    .classed('is-square', SQUARE);

  d3.selectAll('section').each(setupSlide);

  Intro.resize();
  Refresher.resize();
  Time.resize();
  Average.resize();
  Report.resize();
  Outro.resize();
  Question.resize();
  Fin.resize();

  await flipbook.init();

  runAll();
  return true;
};

function devStart() {
  if (window.currentTime === undefined) {
    window.DEV = true;
    window.renderD3Video({ width: 1080, height: 1080 });
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
      Question.init();
      Fin.init();
      d3.timeout(devStart, 100);
    })
    .catch(console.error);
}

init();
