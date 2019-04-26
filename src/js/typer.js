function reveal(sel) {
  return new Promise((resolve, reject) => {
    const $span = sel.selectAll('span');
    const firstBB = $span.node().getBoundingClientRect();
    const base = firstBB.top;
    const h = firstBB.height;
    const id = d3.select(sel.node().parentNode.parentNode).attr('id');
    const extra = id === 'report' ? 1000 : 0;
    $span
      .transition()
      .duration(300)
      .delay((d, i, n) => {
        const { top } = n[i].getBoundingClientRect();
        const off = (top - base) / h;
        const html = d3.select(n[i]).html();
        const hasEm = html.includes('<em>') && !extra;
        const hi = hasEm && id !== 'question' ? 1500 : 0;
        return (i > 1 ? extra : 0) + hi + off * 250;
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
