export default function(dur = 1) {
  return new Promise(resolve => d3.timeout(resolve, dur * 1000));
}
