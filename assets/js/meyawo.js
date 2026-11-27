/*!
=========================================================
* Meyawo Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// smooth scroll
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });
});

// navbar toggle
$('#nav-toggle').click(function(){
    $(this).toggleClass('is-active')
    $('ul.nav').toggleClass('show');
});


// Pull-rope theme switcher (logic copied from Dharun's portfolio): pull down, release to toggle, then spring back.
// The saved choice is read in <head> before first paint; default is light.
(function () {
    var themeRoot = document.documentElement;
    var rope = document.getElementById('themeRope'), handle = document.getElementById('ropeHandle'),
        cord = document.getElementById('ropeCord'), shadow = document.getElementById('ropeShadow'),
        highlight = document.getElementById('ropeHighlight');
    if (!rope || !handle || !cord) { return; }

    function current() { return themeRoot.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
    function setTheme(theme) {
        var next = theme === 'dark' ? 'dark' : 'light';
        themeRoot.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked: still switches for this visit */ }
        rope.setAttribute('aria-label', next === 'dark' ? 'Pull to switch to light mode' : 'Pull to switch to dark mode');
    }
    rope.setAttribute('aria-label', current() === 'dark' ? 'Pull to switch to light mode' : 'Pull to switch to dark mode');

    var pull = 0, velocity = 0, active = null, springFrame = 0, lastFrame = 0, didMove = false;
    var clampRope = function (v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };
    // the rope is drawn slightly smaller than its artwork units; convert pointer pixels to artwork units
    function unitsPerPx() {
        var svg = rope.querySelector('svg'), h = svg.getBoundingClientRect().height;
        return h ? svg.viewBox.baseVal.height / h : 1;
    }
    function drawRope(y) {
        var end = 112 + y;
        var d = 'M 28 0 C ' + (28 - y * 0.03) + ' 35 ' + (28 + y * 0.12) + ' ' + (end - 32) + ' 28 ' + end;
        cord.setAttribute('d', d);
        if (shadow) { shadow.setAttribute('d', d); }
        if (highlight) { highlight.setAttribute('d', d); }
        handle.setAttribute('transform', 'translate(0 ' + y + ')');
    }
    function springRope(ts) {
        if (!lastFrame) { lastFrame = ts; }
        var dt = Math.min(0.03, (ts - lastFrame) / 1000);
        lastFrame = ts;
        velocity += (-90 * pull - 17 * velocity) * dt;
        pull += velocity * dt;
        drawRope(pull);
        if (Math.abs(pull) < 0.2 && Math.abs(velocity) < 0.8) {
            pull = velocity = 0; drawRope(0); springFrame = 0; lastFrame = 0; rope.classList.remove('is-pulling'); return;
        }
        springFrame = requestAnimationFrame(springRope);
    }
    function beginPull(e) {
        if (e.button !== undefined && e.button !== 0) { return; }
        active = { id: e.pointerId, y: e.clientY };
        didMove = false;
        cancelAnimationFrame(springFrame); springFrame = 0; lastFrame = 0;
        try { rope.setPointerCapture(e.pointerId); } catch (_) { }
        rope.classList.add('is-pulling');
        e.preventDefault();
    }
    function movePull(e) {
        if (!active || active.id !== e.pointerId) { return; }
        var delta = e.clientY - active.y;
        if (Math.abs(delta) > 5) { didMove = true; }
        pull = clampRope(delta * unitsPerPx(), 0, 125);
        drawRope(pull);
        e.preventDefault();
    }
    function finishPull(e, cancelled) {
        if (!active) { return; }
        var shouldToggle = !cancelled && didMove && pull >= 58;
        var pointerId = active.id;
        active = null;
        try { if (rope.hasPointerCapture(pointerId)) { rope.releasePointerCapture(pointerId); } } catch (_) { }
        if (shouldToggle) { setTheme(current() === 'light' ? 'dark' : 'light'); }
        cancelAnimationFrame(springFrame); springFrame = requestAnimationFrame(springRope);
    }
    handle.addEventListener('pointerdown', beginPull);
    rope.addEventListener('pointermove', movePull);
    rope.addEventListener('pointerup', function (e) { finishPull(e, false); });
    rope.addEventListener('pointercancel', function (e) { finishPull(e, true); });
    rope.addEventListener('lostpointercapture', function (e) { if (active) { finishPull(e, true); } });
    rope.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); setTheme(current() === 'light' ? 'dark' : 'light');
            pull = 12; drawRope(pull); cancelAnimationFrame(springFrame); springFrame = requestAnimationFrame(springRope);
        }
    });
    drawRope(0);
})();


