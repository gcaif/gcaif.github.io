/* ------------------------------------------------------------------
   Saif — project cards

   To add a card: copy one block and drop it into the right list below.

     {
       title:      "Name of the thing",
       icon:       "something.webp",     // file lives in /assets/ — optional
       years:      "2022 – 2023",        // duration of the project
       desc:       "One or two lines.",
       download:   "https://...",        // Download button link
       blueprints: "https://...",        // Blueprints button link
       status:     "active"              // IN_PROGRESS only: "active" or "paused"
     },

   Commas between blocks, trailing comma on the last one is fine.
   A button with an empty link ("") shows up greyed out and does nothing.
------------------------------------------------------------------ */

var PROJECTS = [
  {
    title: "Project Name",
    icon: "",
    years: "2022 – 2023",
    desc: "A short placeholder description of what this project is, what it does, and why it was built. Swap this line out with the real text for each project.",
    download: "",
    blueprints: ""
  }
];

var IN_PROGRESS = [];

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

  function buildCard(item) {
    var card = el('article', 'card');
    if (item.status === 'active') card.classList.add('card--live');

    var main = el('div', 'card__main');

    // icon slot — stays as an empty placeholder until an image is provided
    var badge = el('span', 'card__icon');
    if (item.icon) {
      var img = document.createElement('img');
      img.src = ICON_DIR + item.icon;
      img.alt = '';
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
    actions.appendChild(buildButton('Download', SVG_DOWNLOAD, item.download, 'primary'));
    actions.appendChild(buildButton('Blueprints', SVG_BLUEPRINT, item.blueprints, 'ghost'));
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

  render('panel-projects', PROJECTS);
  render('panel-progress', IN_PROGRESS);
})();
