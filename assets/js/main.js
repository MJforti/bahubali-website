(function () {
  'use strict';
  var S = window.SITE || {};
  var $ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Contact links from config ---------- */
  function waUrl(msg) { return 'https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(msg || 'Hello Bahubali Enterprise, I have an enquiry.'); }
  // A contact route with no number is hidden, never shown as a dead or disabled button
  function disable(a) { a.removeAttribute('href'); a.hidden = true; }
  $('[data-contact]').forEach(function (a) {
    var t = a.getAttribute('data-contact');
    if (t === 'call') {
      if (S.phone) { a.href = 'tel:' + S.phone; if (a.hasAttribute('data-fill')) a.textContent = S.phone; }
      else disable(a, 'Phone number to be added');
    } else if (t === 'whatsapp') {
      if (S.whatsapp) { a.href = waUrl(a.getAttribute('data-msg')); a.target = '_blank'; a.rel = 'noopener'; }
      else disable(a, 'WhatsApp number to be added');
    } else if (t === 'email') {
      if (S.email) { a.href = 'mailto:' + S.email; a.textContent = S.email; } else a.hidden = true;
    }
  });
  $('[data-fill="address"]').forEach(function (el) { if (S.address) el.textContent = S.address; });
  $('[data-fill="hours"]').forEach(function (el) { el.textContent = S.hours || ''; });
  $('[data-row="hours"]').forEach(function (el) { if (!S.hours) el.hidden = true; });
  $('[data-row="email"]').forEach(function (el) { if (!S.email) el.hidden = true; });
  $('[data-row="phone"]').forEach(function (el) { if (!S.phone) el.hidden = true; });
  $('[data-row="whatsapp"]').forEach(function (el) { if (!S.whatsapp) el.hidden = true; });
  $('.alt').forEach(function (el) { if (!el.querySelector('a:not([hidden]), button')) el.hidden = true; });
  /* Photos: only files listed in SITE.photos are requested, so a missing image never shows as broken */
  var photos = S.photos || [];
  $('img[data-photo]').forEach(function (img) {
    var name = img.getAttribute('data-photo');
    if (photos.indexOf(name) === -1) { img.remove(); return; }
    var base = 'assets/img/photos/' + name;
    var frame = img.closest('[data-photo-frame]');
    img.addEventListener('load', function () { if (frame) frame.classList.add('has-photo'); });
    img.addEventListener('error', function () { img.remove(); });
    img.srcset = base + '-800.webp 800w, ' + base + '-1600.webp 1600w';
    img.sizes = name === 'hero' ? '(min-width: 1024px) 42vw, 100vw' : '(min-width: 1024px) 50vw, 100vw';
    img.src = base + '-1600.webp';
  });
  var mf = document.getElementById('map-frame'); if (mf && S.mapEmbed) mf.src = S.mapEmbed;
  var ml = document.getElementById('map-link'); if (ml && S.mapLink) ml.href = S.mapLink;
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.menu-toggle'), menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Partner form: closed until asked for, so the quotation form stays the main action ---------- */
  var pOpen = document.getElementById('partner-open'), pForm = document.getElementById('partner-form'), pGrid = document.getElementById('partner-grid');
  function openPartner(focus) {
    if (!pForm || !pForm.hidden) return;
    pForm.hidden = false; pForm.classList.add('in'); pGrid.classList.remove('closed');
    pOpen.hidden = true; pOpen.setAttribute('aria-expanded', 'true');
    if (focus) setTimeout(function () { document.getElementById('p-biz').focus({ preventScroll: true }); }, 50);
  }
  if (pOpen && pForm && pGrid) {
    pForm.hidden = true; pOpen.hidden = false; pGrid.classList.add('closed');
    pOpen.addEventListener('click', function () { openPartner(true); });
    $('a[href="#partner"]').forEach(function (a) { a.addEventListener('click', function () { openPartner(false); }); });
  }

  /* ---------- Category prefill ---------- */
  $('[data-category]').forEach(function (a) {
    a.addEventListener('click', function () {
      var ta = document.getElementById('q-req'); if (!ta) return;
      var line = 'Category: ' + a.getAttribute('data-category');
      if (ta.value.indexOf(line) === -1) ta.value = line + '\n' + ta.value;
      setTimeout(function () { ta.focus({ preventScroll: true }); ta.setSelectionRange(ta.value.length, ta.value.length); }, 50);
    });
  });

  /* ---------- Scroll reveal + nav current ---------- */
  var bar = document.querySelector('.action-bar'), heroCta = document.querySelector('.hero-actions .btn');
  if ('IntersectionObserver' in window) {
    // The mobile action bar appears only once the hero CTA has left the screen, so one CTA shows at a time
    if (bar && heroCta) new IntersectionObserver(function (es) { bar.classList.toggle('show', !es[0].isIntersecting); }).observe(heroCta);
    // Hide the bar while a form is on screen so it never covers fields or the submit button
    if (bar) {
      var onForm = new Set();
      var formIo = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) onForm.add(e.target); else onForm.delete(e.target); });
        bar.classList.toggle('near-form', onForm.size > 0);
      });
      $('form[data-form]').forEach(function (f) { formIo.observe(f); });
    }

    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    $('.reveal').forEach(function (el) { io.observe(el); });

    var links = $('.nav-links a');
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) {
          if (l.getAttribute('href') === '#' + e.target.id) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) { var t = document.querySelector(l.getAttribute('href')); if (t) spy.observe(t); });
  } else { $('.reveal').forEach(function (el) { el.classList.add('in'); }); if (bar) bar.classList.add('show'); }

  /* ---------- Tagline word reveal ---------- */
  var tag = document.getElementById('tagline');
  if (tag) {
    tag.innerHTML = tag.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    var words = $('.w', tag);
    if (reduce) words.forEach(function (w) { w.classList.add('on'); });
    else {
      var ticking = false;
      var update = function () {
        ticking = false;
        var r = tag.getBoundingClientRect(), vh = window.innerHeight;
        // progress runs from 0 when the text top reaches 85% of the viewport to 1 when its bottom reaches 45%
        var start = vh * 0.85, end = vh * 0.45;
        var p = (start - r.top) / ((start - end) + r.height);
        var n = Math.round(Math.max(0, Math.min(1, p)) * words.length);
        words.forEach(function (w, i) { if (i < n) w.classList.add('on'); });
      };
      window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      update();
    }
  }

  /* ---------- Forms ---------- */
  function validate(el) {
    var v = el.value.trim(), ok = true, type = el.getAttribute('data-type');
    if (el.required && !v) ok = false;
    else if (v && type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    else if (v && type === 'phone') ok = v.replace(/\D/g, '').length >= 10 && /^[+\d\s()-]+$/.test(v);
    var err = el.parentNode.querySelector('.err');
    el.setAttribute('aria-invalid', String(!ok));
    if (err) err.classList.toggle('show', !ok);
    return ok;
  }
  function showMsg(form, kind, html) {
    var box = form.querySelector('.form-msg');
    box.className = 'form-msg body-5 show ' + kind;
    box.innerHTML = '<i class="ph ' + (kind === 'error' ? 'ph-warning-circle' : 'ph-check-circle') + '" aria-hidden="true"></i><span>' + html + '</span>';
  }
  $('form[data-form]').forEach(function (form) {
    var fields = $('input:not([name="botcheck"]), select, textarea', form);
    fields.forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value || el.getAttribute('aria-invalid') === 'true') validate(el); });
      el.addEventListener('input', function () { if (el.getAttribute('aria-invalid') === 'true') validate(el); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = fields.filter(function (el) { return !validate(el); });
      if (bad.length) { showMsg(form, 'error', 'Please correct the highlighted fields and try again.'); bad[0].focus(); return; }
      if (form.botcheck && form.botcheck.value) return;
      var title = form.getAttribute('data-form');
      var lines = fields.filter(function (el) { return el.value.trim(); }).map(function (el) { return el.name + ': ' + el.value.trim(); });
      var text = title + ' via website\n\n' + lines.join('\n');
      var btn = form.querySelector('button[type="submit"]'), label = btn.textContent;
      var waLink = S.whatsapp ? ' <a href="' + waUrl(text) + '" target="_blank" rel="noopener">Send a copy on WhatsApp</a>.' : '';

      if (S.web3formsKey) {
        btn.disabled = true; btn.textContent = 'Sending';
        var data = { access_key: S.web3formsKey, subject: title + ' from the website', from_name: 'Bahubali Enterprise website' };
        fields.forEach(function (el) { if (el.value.trim()) data[el.name] = el.value.trim(); });
        fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
          .then(function (r) { return r.json(); })
          .then(function (j) {
            if (!j.success) throw new Error();
            form.reset(); showMsg(form, 'success', title + ' sent. We will contact you on the phone number you provided.' + waLink);
          })
          .catch(function () { showMsg(form, 'error', 'Your enquiry could not be sent. Check your connection and try again.' + waLink); })
          .then(function () { btn.disabled = false; btn.textContent = label; });
      } else if (S.whatsapp) {
        window.open(waUrl(text), '_blank', 'noopener');
        showMsg(form, 'success', 'Your enquiry is ready in WhatsApp. Press send there to deliver it. <a href="' + waUrl(text) + '" target="_blank" rel="noopener">Open WhatsApp again</a>.');
      } else {
        showMsg(form, 'error', 'This form is not connected yet, so your enquiry was not sent. Please visit us using the map in the contact section.');
      }
    });
  });
})();
