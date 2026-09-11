/* OnlineShop Uy */
(function () {
  "use strict";
  var d = document, root = d.documentElement;
  root.className += " js";
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }

  (function () {
    var sp = $(".intro");
    if (!sp) return;
    function fuera() { sp.classList.add("fuera"); }
    sp.addEventListener("animationend", fuera);
    setTimeout(fuera, 3000);
  })();

  var nav = $(".nav");
  var bar = d.createElement("div");
  bar.className = "bar";
  bar.innerHTML = '<a class="btn btn-oro" href="#contacto">Hacer un pedido por WhatsApp</a>';
  d.body.appendChild(bar);
  d.body.classList.add("has-bar");

  function onScroll() {
    var y = window.pageYOffset || root.scrollTop || 0;
    if (nav) nav.classList.toggle("solid", y > 50);
    var tapa = false;
    ["#contacto", ".foot"].forEach(function (s) {
      var el = $(s); if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 40 && r.bottom > 0) tapa = true;
    });
    bar.classList.toggle("up", y > 520 && !tapa);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  (function () {
    var sel = ".hero-t > *, .hero-f, .cat-grid a, .sec .wrap > .k, .sec .wrap > h2," +
              " .sec .wrap > .p, .card, .pasos > div, .porque .wrap > .k," +
              " .porque .wrap > h2, .cierre .wrap > *";
    var els = $$(sel);
    if (!els.length) return;
    els.forEach(function (el) { el.setAttribute("data-r", ""); });
    function todo() { els.forEach(function (el) { el.classList.add("vis"); }); }
    if (!("IntersectionObserver" in window)) { todo(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); }
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -5% 0px" });
    els.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + "ms";
      io.observe(el);
    });

    // Las fotos del hero y el logo se mueven apenas con el scroll
    var hf = $(".hero-f img"), cl = $(".cierre-l");
    if (hf && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var suave = 0, objetivo = 0, corriendo = false;
      function paso() {
        suave += (objetivo - suave) * 0.08;
        hf.style.transform = "translateY(" + suave.toFixed(2) + "px)";
        if (Math.abs(objetivo - suave) > 0.2) { requestAnimationFrame(paso); }
        else { corriendo = false; }
      }
      window.addEventListener("scroll", function () {
        var y = window.pageYOffset || 0;
        objetivo = Math.max(-40, Math.min(40, y * -0.06));
        if (!corriendo) { corriendo = true; requestAnimationFrame(paso); }
      }, { passive: true });
    }
    setTimeout(todo, 6000);
  })();
})();
