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

// theme switcher (light <-> dark). The saved choice is read in <head> before first paint.
(function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) { return; }
    var root = document.documentElement;
    function current() { return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
    function sync() { btn.setAttribute('aria-pressed', current() === 'dark' ? 'true' : 'false'); }
    sync();
    btn.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked: still switches for this visit */ }
        sync();
    });
})();
