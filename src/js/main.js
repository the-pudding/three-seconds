/* global d3 */
import '@babel/polyfill';
import './utils/render-d3-video';
import loadData from './load-data';
import Intro from './section-intro';
import Refresher from './section-refresher';
import Time from './section-time';
import Average from './section-average';
import Report from './section-report';
import Outro from './section-outro';

const $main = d3.select('main');

window.renderStart = async ({ width, height }) => {
  const fontSize = Math.floor(width * 0.05);
  $main
    .style('width', `${width}px`)
    .style('height', `${height}px`)
    .style('font-size', `${fontSize}px`);

  Intro.resize({ width, height });
  Refresher.resize({ width, height });
  Time.resize({ width, height });
  Average.resize({ width, height });
  Report.resize({ width, height });
  Outro.resize({ width, height });
  await Intro.run();
  await Refresher.run();
  await Average.run();
  await Time.run();
  // await Report.run();
  // await Outro.run();
};

function devStart() {
  if (window.currentTime === undefined)
    window.renderStart({ width: 1080, height: 1920 });
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
