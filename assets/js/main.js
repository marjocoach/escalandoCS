/* ============================================================
   ESCALANDOCS. Comportamiento del sitio
   JS vanilla, patron IIFE, contenido critico ya esta en el HTML.
   ============================================================ */

(function () {
  "use strict";

  function safe(fn, name) {
    try {
      fn();
    } catch (err) {
      console.error("[escalandocs] fallo en " + name, err);
    }
  }

  function initNavToggle() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-nav-mobile]");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function () {
      var isOpen = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    document.documentElement.classList.add("js-ready");

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) { observer.observe(el); });

    // Red de seguridad: si algo falla, todo queda visible a los 6s.
    window.setTimeout(function () {
      items.forEach(function (el) { el.classList.add("in-view"); });
    }, 6000);
  }

  function initStatCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;

    function animate(el) {
      var target = el.getAttribute("data-count");
      var match = target.match(/^([^\d]*)(\d+)([^\d]*)$/);
      if (!match) return;
      var prefix = match[1];
      var end = parseInt(match[2], 10);
      var suffix = match[3];
      var start = 0;
      var duration = 1100;
      var startTime = null;

      function step(ts) {
        if (startTime === null) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(start + (end - start) * eased);
        el.textContent = prefix + value.toLocaleString("en-US") + suffix;
        if (progress < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }

    if (!("IntersectionObserver" in window)) {
      nums.forEach(animate);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    nums.forEach(function (el) { observer.observe(el); });

    // Red de seguridad: si el observer nunca dispara, muestra el valor final a los 6s.
    window.setTimeout(function () {
      nums.forEach(function (el) {
        if (el.textContent === "0") animate(el);
      });
    }, 6000);
  }

  function initHeaderShadow() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 8) {
        header.style.boxShadow = "0 12px 30px -24px rgba(46,74,99,0.5)";
      } else {
        header.style.boxShadow = "none";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initPhaseTabs() {
    var tabs = document.querySelectorAll("[data-phase-tab]");
    var panels = document.querySelectorAll("[data-phase-panel]");
    if (!tabs.length || !panels.length) return;

    function activate(id) {
      var activeIndex = -1;
      tabs.forEach(function (tab, i) {
        if (tab.getAttribute("data-phase-tab") === id) activeIndex = i;
      });
      tabs.forEach(function (tab, i) {
        tab.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
        tab.classList.toggle("is-done", i <= activeIndex);
      });
      panels.forEach(function (panel) {
        panel.classList.toggle("is-active", panel.id === id);
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activate(tab.getAttribute("data-phase-tab"));
      });
    });

    activate(tabs[0].getAttribute("data-phase-tab"));
  }

  document.addEventListener("DOMContentLoaded", function () {
    safe(initNavToggle, "initNavToggle");
    safe(initReveal, "initReveal");
    safe(initStatCounters, "initStatCounters");
    safe(initHeaderShadow, "initHeaderShadow");
    safe(initPhaseTabs, "initPhaseTabs");
  });
})();
