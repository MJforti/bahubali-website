/* Bahubali Enterprises storefront in 3D, built from layered CSS planes (no WebGL library).
   Drag with a mouse or finger, or use the arrow keys, to turn it.
   Every face carries a surface normal; as the model turns, each face is shaded against a fixed
   key light, so walls, reveals and the signboard catch and lose light like real surfaces. */
(function () {
  'use strict';
  var stage = document.getElementById('store3d');
  if (!stage) return;
  var probe = document.createElement('div').style;
  if (!('transformStyle' in probe) && !('webkitTransformStyle' in probe)) return; // keep the flat photo

  var IMG = 'assets/img/store/';
  var W = 544, H = 740, D = 220;      // building width, height, depth
  var SIGN_H = 353, SIGN_D = 34;      // signboard box projects over the shop front
  var LINTEL = 72;                    // banner band above the shop opening
  var R = 44;                         // depth of the recessed shop opening
  var PIL = 18, PIL_D = 8;            // cladding pillars either side of the opening
  var zF = 70, zS = zF + SIGN_D;      // front wall and signboard depth relative to the pivot
  var yO = SIGN_H + LINTEL;           // top of the shop opening
  var faces = [];

  var model = document.createElement('div');
  model.className = 's3-model';

  // face(class, x, y, w, h, z, rotation, origin, normal [x,y,z], background options)
  function face(cls, x, y, w, h, z, rot, origin, n, bg) {
    var el = document.createElement('div');
    el.className = 's3-face ' + cls;
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    if (origin) el.style.transformOrigin = origin;
    el.style.transform = 'translate3d(' + (x - W / 2) + 'px,' + (y - H / 2) + 'px,' + z + 'px)' + (rot || '');
    if (bg) {
      el.style.backgroundImage = 'url(' + IMG + bg.src + ')';
      if (bg.size) el.style.backgroundSize = bg.size;
      if (bg.pos) el.style.backgroundPosition = bg.pos;
      if (bg.repeat) el.style.backgroundRepeat = 'repeat';
    }
    model.appendChild(el);
    if (n) faces.push({ el: el, n: n });
    return el;
  }
  var FRONT = [0, 0, 1], RIGHT = [1, 0, 0], LEFT = [-1, 0, 0], UP = [0, -1, 0], DOWN = [0, 1, 0];
  var panel = { src: 'tex-panel.webp', size: '128px 128px', repeat: true };
  var plaster = { src: 'tex-plaster.webp', size: '160px 160px', repeat: true };
  var concrete = { src: 'tex-concrete.webp', size: '96px 96px', repeat: true };
  var wood = { src: 'tex-wood.webp', size: '128px 128px', repeat: true };
  function ground(x0, y0) { return { src: 'ground.webp', size: W + 'px 387px', pos: (-x0) + 'px ' + (-y0) + 'px' }; }

  // ---- Pavement, kerb and contact shadow ----
  var padF = 96;
  face('s3-pave', -48, H, W + 96, D + padF + 40, zF - D - 40, ' rotateX(90deg)', 'top center', UP, concrete);
  face('s3-kerb', -48, H, W + 96, 14, zF + padF, '', null, FRONT, concrete);
  face('s3-ao', 0, H - 0.5, W, 46, zF, ' rotateX(90deg)', 'top center', null);
  face('s3-cast', -10, H - 0.6, W + 20, 90, zF + 46, ' rotateX(90deg)', 'top center', null);

  // ---- Building shell ----
  face('s3-roof', 0, -D, W, D, zF, ' rotateX(90deg)', 'bottom center', UP, { src: 'tex-concrete.webp', size: '128px 128px', repeat: true });
  face('', W, 0, D, SIGN_H, zF, ' rotateY(90deg)', 'left center', RIGHT, panel);
  face('', W, SIGN_H, D, H - SIGN_H, zF, ' rotateY(90deg)', 'left center', RIGHT, plaster);
  face('', -D, 0, D, SIGN_H, zF, ' rotateY(-90deg)', 'right center', LEFT, panel);
  face('', -D, SIGN_H, D, H - SIGN_H, zF, ' rotateY(-90deg)', 'right center', LEFT, plaster);
  face('s3-plinth-line', W + 0.5, H - 22, D, 22, zF, ' rotateY(90deg)', 'left center', RIGHT, null);
  face('s3-plinth-line', -D - 0.5, H - 22, D, 22, zF, ' rotateY(-90deg)', 'right center', LEFT, null);

  // ---- Recessed shop opening: interior, reveals, floor ----
  face('s3-interior', PIL, yO, W - PIL * 2, H - yO, zF - R, '', null, FRONT, ground(PIL, LINTEL));
  face('s3-reveal-top', PIL, yO, W - PIL * 2, R, zF, ' rotateX(-90deg)', 'top center', DOWN, wood);
  face('s3-sill', PIL, H - 2, W - PIL * 2, R, zF - R, ' rotateX(90deg)', 'top center', UP, concrete);
  face('s3-downlights', PIL, yO + 0.5, W - PIL * 2, R, zF, ' rotateX(-90deg)', 'top center', null);
  face('s3-spill', PIL, yO, W - PIL * 2, 160, zF - R + 1, '', null, null);

  // ---- Pillars either side of the opening ----
  [[0, true], [W - PIL, false]].forEach(function (p) {
    var x = p[0];
    face('s3-pillar', x, yO, PIL, H - yO, zF + PIL_D, '', null, FRONT, panel);
    if (p[1]) face('s3-pillar', x + PIL, yO, PIL_D + R, H - yO, zF + PIL_D, ' rotateY(90deg)', 'left center', RIGHT, panel);
    else face('s3-pillar', x - PIL_D - R, yO, PIL_D + R, H - yO, zF + PIL_D, ' rotateY(-90deg)', 'right center', LEFT, panel);
  });

  // ---- Lintel with the banner ----
  face('s3-lintel s3-sheen', 0, SIGN_H, W, LINTEL, zF + PIL_D, '', null, FRONT, ground(0, 0));
  face('s3-lintel-under', PIL, yO, W - PIL * 2, PIL_D, zF + PIL_D, ' rotateX(-90deg)', 'top center', DOWN, panel);
  face('s3-banner-edge', 0, SIGN_H + 7 + 65, 350, 14, zF + PIL_D + 14, ' rotateX(-90deg)', 'top center', DOWN, null);
  face('s3-banner-edge', 350, SIGN_H + 7, 14, 65, zF + PIL_D + 14, ' rotateY(90deg)', 'left center', RIGHT, null);
  face('s3-banner s3-sheen', 0, SIGN_H + 7, 350, 65, zF + PIL_D + 14, '', null, FRONT, { src: 'banner.webp' });

  // ---- Signboard box ----
  face('', 0, -SIGN_D, W, SIGN_D, zS, ' rotateX(90deg)', 'bottom center', UP, panel);
  face('s3-sign-soffit', 0, SIGN_H, W, SIGN_D, zS, ' rotateX(-90deg)', 'top center', DOWN, panel);
  face('s3-soffit-lights', 0, SIGN_H, W, SIGN_D, zS, ' rotateX(-90deg)', 'top center', null);
  face('', W, 0, SIGN_D, SIGN_H, zS, ' rotateY(90deg)', 'left center', RIGHT, panel);
  face('', -SIGN_D, 0, SIGN_D, SIGN_H, zS, ' rotateY(-90deg)', 'right center', LEFT, panel);
  face('s3-sign s3-sheen', 0, 0, W, SIGN_H, zS, '', null, FRONT, { src: 'sign-front.webp' });
  face('s3-wash', 0, SIGN_H + 1, W, 90, zF + PIL_D + 0.5, '', null, null);

  // ---- Category boards, raised off the signboard ----
  var cols = [[40, 133], [157, 251], [289, 421], [447, 539]];
  var rows = [[205, 247], [254, 296], [303, 345]];
  var i = 0;
  rows.forEach(function (r) {
    cols.forEach(function (c) {
      var x = c[0] - 1 - 12, y = r[0] - 1 - 5, w = c[1] - c[0] + 2, h = r[1] - r[0] + 2;
      face('s3-board-edge', x, y + h, w, 6, zS + 6, ' rotateX(-90deg)', 'top center', DOWN, null);
      face('s3-board-edge', x, y - 6, w, 6, zS + 6, ' rotateX(90deg)', 'bottom center', UP, null);
      face('s3-board-edge', x + w, y, 6, h, zS + 6, ' rotateY(90deg)', 'left center', RIGHT, null);
      face('s3-board-edge', x - 6, y, 6, h, zS + 6, ' rotateY(-90deg)', 'right center', LEFT, null);
      face('s3-board s3-sheen', x, y, w, h, zS + 6, '', null, FRONT, { src: 'board-' + i + '.webp' });
      i++;
    });
  });

  // ---- Stand off letters with a warm glow ----
  face('s3-letters', -14, 41, W + 28, 171, zS + 18, '', null, null, { src: 'letters.webp' });

  stage.appendChild(model);
  stage.classList.add('is-3d');

  // ---- Lighting ----
  var L = (function (v) { var m = Math.hypot(v[0], v[1], v[2]); return [v[0] / m, v[1] / m, v[2] / m]; })([-0.55, -0.62, 0.56]);
  var sheens = $all('.s3-sheen');
  function $all(sel) { return Array.prototype.slice.call(model.querySelectorAll(sel)); }
  function shade(rxDeg, ryDeg) {
    var ax = rxDeg * Math.PI / 180, ay = ryDeg * Math.PI / 180;
    var cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax);
    faces.forEach(function (f) {
      var n = f.n;
      // CSS applies rotateX(rx) rotateY(ry): rotate about Y first, then about X
      var x1 = n[0] * cy + n[2] * sy, y1 = n[1], z1 = -n[0] * sy + n[2] * cy;
      var y2 = y1 * cx - z1 * sx, z2 = y1 * sx + z1 * cx;
      var d = Math.max(0, x1 * L[0] + y2 * L[1] + z2 * L[2]);
      var dark = 0.42 - d * 0.42;            // 0 when facing the light, up to 0.42 when turned away
      f.el.style.setProperty('--sh', dark.toFixed(3));
    });
    var p = (50 - ryDeg * 1.6).toFixed(1) + '%';
    sheens.forEach(function (el) { el.style.setProperty('--sheen', p); });
  }

  // ---- Sizing ----
  var scale = 1, shiftY = 0;
  function fit() {
    var r = stage.getBoundingClientRect();
    var top = window.innerWidth >= 1024 ? 96 : 0;
    scale = Math.min((r.width * 0.68) / W, ((r.height - top) * 0.74) / (H + 80));
    shiftY = top / 2;
    apply();
  }

  // ---- Interaction ----
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var REST_Y = -24, REST_X = -7;
  var ry = REST_Y, rx = REST_X, vy = 0, targetY = REST_Y, targetX = REST_X;
  var dragging = false, lastX = 0, lastMove = 0, lastY = 0, idleSince = performance.now(), running = false, visible = true;
  var MIN_Y = -46, MAX_Y = 46, MIN_X = -16, MAX_X = 8;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function apply() {
    model.style.transform = 'translateY(' + (shiftY - 6 * scale) + 'px) scale(' + scale + ') rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    shade(rx, ry);
  }

  function tick(t) {
    running = false;
    if (!visible) return;
    if (!dragging) {
      if (Math.abs(vy) > 0.02) { targetY = clamp(targetY + vy, MIN_Y, MAX_Y); vy *= 0.92; }
      else if (!reduce && t - idleSince > 2500) { targetY = REST_Y + Math.sin((t - idleSince - 2500) / 2800) * 18; }
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
