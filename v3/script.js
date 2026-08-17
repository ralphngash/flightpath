/* Flight Path v3 — neon grunge interactions */

(function () {
  /* ---- Wing intro splash (DEV: every refresh, 5s — re-enable session skip later) ---- */
  (function initIntro() {
    const splash = document.getElementById("intro-splash");
    if (!splash) return;

    let finished = false;
    let autoTimer;
    const INTRO_MS = 5000; // TODO: when ready, restore once-per-session

    function cleanup() {
      splash.remove();
      document.body.classList.remove("intro-lock");
    }

    function endIntro() {
      if (finished) return;
      finished = true;
      splash.classList.add("is-done");
      splash.addEventListener("transitionend", cleanup, { once: true });
      setTimeout(cleanup, 700);
      if (autoTimer) clearTimeout(autoTimer);
    }

    const reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      cleanup();
      return;
    }

    document.documentElement.classList.remove("intro-skip");
    document.body.classList.add("intro-lock");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        splash.classList.add("is-playing");
      });
    });

    autoTimer = setTimeout(endIntro, INTRO_MS);

    splash.addEventListener("click", endIntro);
    window.addEventListener(
      "keydown",
      function (e) {
        if (e.key === "Escape") endIntro();
      },
      { passive: true }
    );
  })();

  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");

  function onScroll() {
    if (!header) return;
    if (window.scrollY > 24 || document.body.classList.contains("menu-page")) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        document.body.style.overflow = "";
      });
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  const tabs = document.querySelectorAll(".menu-tab");
  const panels = document.querySelectorAll(".menu-category");

  if (tabs.length && panels.length) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.getAttribute("data-tab");
        tabs.forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");
        panels.forEach((panel) => {
          const match = panel.id === id;
          panel.classList.toggle("active", match);
          if (match) panel.removeAttribute("hidden");
          else panel.setAttribute("hidden", "");
        });
      });
    });
  }

  const sectionIds = ["about", "beer", "food", "entertainment", "visit"];
  const sectionEls = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  if (sectionEls.length && nav) {
    const navLinks = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            link.classList.toggle("active", href === `#${id}`);
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sectionEls.forEach((el) => sectionObserver.observe(el));
  }
})();
