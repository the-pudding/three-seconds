/* global d3 */
/* usage
	import loadData from './load-data'
	loadData().then(result => {

	}).catch(console.error)
*/

function loadA(file) {
  return new Promise((resolve, reject) => {
    d3.csv(`assets/data/${file}`)
      .then(result => {
        const clean = result.map(d => ({
          ...d,
          minute: +d.minute,
          count: +d.count,
        }));
        resolve(clean);
      })
      .catch(reject);
  });
}

function loadB(file) {
  return new Promise((resolve, reject) => {
    d3.csv(`assets/data/${file}`)
      .then(result => {
        const clean = result.map(d => ({
          ...d,
          average: +d.average,
        }));
        resolve(clean);
      })
      .catch(reject);
  });
}

export default function loadData() {
  const loads = [loadA('foul-time.csv'), loadB('foul-average.csv')];
  return Promise.all(loads);
}
