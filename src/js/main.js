/* global d3 */
import '@babel/polyfill';
import './utils/render-d3-video';
import loadData from './load-data';
import ChartTime from './chart-time';
import ChartAverage from './chart-average';

const $main = d3.select('main');

window.renderStart = async ({ width, height }) => {
  $main.style('width', `${width}px`).style('height', `${height}px`);
  ChartTime.resize({ width, height });
  ChartAverage.resize({ width, height });
  await ChartAverage.run();
  await ChartTime.run();
};

function devStart() {
  if (window.currentTime === undefined)
    window.renderStart({ width: 1080, height: 1920 });
}

function init() {
  loadData()
    .then(([time, average]) => {
      ChartTime.init({ data: time });
      ChartAverage.init({ data: average });
      d3.timeout(devStart, 100);
    })
    .catch(console.error);
}

init();
