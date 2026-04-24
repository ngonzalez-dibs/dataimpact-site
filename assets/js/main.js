  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "theme": "light",
    "h1Variant": 1,
    "accent": "#2E5597"
  }/*EDITMODE-END*/;

  let state = { ...TWEAK_DEFAULTS };

  // ==== Scroll nav ====
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ==== Reveal on scroll ====
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ==== Populate calendar slots ====
  (() => {
    const slots = document.getElementById('slots');
    const days = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'LUN'];
    const dates = ['22', '23', '24', '25', '26', '29'];
    const times = ['10:00', '11:30', '15:00', '16:30', '10:00', '14:00'];
    slots.innerHTML = days.map((d,i) =>
      `<button class="slot" type="button"><div class="d">${d} ${dates[i]}</div><div class="h">${times[i]}</div></button>`
    ).join('');
  })();

  // ==== Form ====
  const form = document.getElementById('contact-form');
  const btn = document.getElementById('submit-btn');
  const btnText = document.getElementById('submit-text');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    btn.disabled = true;
    btnText.textContent = 'Enviando…';
    const body = new URLSearchParams(new FormData(form)).toString();
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      btn.classList.add('sent');
      btnText.textContent = 'Mensaje enviado ✓';
      form.reset();
    } catch (err) {
      btnText.textContent = 'Error, intenta de nuevo';
    }
    setTimeout(() => {
      btn.classList.remove('sent');
      btn.disabled = false;
      btnText.textContent = 'Enviar mensaje';
    }, 3500);
  });

  // ==== Tweaks ====
  const tweaksPanel = document.getElementById('tweaks');
  function applyTheme(t) {
    if (t === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', t);
    }
    document.querySelectorAll('#theme-seg button').forEach(b => {
      b.classList.toggle('on', b.dataset.themeSet === t);
    });
  }
  function applyH1(idx) {
    const opts = document.querySelectorAll('.h1-opt');
    if (opts[idx]) {
      document.getElementById('hero-h1').innerHTML = opts[idx].dataset.h1;
      opts.forEach((o,i) => o.classList.toggle('on', i === idx));
    }
  }
  function applyAccent(color) {
    document.documentElement.style.setProperty('--blue', color);
    document.querySelectorAll('.sw').forEach(sw => sw.classList.toggle('on', sw.dataset.accent === color));
  }
  function applyAll(s) {
    applyTheme(s.theme);
    applyH1(s.h1Variant);
    applyAccent(s.accent);
  }

  document.querySelectorAll('#theme-seg button').forEach(b => {
    b.addEventListener('click', () => {
      state.theme = b.dataset.themeSet;
      applyTheme(state.theme);
      persist();
    });
  });
  document.querySelectorAll('.h1-opt').forEach((b, i) => {
    b.addEventListener('click', () => {
      state.h1Variant = i;
      applyH1(i);
      persist();
    });
  });
  document.querySelectorAll('.sw').forEach(sw => {
    sw.addEventListener('click', () => {
      state.accent = sw.dataset.accent;
      applyAccent(state.accent);
      persist();
    });
  });
  document.getElementById('tweaks-close').addEventListener('click', () => {
    tweaksPanel.classList.remove('on');
  });

  function persist() {
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: state }, '*');
    } catch(e) {}
  }

  // Edit-mode protocol — register listener first, then announce
  window.addEventListener('message', (e) => {
    const d = e.data || {};
    if (d.type === '__activate_edit_mode') tweaksPanel.classList.add('on');
    if (d.type === '__deactivate_edit_mode') tweaksPanel.classList.remove('on');
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(e) {}

  // Keyboard shortcut: Ctrl/Cmd + Shift + T toggles the tweaks panel
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'T' || e.key === 't')) {
      e.preventDefault();
      tweaksPanel.classList.toggle('on');
    }
  });

  // Apply initial state
  applyAll(state);

  // ==== Scroll progress bar ====
  const prog = document.getElementById('scroll-progress');
  if (prog) {
    function upd(){
      const h = document.documentElement;
      const pct = (h.scrollTop || document.body.scrollTop) / ((h.scrollHeight - h.clientHeight) || 1) * 100;
      prog.style.width = Math.max(0, Math.min(100, pct)) + '%';
    }
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  // ==== ROI calculator ====
  (function(){
    const p = document.getElementById('roi-people');
    const h = document.getElementById('roi-hours');
    const r = document.getElementById('roi-rate');
    if (!p || !h || !r) return;
    const fmtCLP = n => '$' + Math.round(n).toLocaleString('es-CL');
    const fmtCLPM = n => {
      if (n >= 1e6) return '$' + (n/1e6).toFixed(1).replace('.',',') + 'M';
      return '$' + Math.round(n/1000) + 'K';
    };
    function calc(){
      const people = +p.value, hours = +h.value, rate = +r.value;
      document.getElementById('roi-people-v').textContent = people;
      document.getElementById('roi-hours-v').textContent = hours;
      document.getElementById('roi-rate-v').textContent = fmtCLP(rate);
      const hm = people * hours * 4.3;
      const ca = hm * rate * 12;
      const save = ca * 0.7;
      document.getElementById('roi-hm').textContent = Math.round(hm) + ' h';
      document.getElementById('roi-ca').textContent = fmtCLPM(ca);
      document.getElementById('roi-save').textContent = fmtCLPM(save) + ' / año';
    }
    [p,h,r].forEach(el => el.addEventListener('input', calc));
    calc();
  })();

  // ==== Case filters ====
  (function(){
    const btns = document.querySelectorAll('.cf');
    const cases = document.querySelectorAll('#cases-grid .case');
    if (!btns.length) return;
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      const s = b.dataset.sector;
      cases.forEach(c => {
        const match = s === 'all' || c.dataset.sector === s;
        c.classList.toggle('hide', !match);
      });
    }));
  })();

  // ==== Hero KPI rotator ====
  (function(){
    const sets = [
      // Set 1 — Horas & ahorro
      {a:['+1.200 h','▲ por equipo','liberadas al año'], b:['−70%','▼ vs. manual','tiempo de reporte'], c:['$14M','▲ año','ahorro estimado']},
      // Set 2 — Velocidad & confiabilidad
      {a:['3×','▲ vs. antes','cierre contable'],         b:['<2s','● real-time','refresh BI ejecutivo'], c:['96%','● 24/7','uptime del pipeline']},
      // Set 3 — Escala & adopción
      {a:['+1.200 h','▲ por equipo','SKUs clasificados'],       b:['85%','▲ 21 pts','match automático'],      c:['92%','▲ 14 pts','adopción tablero']}
    ];
    let i = 0;
    const kpi = document.getElementById('hv-kpi-rotator');
    if (!kpi) return;
    setInterval(() => {
      i = (i+1) % sets.length;
      const set = sets[i];
      const ks = kpi.querySelectorAll('.k');
      ks.forEach(k => k.classList.add('flip'));
      setTimeout(() => {
        ks.forEach(k => {
          const vEl = k.querySelector('[data-k]');
          const key = vEl && vEl.dataset.k;
          if (!key || !set[key]) return;
          const [v, t, l] = set[key];
          vEl.textContent = v;
          const tEl = k.querySelector('.t');
          const lEl = k.querySelector('.l');
          if (tEl) tEl.textContent = t;
          if (lEl) lEl.textContent = l;
        });
        ks.forEach(k => k.classList.remove('flip'));
      }, 350);
    }, 4000);
  })();


  // ==== Case detail modal ====
  (function(){
    const modal = document.getElementById('case-modal');
    const body = document.getElementById('case-modal-body');
    const tag = document.getElementById('case-modal-tag');
    if (!modal || !modal.showModal) return;

    function openCase(caseEl) {
      const detail = caseEl.querySelector('.case-detail');
      if (!detail) return;
      const sector = caseEl.querySelector('.case-sector');
      const num = caseEl.querySelector('.case-num');
      tag.textContent = (sector ? sector.textContent.trim() : '') +
                        (num ? '  ·  ' + num.textContent.trim() : '');
      body.innerHTML = detail.innerHTML;
      modal.showModal();
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.close();
      document.body.style.overflow = '';
    }

    document.querySelectorAll('#cases-grid .case').forEach(c => {
      c.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        openCase(c);
      });
      c.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCase(c);
        }
      });
    });

    modal.querySelector('.case-modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const inDialog = e.clientX >= rect.left && e.clientX <= rect.right &&
                       e.clientY >= rect.top  && e.clientY <= rect.bottom;
      if (!inDialog) closeModal();
    });
    modal.addEventListener('close', () => { document.body.style.overflow = ''; });
  })();
