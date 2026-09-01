(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); }
  }

  /* ---------------- Splash ---------------- */

  function initSplash() {
    var splash = $("[data-splash]");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-out"); };
    if (document.readyState === "complete") setTimeout(hide, 500);
    else window.addEventListener("load", function () { setTimeout(hide, 350); });
    setTimeout(hide, 3200);
  }

  /* ---------------- Nav ---------------- */

  function initNav() {
    var nav = $(".nav");
    if (!nav) return;
    var onScroll = function () {
      if (window.scrollY > 40) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toggle = $("[data-nav-toggle]");
    var mobile = $("[data-nav-mobile]");
    if (toggle && mobile) {
      toggle.addEventListener("click", function () {
        var open = mobile.getAttribute("aria-hidden") === "false";
        mobile.setAttribute("aria-hidden", open ? "true" : "false");
        toggle.setAttribute("aria-expanded", open ? "false" : "true");
        document.documentElement.classList.toggle("nav-open", !open);
      });
      $$("a", mobile).forEach(function (a) {
        a.addEventListener("click", function () {
          mobile.setAttribute("aria-hidden", "true");
          toggle.setAttribute("aria-expanded", "false");
          document.documentElement.classList.remove("nav-open");
        });
      });
    }
  }

  /* ---------------- Smooth anchors ---------------- */

  function initSmoothAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navEl = $(".nav");
      var offset = navEl ? navEl.offsetHeight + 12 : 80;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - offset,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* ---------------- Reveal on scroll ---------------- */

  function initReveals() {
    var els = $$("[data-reveal]");
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-revealed");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });
    els.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      $$("[data-reveal]:not(.is-revealed)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-revealed");
      });
    }, 6000);
  }

  /* ---------------- Tilt 3D + cursor halo ---------------- */

  function bindTilt(scope) {
    if (!fineHover) return;
    $$("[data-tilt-card]", scope).forEach(function (card) {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = "1";
      var MAX = 7;
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        tx = -py * MAX; ty = px * MAX;
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
        if (!raf) raf = requestAnimationFrame(loop);
      });
      card.addEventListener("mouseleave", function () {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      function loop() {
        cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
        card.style.setProperty("--rx", cx.toFixed(2) + "deg");
        card.style.setProperty("--ry", cy.toFixed(2) + "deg");
        raf = (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) ? requestAnimationFrame(loop) : null;
      }
    });
  }

  function initTilt() {
    bindTilt(document);
  }

  /* ---------------- Magnetic CTAs ---------------- */

  function initMagnetic() {
    if (!fineHover) return;
    $$("[data-magnetic]").forEach(function (el) {
      var strength = parseFloat(el.dataset.magneticStrength || "0.25");
      var inner = document.createElement("span");
      inner.className = "magnetic-inner";
      while (el.firstChild) inner.appendChild(el.firstChild);
      el.appendChild(inner);
      el.classList.add("has-magnetic");
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        tx = ((e.clientX - r.left) - r.width / 2) * strength;
        ty = ((e.clientY - r.top) - r.height / 2) * strength;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      el.addEventListener("mouseleave", function () {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      function loop() {
        cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
        inner.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
        raf = (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) ? requestAnimationFrame(loop) : null;
      }
    });
  }

  /* ---------------- Marquee ---------------- */

  function initMarquee() {
    $$("[data-marquee]").forEach(function (track) {
      if (track.dataset.marqueeBound) return;
      track.dataset.marqueeBound = "1";
      var clone = track.cloneNode(true);
      clone.removeAttribute("data-marquee");
      clone.setAttribute("aria-hidden", "true");
      track.parentNode.appendChild(clone);
      if (window.gsap) {
        var distance = track.scrollWidth;
        var speed = 55;
        gsap.to([track, clone], {
          x: -distance,
          duration: distance / speed,
          ease: "none",
          repeat: -1,
          modifiers: { x: gsap.utils.unitize(function (x) { return parseFloat(x) % distance; }) }
        });
      }
    });
  }

  /* ---------------- Fill WhatsApp links from data ---------------- */

  function initWhatsappLinks() {
    if (!data.waLink || !data.messages) return;
    $$("[data-wa]").forEach(function (a) {
      var key = a.getAttribute("data-wa");
      var msg;
      if (key === "product") {
        var productName = a.getAttribute("data-wa-name") || "";
        msg = data.messages.product ? data.messages.product(productName) : data.messages.general;
      } else {
        msg = data.messages[key] || data.messages.general;
      }
      a.href = data.waLink(msg);
    });
    var num = $("[data-wa-number]");
    if (num) num.textContent = data.whatsappNumber || "";
    var ig = $$("[data-instagram]");
    ig.forEach(function (a) { a.href = data.instagram || "#"; });
    var igHandle = $$("[data-instagram-handle]");
    igHandle.forEach(function (el) { el.textContent = data.instagramHandle || ""; });
  }

  /* ---------------- Year ---------------- */

  function initYear() {
    var el = $("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------- Hero parallax ---------------- */

  function initHeroParallax() {
    if (!window.gsap || !window.ScrollTrigger || reduced) return;
    var visual = $(".hero-visual");
    if (!visual) return;
    gsap.to(visual, {
      yPercent: -12,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  /* ---------------- Boot ---------------- */

  function boot() {
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initSmoothAnchors, "initSmoothAnchors");
    safe(initReveals, "initReveals");
    safe(initTilt, "initTilt");
    safe(initMagnetic, "initMagnetic");
    safe(initWhatsappLinks, "initWhatsappLinks");
    safe(initYear, "initYear");

    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}
      safe(initMarquee, "initMarquee");
      safe(initHeroParallax, "initHeroParallax");
    } else {
      safe(initMarquee, "initMarquee");
    }

    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
