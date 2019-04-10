/* global d3 WIDTH HEIGHT FONT_SIZE */

export default function({ sel, visible = false, dur = 500 }) {
  return new Promise(resolve => {
    const h = sel.node().offsetHeight;
    const y = visible ? -WIDTH * 0.025 : 0;
    const o = visible ? 1 : 0;
    const e = visible ? d3.easeCubicOut : d3.easeCubicIn;

    sel
      .transition()
      .duration(dur)
      .ease(e)
      .style('opacity', o)
      .style('transform', `translate(0px, ${y}px)`)
      .on('end', resolve);
  });
}
