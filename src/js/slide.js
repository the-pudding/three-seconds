export default function slide({ sel, state, dur = 500 }) {
  return new Promise(resolve => {
    const e = state === 'enter' ? d3.easeCubicOut : d3.easeCubicIn;
    let x = 0;
    if (state === 'exit') x = -window.WIDTH;
    else if (state === 'pre') x = window.WIDTH;

    sel
      .transition()
      .duration(dur)
      .ease(e)
      // .style('opacity', o)
      .style('transform', `translate(${x}px, 0)`)
      .on('end', resolve);
  });
}
