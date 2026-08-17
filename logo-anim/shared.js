/* Logo animation preview runner — 5s, replayable every refresh */
(function () {
  const stage = document.getElementById("stage");
  if (!stage) return;

  const DURATION_MS = 5000;
  const reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let timer;

  function play() {
    if (timer) clearTimeout(timer);
    stage.classList.remove("is-playing", "is-done", "reduced");

    if (reduced) {
      stage.classList.add("reduced", "is-done");
      return;
    }

    // reflow so CSS animations restart
    void stage.offsetWidth;
    stage.classList.add("is-playing");

    timer = setTimeout(function () {
      stage.classList.add("is-done");
    }, DURATION_MS);
  }

  const replayBtn = document.getElementById("replay");
  if (replayBtn) {
    replayBtn.addEventListener("click", play);
  }

  window.addEventListener("keydown", function (e) {
    if (e.key === "r" || e.key === "R") play();
  });

  play();
})();
