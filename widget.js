(function () {
  const script = document.currentScript;
  const API = (script && script.dataset.api) || '';
  const store = (script && script.dataset.store) || 'Support';
  const css = document.createElement('link');
  css.rel = 'stylesheet'; css.href = (script ? script.src.replace('widget.js', 'widget.css') : 'widget.css');
  document.head.appendChild(css);

  const launch = el('button', { id: 'sp-launch', 'aria-label': 'Open support chat' }, 'Chat');
  const panel = el('section', { id: 'sp-panel', role: 'dialog', 'aria-label': 'Customer support chat' });
  const head = el('div', { id: 'sp-head' }, store + ' support');
  head.appendChild(el('small', {}, 'Ask about orders, returns or products'));
  const log = el('div', { id: 'sp-log', 'aria-live': 'polite' });
  const form = el('form', { id: 'sp-form' });
  const input = el('input', { id: 'sp-input', placeholder: 'Type your message', maxlength: 1000, 'aria-label': 'Message', autocomplete: 'off' });
  const send = el('button', { id: 'sp-send', type: 'submit' }, 'Send');
  form.append(input, send); panel.append(head, log, form);
  document.body.append(launch, panel);

  let conversationId = sessionStorage.getItem('sp-conv');
  let busy = false;
  add('bot', "Hi, I can track an order, explain our policies or suggest products. What do you need?");

  launch.onclick = () => { panel.classList.toggle('open'); if (panel.classList.contains('open')) input.focus(); };
  form.onsubmit = async (e) => {
    e.preventDefault();
    const text = input.value.trim(); if (!text || busy) return;
    input.value = ''; add('me', text); busy = true;
    const typing = add('bot sp-typing', 'Typing…');
    try {
      const r = await fetch(API + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationId }) });
      const data = await r.json();
      typing.remove();
      if (!r.ok) return add('bot', data.error || 'Something went wrong. Please try again.');
      conversationId = data.conversationId; sessionStorage.setItem('sp-conv', conversationId);
      add('bot', data.reply);
      if (data.escalated) add('note', 'A human agent has joined this conversation.');
    } catch { typing.remove(); add('bot', "I can't reach support right now. Please check your connection and try again."); }
    finally { busy = false; input.focus(); }
  };

  function add(kind, text) {
    const cls = kind.split(' ').map(k => 'sp-' + k.replace(/^sp-/, '')).join(' ');
    const m = el('div', { class: 'sp-msg ' + cls }, text);
    log.appendChild(m); log.scrollTop = log.scrollHeight; return m;
  }
  function el(tag, attrs, text) {
    const n = document.createElement(tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = text;          // textContent only: no HTML injection
    return n;
  }
})();
