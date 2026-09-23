/* Harborline — nav drawer, billing toggle, FAQ accordion, pilot form, mobile CTA dock */
(function () {
  "use strict";

  /* Nav drawer */
  var toggle = document.getElementById("navToggle");
  var drawer = document.getElementById("navDrawer");
  function setDrawer(open) {
    if (!toggle || !drawer) return;
    drawer.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close main menu" : "Open main menu");
  }
  if (toggle && drawer) {
    toggle.addEventListener("click", function () {
      setDrawer(toggle.getAttribute("aria-expanded") !== "true");
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) setDrawer(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setDrawer(false);
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function (mq) {
      if (mq.matches) setDrawer(false);
    });
  }

  /* Billing toggle */
  var cycleBtns = document.querySelectorAll(".toggle__btn");
  cycleBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cycle = btn.dataset.cycle;
      cycleBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      document.querySelectorAll(".plan__price strong[data-monthly], .plan__note[data-monthly]").forEach(function (el) {
        el.textContent = el.dataset[cycle];
      });
    });
  });

  /* FAQ accordion — one open at a time */
  var qs = document.querySelectorAll(".acc__q");
  function setAcc(q, open) {
    q.setAttribute("aria-expanded", String(open));
    q.querySelector(".acc__sign").textContent = open ? "–" : "+";
    document.getElementById(q.getAttribute("aria-controls")).hidden = !open;
  }
  qs.forEach(function (q) {
    q.addEventListener("click", function () {
      var wasOpen = q.getAttribute("aria-expanded") === "true";
      qs.forEach(function (o) { setAcc(o, false); });
      if (!wasOpen) setAcc(q, true);
    });
  });

  /* Pilot form (client-side only) */
  var form = document.getElementById("pilotForm");
  var note = document.getElementById("formNote");
  var input = document.getElementById("email");
  if (form && note && input) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value.trim();
      var ok = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
      note.className = "form__note " + (ok ? "is-ok" : "is-error");
      note.textContent = ok
        ? "Thanks — a pilot brief is on its way to " + v + "."
        : "Enter a work email so we can route you to the right onboarding lead.";
      input.setAttribute("aria-invalid", String(!ok));
      if (ok) form.reset();
    });
    input.addEventListener("input", function () {
      note.textContent = "";
      note.className = "form__note";
      input.removeAttribute("aria-invalid");
    });
  }

  /* Reduced motion: pause SVG (SMIL) animations */
  var rm = window.matchMedia("(prefers-reduced-motion: reduce)");
  function applyMotion() {
    document.querySelectorAll("svg.lanes__map").forEach(function (s) {
      if (rm.matches) s.pauseAnimations(); else s.unpauseAnimations();
    });
  }
  applyMotion();
  if (rm.addEventListener) rm.addEventListener("change", applyMotion);

  /* Mobile dock: hide while pricing / FAQ / footer are on screen */
  var dock = document.getElementById("dock");
  if (dock && "IntersectionObserver" in window) {
    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) visible.add(en.target); else visible.delete(en.target);
      });
      dock.classList.toggle("is-hidden", visible.size > 0);
    }, { threshold: 0.1 });
    ["pricing", "faq"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
    var foot = document.querySelector(".footer");
    if (foot) io.observe(foot);
  }
})();
