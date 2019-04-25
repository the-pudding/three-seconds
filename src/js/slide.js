/* global d3, WIDTH, HEIGHT, FONT_SIZE */
export default function slide({ sel, state, dur = 500, early }) {
  return new Promise(resolve => {
    const ease = state === 'enter' ? d3.easeCubicOut : d3.easeCubicIn;
    const delay = state === 'enter' ? 250 : 0;
    let x = 0;
    let y = 0;
    if (state === 'exit') x = -WIDTH;
    else if (state === 'pre') y = HEIGHT;

    if (early) d3.timeout(resolve, early * dur);

    sel
      .transition()
      .duration(dur)
      .delay(delay)
      .ease(ease)
      .style('transform', `translate(${x}px, ${y}px)`)
      .on('end', () => {
        if (!early) d3.timeout(resolve, state === 'exit' ? 250 : 0);
      });
  });
}
