document.querySelectorAll('.feature-card').forEach(card => {
  const toggle = card.querySelector('.card-toggle');
  const content = card.querySelector('.card-content');
  if (toggle && content) {
    toggle.addEventListener('click', () => {
      const expanded = card.getAttribute('aria-expanded') === 'true';
      card.setAttribute('aria-expanded', !expanded);
      toggle.setAttribute('aria-expanded', !expanded);
      if (expanded) {
        content.hidden = true;
      } else {
        content.hidden = false;
      }
    });
  }
});
