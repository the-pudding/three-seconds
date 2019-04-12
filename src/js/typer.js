function reveal(sel) {
  return new Promise((resolve, reject) => {
    const $span = sel.selectAll('span');
    const firstBB = $span.node().getBoundingClientRect();
    const base = firstBB.top;
    const h = firstBB.height;
    $span
      .transition()
      .duration(200)
      .delay((d, i, n) => {
        const { top } = n[i].getBoundingClientRect();
        const off = (top - base) / h;
        return off * 100;
      })
      .ease(d3.easeCubicOut)
      .style('opacity', 1)
      .style('transform', `translate(0, -${h / 2}px)`)
      .on('end', (d, i) => {
        if (i === $span.size() - 1) resolve();
      });
  });
}

function prepare(sel) {
  if (!sel.size()) return false;

  const html = sel
    .html()
    .split(' ')
    .map(d => `<span>${d}</span>`)
    .join(' ');

  sel.html(html);

  return true;
}

export default { reveal, prepare };
