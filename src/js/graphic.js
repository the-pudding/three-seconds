/* global d3 */
import loadData from './load-data';
import ChartTime from './chart-time';
import ChartAverage from './chart-average';

const WIDTH = 1080;
const HEIGHT = 1920;

const $main = d3.select('main');

function resize() {}

function init() {
  $main.style('width', `${WIDTH}px`).style('height', `${HEIGHT}px`);

  loadData()
    .then(([time, average]) => {
      ChartTime.init({ data: time, w: WIDTH, h: HEIGHT });
      ChartAverage.init({ data: average, w: WIDTH, h: HEIGHT });

      d3.timeout(ChartTime.reveal, 2000);
      d3.timeout(ChartAverage.reveal, 2000);
    })
    .catch(console.error);
}

export default { init, resize };