// Projects: category filters + 3D tilt (modelled on jaidev-s-portfolio.vercel.app)
(function () {
    var grid = document.getElementById('projects-grid');
    var bar = document.getElementById('project-filters');
    if (!grid) { return; }
    var cards = [].slice.call(grid.querySelectorAll('.jd-card'));
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function setTransform(card, rx, ry, ty) {
        card.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(' + ty + 'px)';
    }
    cards.forEach(function (card) {
        setTransform(card, 0, 0, 0);
        card.addEventListener('pointermove', function (e) {
            if (reduceMotion.matches || (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen')) { return; }
            var r = card.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
            card.classList.add('is-tilting');
            setTransform(card, ((0.5 - y) * 12).toFixed(2), ((x - 0.5) * 12).toFixed(2), -10);
        });
        card.addEventListener('pointerleave', function () {
            card.classList.remove('is-tilting');
            setTransform(card, 0, 0, 0);
        });
    });

    if (!bar) { return; }
    var buttons = [].slice.call(bar.querySelectorAll('.jd-filter-btn'));
    function applyFilter(category) {
        var order = 0;
        cards.forEach(function (card) {
            var show = category === 'All' || card.getAttribute('data-category') === category;
            if (!show) {
                card.classList.add('is-out');
                var hideNow = function () { if (card.classList.contains('is-out')) { card.hidden = true; } };
                if (reduceMotion.matches) { hideNow(); } else { setTimeout(hideNow, 280); }
                return;
            }
            var wasHidden = card.hidden;
            card.hidden = false;
            if (wasHidden) { card.classList.add('is-out'); void card.offsetWidth; }
            if (!reduceMotion.matches) {
                card.style.transitionDelay = (order * 60) + 'ms';
                setTimeout(function () { card.style.transitionDelay = ''; }, 700);
            }
            order++;
            requestAnimationFrame(function () { card.classList.remove('is-out'); });
        });
    }
    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            buttons.forEach(function (b) {
                var on = b === btn;
                b.classList.toggle('active', on);
                b.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
            applyFilter(btn.getAttribute('data-category'));
        });
    });
})();

