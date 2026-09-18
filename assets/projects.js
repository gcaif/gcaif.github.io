/* ------------------------------------------------------------------
   Saif — project cards

   To add a card: copy one block and drop it into the right list below.

     {
       title: "Name of the thing",
       icon:  "something.webp",        // file lives in /assets/ — optional
       desc:  "One or two lines.",
       tags:  ["python", "cli"],       // optional, any number
       url:   "https://...",           // optional — makes the card clickable
       status: "active"                // IN_PROGRESS only: "active" or "paused"
     },

   Commas between blocks, trailing comma on the last one is fine.
------------------------------------------------------------------ */

var PROJECTS = [
  {
    title: "Field Notes",
    icon: "fieldnotes.webp",
    desc: "A small static-site generator for keeping a running log of notes, built to stay out of the way.",
    tags: ["python", "cli"],
    url: ""
  },
  {
    title: "Cartograph",
    icon: "cartograph.webp",
    desc: "A minimal tool for turning a spreadsheet of places into a shareable, offline-friendly map.",
    tags: ["javascript", "maps"],
    url: ""
  },
  {
    title: "Weekly Digest",
    icon: "weeklydigest.webp",
    desc: "A script that reads a folder of notes and mails out a short summary every Sunday.",
    tags: ["automation", "email"],
    url: ""
  },
  {
    title: "Index",
    icon: "index.webp",
    desc: "This site — a small, hand-built directory instead of a hosted link page.",
    tags: ["html", "css"],
    url: ""
  }
];

var IN_PROGRESS = [
  {
    title: "Nightshade",
    icon: "nightshade.webp",
    desc: "A theme-authoring tool for building and previewing dark palettes side by side.",
    tags: ["design tools", "svelte"],
    status: "active",
    url: ""
  },
  {
    title: "Atlas",
    icon: "atlas.webp",
    desc: "A personal reading tracker that syncs with StoryGraph and adds yearly summaries.",
    tags: ["api", "python"],
    status: "active",
    url: ""
  },
  {
    title: "Ledger",
    icon: "ledger.webp",
    desc: "A plain-text budgeting format, and a small renderer for turning it into a monthly view.",
    tags: ["plain text", "rust"],
    status: "paused",
    url: ""
  }
];

/* ---------------- renderer — nothing below needs editing ---------------- */

(function () {
  var ICON_DIR = '../assets/';

  function el(tag, cls) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  function buildCard(item) {
    var card = el('article', 'card');
    if (item.status === 'active') card.classList.add('card--live');

    var head = el('div', 'card__head');

    if (item.icon) {
      var badge = el('span', 'card__icon');
      var img = document.createElement('img');
      img.src = ICON_DIR + item.icon;
      img.alt = '';
      img.width = 28;
      img.height = 28;
      // if the webp isn't there yet, drop the badge instead of showing a broken image
      img.onerror = function () { badge.remove(); };
      badge.appendChild(img);
      head.appendChild(badge);
    }

    var title = el('h3', 'card__title');
    title.textContent = item.title;
    head.appendChild(title);

    if (item.status) {
      var status = el('span', 'card__status');
      status.appendChild(el('span', 'card__dot'));
      status.appendChild(document.createTextNode(item.status));
      head.appendChild(status);
    }

    card.appendChild(head);

    if (item.desc) {
      var desc = el('p', 'card__desc');
      desc.textContent = item.desc;
      card.appendChild(desc);
    }

    if (item.tags && item.tags.length) {
      var tags = el('div', 'card__tags');
      item.tags.forEach(function (t) {
        var tag = el('span', 'tag');
        tag.textContent = t;
        tags.appendChild(tag);
      });
      card.appendChild(tags);
    }

    if (item.url) {
      var link = document.createElement('a');
      link.className = 'card__link';
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.setAttribute('aria-label', item.title);
      card.appendChild(link);
      card.classList.add('card--linked');
    }

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
