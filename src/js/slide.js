/* global d3, WIDTH, HEIGHT, FONT_SIZE */
export default function slide({ sel, state, dur = 500 }) {
  return new Promise(resolve => {
    const e = state === 'enter' ? d3.easeCubicOut : d3.easeCubicIn;
    let x = 0;
    let y = 0;
    if (state === 'exit') x = -WIDTH;
    else if (state === 'pre') y = HEIGHT;

    sel
      .transition()
      .duration(dur)
      .ease(e)
      .style('transform', `translate(${x}px, ${y}px)`)
      .on('end', resolve);
  });
}