// Certifications: endless slide (duplicates the cards so the loop has no jump). Hover/focus pauses it (CSS).
(function () {
    var viewport = document.getElementById('cert-marquee');
    if (!viewport) { return; }
    var track = viewport.querySelector('.cm-track');
    var originals = [].slice.call(track.children);
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var SPEED = 55;                                   // pixels per second
    var clones = [];

    function clearClones() { clones.forEach(function (n) { track.removeChild(n); }); clones = []; }
    function build() {
        clearClones();
        if (reduceMotion.matches || !originals.length) {   // no motion: a plain row you can scroll/swipe
            viewport.classList.remove('is-running'); viewport.classList.add('is-static'); return;
        }
        viewport.classList.remove('is-static');
        var last = originals[originals.length - 1];
        var shift = last.offsetLeft + last.offsetWidth + parseFloat(getComputedStyle(originals[0]).marginRight) - originals[0].offsetLeft;
        var sets = Math.ceil(viewport.clientWidth / shift) + 1;   // enough copies to fill very wide screens
        for (var s = 0; s < sets; s++) {
            originals.forEach(function (card) {
                var copy = card.cloneNode(true);
                copy.setAttribute('aria-hidden', 'true'); copy.setAttribute('tabindex', '-1'); copy.removeAttribute('aria-label');
                track.appendChild(copy); clones.push(copy);
            });
        }
        viewport.style.setProperty('--cm-shift', shift + 'px');
        viewport.style.setProperty('--cm-duration', (shift / SPEED).toFixed(2) + 's');
        viewport.classList.add('is-running');
    }
    build();
    var resizeTimer;
    window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(build, 200); });
    window.addEventListener('load', build);
    if (reduceMotion.addEventListener) { reduceMotion.addEventListener('change', build); }

    // ---- pause logic ----
    // Pause only while the mouse is on the strip of cards or within ZONE px above/below it (25% of the old 52px gap),
    // or while a card has KEYBOARD focus. A card focused by a mouse click does not keep it paused, and coming back to
    // this tab clears any stale "mouse is here" state, so the slide keeps rolling after viewing a certificate.
    var ZONE = 13;
    var hovered = false, keyboardFocus = false, lastX = -1, lastY = -1;
    function syncPause() { viewport.classList.toggle('is-paused', hovered || keyboardFocus); }
    function inZone(x, y) {
        var card = track.querySelector('.cm-card');
        if (!card) { return false; }
        var box = card.getBoundingClientRect(), area = viewport.getBoundingClientRect();
        return x >= area.left && x <= area.right && y >= box.top - ZONE && y <= box.bottom + ZONE;
    }
    document.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') { return; }
        lastX = e.clientX; lastY = e.clientY;
        hovered = inZone(lastX, lastY); syncPause();
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', function () { hovered = false; syncPause(); });
    window.addEventListener('scroll', function () {
        if (lastX >= 0) { hovered = inZone(lastX, lastY); syncPause(); }
    }, { passive: true });
    viewport.addEventListener('focusin', function (e) { keyboardFocus = !!(e.target.matches && e.target.matches(':focus-visible')); syncPause(); });
    viewport.addEventListener('focusout', function () { keyboardFocus = false; syncPause(); });
    viewport.addEventListener('click', function (e) {          // mouse click: do not leave the card focused
        var card = e.target.closest && e.target.closest('.cm-card');
        if (card && e.detail > 0) { setTimeout(function () { card.blur(); }, 0); }
    });
    function comingBack() {
        hovered = false; lastX = lastY = -1;
        var active = document.activeElement;
        if (active && viewport.contains(active) && !(active.matches && active.matches(':focus-visible'))) { active.blur(); }
        keyboardFocus = !!(document.activeElement && viewport.contains(document.activeElement));
        syncPause();
    }
    window.addEventListener('focus', comingBack);
    window.addEventListener('blur', function () { hovered = false; syncPause(); });
    window.addEventListener('pageshow', comingBack);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) { comingBack(); } });
})();

// Rope: keep it centred between the 3-line menu button and the right edge of the page (where the scrollbar starts).
(function () {
    var rope = document.getElementById('themeRope');
    var nav = document.querySelector('.custom-navbar');
    var menu = document.getElementById('nav-toggle');
    if (!rope || !nav || !menu) { return; }
    var slot = rope.parentNode;
    function place() {
        var navWidth = nav.getBoundingClientRect().width;            // the fixed navbar stops where the scrollbar starts
        var menuRight = menu.getBoundingClientRect().right;
        var cordX = (menuRight + navWidth) / 2;                      // middle of that gap
        var slotLeft = slot.getBoundingClientRect().left;
        rope.style.left = (cordX - 14.5 - slotLeft) + 'px';          // the cord is the middle of the 29px-wide rope
    }
    // The navbar container glides to its new size over 0.3s after a resize, so keep following it until it settles.
    var settleUntil = 0, ticking = false;
    function settle() {
        settleUntil = performance.now() + 600;
        if (ticking) { return; }
        ticking = true;
        (function tick() {
            place();
            if (performance.now() < settleUntil) { requestAnimationFrame(tick); } else { ticking = false; }
        })();
    }
    settle();
    window.addEventListener('resize', settle);
    window.addEventListener('load', settle);
    nav.addEventListener('transitionend', place);
    if (window.ResizeObserver) { new ResizeObserver(settle).observe(document.documentElement); }
})();
