/* Bahubali Enterprises storefront in 3D, built from layered CSS planes (no WebGL library).
   Drag with a mouse or finger, or use the arrow keys, to turn it. */
(function () {
  'use strict';
  var stage = document.getElementById('store3d');
  if (!stage) return;
  var probe = document.createElement('div').style;
  if (!('transformStyle' in probe) && !('webkitTransformStyle' in probe)) return; // keep the flat image

  var IMG = 'assets/img/store/';
  var W = 544, H = 740, D = 220;     // building width, height, depth in model px
  var SIGN_H = 353, SIGN_D = 34;     // signboard box projects over the shop front
  var zF = 60;                       // front wall depth relative to the turning point
  var zS = zF + SIGN_D;

  var model = document.createElement('div');
  model.className = 's3-model';

  function face(cls, x, y, w, h, z, extra, origin, bg) {
    var el = document.createElement('div');
    el.className = 's3-face ' + cls;
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    if (origin) el.style.transformOrigin = origin;
    el.style.transform = 'translate3d(' + (x - W / 2) + 'px,' + (y - H / 2) + 'px,' + z + 'px)' + (extra || '');
    if (bg) el.style.backgroundImage = 'url(' + IMG + bg + ')';
    model.appendChild(el);
    return el;
  }

  // Ground and floor slab
  face('s3-shadow', -30, H + 1, W + 60, D + 60, zF - D - 20, ' rotateX(90deg)', 'top center');
  face('s3-plinth', -24, H, W + 48, D + 70, zF - D, ' rotateX(90deg)', 'top center');
  face('s3-plinth-edge', -24, H, W + 48, 10, zF + 70, '', null);

  // Building body
  face('s3-roof', 0, -D, W, D, zF, ' rotateX(90deg)', 'bottom center');
  face('s3-side s3-side-upper', W, 0, D, SIGN_H, zF, ' rotateY(90deg)', 'left center');
  face('s3-side s3-side-lower', W, SIGN_H, D, H - SIGN_H, zF, ' rotateY(90deg)', 'left center');
  face('s3-side s3-side-upper s3-left', -D, 0, D, SIGN_H, zF, ' rotateY(-90deg)', 'right center');
  face('s3-side s3-side-lower s3-left', -D, SIGN_H, D, H - SIGN_H, zF, ' rotateY(-90deg)', 'right center');
  face('s3-front', 0, SIGN_H, W, H - SIGN_H, zF, '', null, 'ground.webp');

  // Signboard box
  face('s3-sign-top', 0, -SIGN_D, W, SIGN_D, zS, ' rotateX(90deg)', 'bottom center');
  face('s3-sign-soffit', 0, SIGN_H, W, SIGN_D, zS, ' rotateX(-90deg)', 'top center');
  face('s3-sign-side', W, 0, SIGN_D, SIGN_H, zS, ' rotateY(90deg)', 'left center');
  face('s3-sign-side', -SIGN_D, 0, SIGN_D, SIGN_H, zS, ' rotateY(-90deg)', 'right center');
  face('s3-sign', 0, 0, W, SIGN_H, zS, '', null, 'sign-front.webp');

  // Category boards, raised off the signboard
  var cols = [[40, 133], [157, 251], [289, 421], [447, 539]];
  var rows = [[205, 247], [254, 296], [303, 345]];
  var i = 0;
  rows.forEach(function (r) {
    cols.forEach(function (c) {
      var x = c[0] - 1 - 12, y = r[0] - 1 - 5, w = c[1] - c[0] + 2, h = r[1] - r[0] + 2;
      face('s3-board-edge', x, y + h, w, 6, zS + 6, ' rotateX(-90deg)', 'top center');
      face('s3-board-edge s3-board-edge-side', x + w, y, 6, h, zS + 6, ' rotateY(90deg)', 'left center');
      face('s3-board', x, y, w, h, zS + 6, '', null, 'board-' + i + '.webp');
      i++;
    });
  });

  // Stand-off letters
  face('s3-letters', 0, 55, W, 143, zS + 18, '', null, 'letters.webp');

  // Assamese name banner, a shallow box over the shop front
  face('s3-banner-edge', 0, 360 + 65, 350, 14, zF + 14, ' rotateX(-90deg)', 'top center');
  face('s3-banner-edge', 350, 360, 14, 65, zF + 14, ' rotateY(90deg)', 'left center');
  face('s3-banner', 0, 360, 350, 65, zF + 14, '', null, 'banner.webp');

  stage.appendChild(model);
  stage.classList.add('is-3d');

  // ---- Sizing ----
  var scale = 1, shiftY = 0;
  function fit() {
    var r = stage.getBoundingClientRect();
    var top = window.innerWidth >= 1024 ? 96 : 0;
    scale = Math.min((r.width * 0.62) / W, ((r.height - top) * 0.7) / (H + 60));
    shiftY = top / 2;
    apply();
  }

  // ---- Interaction ----
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ry = -22, rx = -6, vy = 0, targetY = -22, targetX = -6;
  var dragging = false, lastX = 0, lastY = 0, lastMove = 0, idleSince = performance.now(), running = false, visible = true;
  var MIN_Y = -42, MAX_Y = 42, MIN_X = -14, MAX_X = 10;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function apply() {
    model.style.transform = 'translateY(' + (shiftY - 10 * scale) + 'px) scale(' + scale + ') rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
  }

  function tick(t) {
    running = false;
    if (!visible) return;
    if (!dragging) {
      if (Math.abs(vy) > 0.02) { targetY = clamp(targetY + vy, MIN_Y, MAX_Y); vy *= 0.92; }
      else if (!reduce && t - idleSince > 2500) { targetY = -22 + Math.sin((t - idleSince - 2500) / 2600) * 16; }
    }
    ry += (targetY - ry) * 0.12;
    rx += (targetX - rx) * 0.12;
    apply();
    if (dragging || Math.abs(targetY - ry) > 0.05 || Math.abs(targetX - rx) > 0.05 || Math.abs(vy) > 0.02 || (!reduce && performance.now() - idleSince > 2500)) loop();
  }
  function loop() { if (!running) { running = true; requestAnimationFrame(tick); } }

  stage.addEventListener('pointerdown', function (e) {
    dragging = true; lastX = e.clientX; lastY = e.clientY; lastMove = performance.now(); vy = 0;
    stage.classList.add('is-dragging');
    if (e.pointerType === 'mouse') stage.setPointerCapture(e.pointerId);
    loop();
  });
  stage.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    var dx = e.clientX - lastX, dy = e.clientY - lastY, now = performance.now();
    lastX = e.clientX; lastY = e.clientY;
    targetY = clamp(targetY + dx * 0.32, MIN_Y, MAX_Y);
    if (e.pointerType === 'mouse') targetX = clamp(targetX - dy * 0.18, MIN_X, MAX_X);
    vy = (dx * 0.32) / Math.max(1, (now - lastMove) / 16);
    lastMove = now; idleSince = now;
    loop();
  });
  function end() {
    if (!dragging) return;
    dragging = false; idleSince = performance.now();
    stage.classList.remove('is-dragging');
    if (performance.now() - lastMove > 80) vy = 0;
    loop();
  }
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  stage.addEventListener('lostpointercapture', end);
  stage.addEventListener('keydown', function (e) {
    var step = { ArrowLeft: [-8, 0], ArrowRight: [8, 0], ArrowUp: [0, 4], ArrowDown: [0, -4] }[e.key];
    if (!step) return;
    e.preventDefault();
    targetY = clamp(targetY + step[0], MIN_Y, MAX_Y);
    targetX = clamp(targetX + step[1], MIN_X, MAX_X);
    idleSince = performance.now() + 4000; vy = 0;
    loop();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) loop(); }).observe(stage);
  }
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(stage); else window.addEventListener('resize', fit);
  fit();
  loop();
})();
