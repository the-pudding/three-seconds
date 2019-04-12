/* global d3 WIDTH HEIGHT FONT_SIZE */

export default function({ sel, state = 'pre', dur = 500 }) {
  return new Promise(resolve => {
    const h = sel.node().offsetHeight;
    let y = h;
    if (state === 'visible') y = 0;
    else if (state === 'exit') y = -h;
    const o = state === 'visible' ? 1 : 0;
    const e = state === 'visible' ? d3.easeCubicInOut : d3.easeCubicInOut;

    sel
      .transition()
      .duration(dur)
      .ease(e)
      .style('opacity', o)
      .style('transform', `translate(0px, ${y}px)`)
      .on('end', resolve);
  });
}
