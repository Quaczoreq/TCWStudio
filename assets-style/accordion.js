document.querySelectorAll('.feature-card').forEach(card => {
  const toggle = card.querySelector('.card-toggle');
  const content = card.querySelector('.card-content');

  if (toggle && content) {
    const updateToggleState = (expanded) => {
      card.setAttribute('aria-expanded', String(expanded));
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.textContent = expanded ? 'Less' : 'More';
      content.hidden = !expanded;
    };

    updateToggleState(card.getAttribute('aria-expanded') === 'true');

    toggle.addEventListener('click', () => {
      const expanded = card.getAttribute('aria-expanded') === 'true';
      updateToggleState(!expanded);
    });
  }
});
