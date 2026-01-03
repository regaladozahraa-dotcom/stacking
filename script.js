(() => {
  const stackEl = document.getElementById('stack');
  const cards = Array.from(stackEl.querySelectorAll('.card'));

  // Logical stack order: index 0 is the top card
  let stack = cards.slice().reverse();
  let busy = false;

  function render() {
    stack.forEach((card, i) => {
      const depth = i; // 0 top, increasing down
      const ty = depth * 8; // vertical offset
      const scale = 1 - depth * 0.02;
      const rot = -depth * 1.2;
      card.style.transform = `translateY(${ty}px) scale(${scale}) rotate(${rot}deg)`;
      card.style.zIndex = String(1000 - i);
      card.style.opacity = String(Math.max(0.88, 1 - i * 0.02));
      if (i === 0) {
        card.classList.add('top');
        card.style.pointerEvents = 'auto';
      } else {
        card.classList.remove('top');
        card.style.pointerEvents = 'none';
      }
    });
  }

  function sendTopToBack() {
    if (busy) return;
    busy = true;
    const top = stack[0];

    // animate top moving out to the right
    top.style.transition = 'transform 520ms cubic-bezier(.2,.9,.2,1), opacity 420ms ease';
    requestAnimationFrame(() => {
      top.style.transform = 'translateX(120%) rotate(18deg) scale(.98)';
      top.style.opacity = '0';
    });

    const onEnd = (ev) => {
      // Ensure we only react once for transform (could be called multiple times)
      if (ev.propertyName !== 'transform') return;
      top.removeEventListener('transitionend', onEnd);
      // Move top card to back of logical stack
      stack.shift();
      stack.push(top);
      // Reset inline styles so render can set proper transforms
      top.style.transition = '';
      top.style.opacity = '';
      busy = false;
      render();
    };

    top.addEventListener('transitionend', onEnd);
  }

  // click delegator: only respond if top card clicked
  stackEl.addEventListener('click', (e) => {
    const target = e.target.closest('.card');
    if (!target) return;
    if (target === stack[0]) sendTopToBack();
  });

  // initial render
  render();
})();
