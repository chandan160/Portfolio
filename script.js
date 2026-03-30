/* ============================================================
   CHANDAN SINGH — AI RESEARCHER PORTFOLIO
   script.js — FIX v2: cursor hidden until first mousemove
   ============================================================ */

'use strict';

/* ── CUSTOM CURSOR ──
   Both elements start at opacity:0 in CSS.
   They only become visible after the first real mousemove,
   which also seeds the ring position so it never flies in from 0,0.
---------------------------------------------------------------- */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let hasMoved = false;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Snap dot to exact cursor position
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    // On very first move: reveal both elements and seed ring position
    if (!hasMoved) {
      hasMoved = true;
      ringX = mouseX;
      ringY = mouseY;
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    }
  });

  // Animate ring with smooth lag
  function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Grow ring on hover over interactive elements
  document.querySelectorAll('a, button, .project-card, .pub-card, .skill-category').forEach(function(el) {
    el.addEventListener('mouseenter', function() { ring.classList.add('hovered'); });
    el.addEventListener('mouseleave', function() { ring.classList.remove('hovered'); });
  });

  // Hide when mouse leaves the browser window entirely
  document.addEventListener('mouseleave', function() {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  // Restore only if we've already moved (prevents flash before first move)
  document.addEventListener('mouseenter', function() {
    if (hasMoved) {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
    }
  });
})();


/* ── TYPING ANIMATION ── */
(function initTyping() {
  var el = document.getElementById('typingText');
  if (!el) return;

  var phrases = [
    'AI Researcher',
    'Medical AI Specialist',
    'Deep Learning Engineer',
    'Generative AI Researcher',
    'Computer Vision Expert'
  ];

  var phraseIdx = 0, charIdx = 0, deleting = false, waiting = false;

  function tick() {
    var current = phrases[phraseIdx];
    if (deleting) {
      el.textContent = current.substring(0, charIdx--);
    } else {
      el.textContent = current.substring(0, charIdx++);
    }

    var delay = deleting ? 45 : 85;

    if (!deleting && charIdx === current.length + 1) {
      if (waiting) { deleting = true; waiting = false; delay = 1500; }
      else { waiting = true; delay = 100; }
    } else if (deleting && charIdx < 0) {
      deleting = false; charIdx = 0;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 800);
})();


/* ── NAVBAR SCROLL & ACTIVE LINK ── */
(function initNavbar() {
  var navbar   = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('section[id]');

  function update() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    var current = '';
    sections.forEach(function(s) {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach(function(l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ── HAMBURGER MENU ── */
(function initHamburger() {
  var btn   = document.getElementById('hamburger');
  var links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', function() {
    btn.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('.nav-link').forEach(function(l) {
    l.addEventListener('click', function() {
      btn.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();


/* ── CV MODAL ── */
(function initModal() {
  var modal    = document.getElementById('cvModal');
  var chipBtn  = document.getElementById('cvChipBtn');
  var closeBtn = document.getElementById('modalClose');
  var dlBtn    = document.getElementById('cvPreviewBtn');

  function open()  { modal.classList.add('open');    document.body.style.overflow = 'hidden'; }
  function close() { modal.classList.remove('open'); document.body.style.overflow = ''; }

  if (chipBtn) chipBtn.addEventListener('click', open);
  if (dlBtn)   dlBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (modal) {
    modal.addEventListener('click', function(e) { if (e.target === modal) close(); });
  }
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') close(); });
})();


/* ── SCROLL REVEAL ── */
(function initReveal() {
  var selectors = [
    '.about-text', '.about-aside',
    '.project-card', '.pub-card',
    '.timeline-item', '.skill-category',
    '.edu-card', '.contact-left', '.contact-right',
    '.info-card', '.focus-card'
  ];

  selectors.forEach(function(sel) {
    document.querySelectorAll(sel).forEach(function(el, i) {
      el.classList.add('reveal');
      if (i % 3 === 1) el.classList.add('reveal-delay-1');
      if (i % 3 === 2) el.classList.add('reveal-delay-2');
    });
  });

  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
})();


/* ── SKILL BAR ANIMATION ── */
(function initSkillBars() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.getAttribute('data-width') + '%';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-fill').forEach(function(bar) { obs.observe(bar); });
})();


/* ── PROJECT FILTER ── */
(function initFilter() {
  var btns  = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.project-card');

  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      btns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      cards.forEach(function(card) {
        var show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
})();


/* ── BACK TO TOP ── */
(function initBackToTop() {
  var btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', function() {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ── FOOTER YEAR ── */
(function() {
  var el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ── CONTACT FORM (frontend only) ── */
async function handleFormSubmit() {
  var name  = (document.getElementById('fname')  || {}).value || '';
  var email = (document.getElementById('femail') || {}).value || '';
  var msg   = (document.getElementById('fmsg')   || {}).value || '';
  var note  = document.getElementById('formNote');
  var btn   = document.getElementById('sendBtn');

  name = name.trim(); email = email.trim(); msg = msg.trim();

  if (!name || !email || !msg) {
    note.textContent = '⚠ Please fill in all fields.';
    note.style.color = '#fb923c';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    note.textContent = '⚠ Please enter a valid email.';
    note.style.color = '#fb923c';
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span>Sending...</span><i class="fa-solid fa-spinner fa-spin"></i>';

  try {
    const response = await fetch('https://formspree.io/f/xojpdejy', { // 👈 replace with your ID
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, message: msg })
    });

    if (response.ok) {
      note.textContent = '✓ Message sent! I\'ll get back to you soon.';
      note.style.color = 'var(--accent-cyan)';
      document.getElementById('fname').value  = '';
      document.getElementById('femail').value = '';
      document.getElementById('fmsg').value   = '';
    } else {
      note.textContent = '✗ Something went wrong. Please try again.';
      note.style.color = '#fb923c';
    }
  } catch (err) {
    note.textContent = '✗ Network error. Please try again.';
    note.style.color = '#fb923c';
  }

  btn.disabled = false;
  btn.innerHTML = '<span>Send Message</span><i class="fa-solid fa-paper-plane"></i>';
}



/* ── SMOOTH SCROLL POLYFILL ── */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
