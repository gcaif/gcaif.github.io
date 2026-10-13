/* ------------------------------------------------------------------
   Saif — project cards

   To add a card: copy one block and drop it into the right list below.

     {
       title:      "Name of the thing",
       icon:       "something.webp",     // file lives in /assets/ — optional
       banner:     ["b/one.webp"],       // 256 x 135 background image(s) shown at the
                                         // top of the card, files live in /assets/.
                                         // Several images switch in order, instantly,, e.g.
                                         // ["b/a.webp", "b/b.webp"]; a plain string works
                                         // for one image. No banner? use  banner: ""
                                         // (or delete the line) and no space is reserved.
       years:      "2022 – 2023",        // duration of the project
       note:       "ownership transferred", // optional — small line under the years, shown in brackets
       desc:       "One or two lines.",
       download:   "https://...",        // Download button link
       blueprints: "https://..."         // Blueprints button link
     },

   Commas between blocks, trailing comma on the last one is fine.
   A button with an empty link ("") shows up greyed out and does nothing.
------------------------------------------------------------------ */

var PROJECTS = [
  {
    title: "Ishara",
    icon: "Ishara.webp",
    banner: ["b/i.webp"],
    years: "2022 – Mid 2026",
    note: "ownership transferred",
    desc: "A sign language recognition app that turns hand gestures into text in real time.",
    download: "",
    blueprints: ""
  },
  {
    title: "Klem",
    icon: "Klem.webp",
    banner: ["b/klem1.webp", "b/klem2.webp"],
    years: "2022 – 2023",
    desc: "A color-picker and palette tool that adapts to whatever is on your screen.",
    download: "",
    blueprints: ""
  },
  {
    title: "Hiddenball",
    icon: "hiddenball.webp",
    banner: ["b/hb1.webp", "b/hb2.webp", "b/hb3.webp", "b/hb4.webp", "b/hb5.webp"],
    years: "2024",
    desc: "A baseball archive with live game views, scores and player transactions.",
    download: "",
    blueprints: ""
  },
  {
    title: "Pluk",
    icon: "pluk.webp",
    banner: "",
    years: "2021 – 2022",
    desc: "A small video streaming experiment with a clean, fast player.",
    download: "",
    blueprints: ""
  },
  {
    title: "Steno",
    icon: "steno.webp",
    banner: ["b/steno.webp"],
    years: "2023",
    desc: "A shorthand-style notes app built for typing as fast as you think.",
    download: "",
    blueprints: ""
  },
  {
    title: "SVGXL",
    icon: "svgxl.webp",
    banner: "",
    years: "2024 – 2025",
    desc: "An SVG editor and optimizer for crisp, lightweight vector graphics.",
    download: "",
    blueprints: ""
  }
];

/* ---------------- renderer — nothing below needs editing ---------------- */

