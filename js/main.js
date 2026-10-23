(function () {
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");
  var navBackdrop = document.querySelector(".nav-backdrop");
  var track = document.querySelector("[data-testimonial-track]");
  var dots = document.querySelectorAll(".testimonials__dots .dot");
  var navAnchors = document.querySelectorAll(".site-nav__list a[data-nav]");

  function setNavOpen(open) {
    document.body.classList.toggle("nav-open", open);
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (navBackdrop) {
      navBackdrop.setAttribute("aria-hidden", open ? "false" : "true");
    }
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      setNavOpen(!document.body.classList.contains("nav-open"));
    });

    if (navBackdrop) {
      navBackdrop.addEventListener("click", function () {
        setNavOpen(false);
      });
    }

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) {
        setNavOpen(false);
      }
    });
  }

  var heroAccent = document.querySelector("[data-hero-accent]");
  if (
    heroAccent &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    var heroPhrases = [
      "Score Higher.",
      "Win Bigger.",
      "Rank Better.",
      "Think Sharper.",
    ];
    var heroPhraseIndex = 0;
    var heroFadeMs = 520;
    var heroHoldMs = 3800;

    window.setInterval(function () {
      heroAccent.classList.add("is-fading");
      window.setTimeout(function () {
        heroPhraseIndex = (heroPhraseIndex + 1) % heroPhrases.length;
        heroAccent.textContent = heroPhrases[heroPhraseIndex];
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            heroAccent.classList.remove("is-fading");
          });
        });
      }, heroFadeMs);
    }, heroHoldMs);
  }

  if ("IntersectionObserver" in window && navAnchors.length) {
    var sectionByNav = {};
    navAnchors.forEach(function (a) {
      var id = a.getAttribute("data-nav");
      if (id) {
        var el = document.getElementById(id);
        if (el) sectionByNav[id] = el;
      }
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navAnchors.forEach(function (link) {
            var match = link.getAttribute("data-nav") === id;
            link.classList.toggle("is-active", match);
          });
        });
      },
      {
        rootMargin: "-10% 0px -40% 0px",
        threshold: 0,
      }
    );

    Object.keys(sectionByNav).forEach(function (id) {
      observer.observe(sectionByNav[id]);
    });
  }

  if (!track || !dots.length) return;

  var index = 0;
  var total = dots.length;

  function slideTo(i) {
    index = ((i % total) + total) % total;
    if (window.matchMedia("(max-width: 899px)").matches) {
      var offset = -index * 100;
      track.style.transform = "translateX(" + offset + "%)";
    } else {
      track.style.transform = "";
    }
    dots.forEach(function (d, j) {
      d.classList.toggle("is-active", j === index);
      d.setAttribute("aria-selected", j === index ? "true" : "false");
    });
  }

  window.addEventListener("resize", function () {
    slideTo(index);
  });

  dots.forEach(function (dot, i) {
    dot.addEventListener("click", function () {
      slideTo(i);
    });
  });

  if (window.matchMedia("(max-width: 899px)").matches) {
    var startX = 0;
    track.addEventListener(
      "touchstart",
      function (e) {
        startX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    track.addEventListener(
      "touchend",
      function (e) {
        var dx = e.changedTouches[0].screenX - startX;
        if (dx < -40) slideTo(index + 1);
        if (dx > 40) slideTo(index - 1);
      },
      { passive: true }
    );

    window.setInterval(function () {
      if (window.matchMedia("(max-width: 899px)").matches) {
        slideTo(index + 1);
      }
    }, 6000);
  }
})();
