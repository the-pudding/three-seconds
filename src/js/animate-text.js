export default function({ sel, visible = false, dur = 500 }) {
  return new Promise(resolve => {
    const h = sel.node().offsetHeight;
    const y = visible ? -h / 2 : 0;
    const o = visible ? 1 : 0;
    const e = visible ? d3.easeCubicOut : d3.easeCubicIn;

    sel
      .transition()
      .duration(dur)
      .ease(e)
      .style('opacity', o)
      .style('transform', `translate(0, ${y}px)`)
      .on('end', resolve);
  });
}