(function () {
  var ICON_DIR = '../assets/';

  var SVG_DOWNLOAD = '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v8M4.5 7 8 10.5 11.5 7M3 13.5h10"/></svg>';
  var SVG_BLUEPRINT = '<svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 4 2 8l3.5 4M10.5 4 14 8l-3.5 4"/></svg>';

  function el(tag, cls) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  function buildButton(label, svg, url, variant) {
    var btn = el(url ? 'a' : 'span', 'btn btn--' + variant);
    if (url) {
      btn.href = url;
      btn.target = '_blank';
      btn.rel = 'noopener';
    } else {
      btn.setAttribute('aria-disabled', 'true');
      btn.classList.add('btn--disabled');
    }
    btn.innerHTML = svg;
    btn.appendChild(document.createTextNode(label));
    return btn;
  }

  // load one banner image completely (resolves with the <img>, or null if it failed)
  function loadImage(src) {
    return new Promise(function (resolve) {
      var im = new Image();
      im.alt = '';
      im.decoding = 'async';
      im.draggable = false;
      im.onload = function () {
        if (im.decode) im.decode().then(function () { resolve(im); }, function () { resolve(im); });
        else resolve(im);
      };
      im.onerror = function () { resolve(null); };
      im.src = ICON_DIR + src;
    });
  }

  // build the banner from images that are already loaded
  function buildBanner(imgs) {
    var banner = el('div', 'card__banner');
    imgs.forEach(function (im, i) {
      if (!i) im.className = 'is-active';
      banner.appendChild(im);
    });

    if (imgs.length > 1) {
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      var cur = 0;
      var timer = null;

      // swap instantly — the old image disappears, the new one appears
      function show(n) {
        imgs[cur].classList.remove('is-active');
        cur = (n + imgs.length) % imgs.length;
        imgs[cur].classList.add('is-active');
      }

      function startTimer() {
        if (reduce) return;
        clearInterval(timer);
        timer = setInterval(function () { show(cur + 1); }, 1200);
      }
      startTimer();

      function go(dir) { show(cur + dir); startTimer(); }

      // swipe (touch) / drag (mouse) left or right
      // (a second finger = pinch-zoom, which is never treated as a swipe)
      var sx = 0, sy = 0, tracking = false, fingers = 0;
      banner.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        fingers++;
        if (fingers > 1) { tracking = false; return; }
        tracking = true; sx = e.clientX; sy = e.clientY;
      });
      banner.addEventListener('pointerup', function (e) {
        fingers = Math.max(0, fingers - 1);
        if (!tracking) return;
        tracking = false;
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      });
      banner.addEventListener('pointercancel', function () {
        fingers = Math.max(0, fingers - 1);
        tracking = false;
      });

      // sideways scroll (trackpad / horizontal wheel)
      var wheelLock = false;
      banner.addEventListener('wheel', function (e) {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 4) return;
        e.preventDefault();
        if (wheelLock) return;
        wheelLock = true;
        setTimeout(function () { wheelLock = false; }, 450);
        go(e.deltaX > 0 ? 1 : -1);
      }, { passive: false });
    }
    return banner;
  }

  function buildCard(item) {
    var card = el('article', 'card');
    if (item.status === 'active') card.classList.add('card--live');

    // banner slot (256 x 135) — one image, or several that switch instantly.
    // Nothing is shown (no empty box) until EVERY image of the banner has
    // loaded; a project whose images aren't ready behaves as if it had no banner.
    var shots = [].concat(item.banner || []).filter(Boolean);
    if (shots.length) {
      Promise.all(shots.map(loadImage)).then(function (loaded) {
        var imgs = loaded.filter(Boolean);
        if (!imgs.length) return;
        card.insertBefore(buildBanner(imgs), card.firstChild);
      });
    }

    var main = el('div', 'card__main');

    // icon slot — stays as an empty placeholder until an image is provided
    var badge = el('span', 'card__icon');
    if (item.icon) {
      var img = document.createElement('img');
      img.src = ICON_DIR + item.icon;
      img.alt = '';
      img.draggable = false;
      // if the file isn't there yet, fall back to the empty placeholder
      img.onerror = function () { img.remove(); };
      badge.appendChild(img);
    }
    main.appendChild(badge);

    var text = el('div', 'card__text');
    var title = el('h3', 'card__title');
    title.textContent = item.title;
    text.appendChild(title);
    if (item.years) {
      var years = el('p', 'card__years');
      years.textContent = item.years;
      text.appendChild(years);
    }
    if (item.note) {
      var note = el('p', 'card__note');
      note.textContent = '(' + item.note + ')';
      text.appendChild(note);
    }
    main.appendChild(text);

    if (item.desc) {
      var desc = el('p', 'card__desc');
      desc.textContent = item.desc;
      main.appendChild(desc);
    }

    card.appendChild(main);

    if (item.status) {
      var status = el('span', 'card__status');
      status.appendChild(el('span', 'card__dot'));
      status.appendChild(document.createTextNode(item.status));
      card.appendChild(status);
    }

    var actions = el('div', 'card__actions');
    actions.appendChild(buildButton('Blueprints', SVG_BLUEPRINT, item.blueprints, 'ghost'));
    actions.appendChild(buildButton('Download', SVG_DOWNLOAD, item.download, 'primary'));
    card.appendChild(actions);

    return card;
  }

  function render(panelId, items) {
    var panel = document.getElementById(panelId);
    if (!panel) return;
    panel.innerHTML = '';

    if (!items || !items.length) {
      var empty = el('p', 'empty');
      empty.textContent = 'Nothing here yet.';
      panel.appendChild(empty);
      return;
    }

    items.forEach(function (item) { panel.appendChild(buildCard(item)); });
  }

  // no right-click / long-press menu ("open image", "save image"...) on banners and icons
  document.addEventListener('contextmenu', function (e) {
    if (e.target.closest && e.target.closest('.card__banner, .card__icon')) e.preventDefault();
  });
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });

  render('panel-projects', PROJECTS);
})();
