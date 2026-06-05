// News language filter
document.querySelectorAll('.cq-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const bar = btn.closest('.cq-filter-bar');
    bar.querySelectorAll('.cq-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    const grid = bar.nextElementSibling;
    if (!grid) return;

    grid.querySelectorAll('.cq-news-card').forEach(card => {
      const show = filter === 'all' || card.dataset.lang === filter;
      card.style.display = show ? 'flex' : 'none';
    });
  });
});
