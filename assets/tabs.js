document.querySelectorAll('.tabs').forEach(function (tabs) {
  var buttons = tabs.querySelectorAll('.tab');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.setAttribute('aria-selected', 'false'); });
      btn.setAttribute('aria-selected', 'true');

      var targetId = btn.getAttribute('aria-controls');
      var panels = document.querySelectorAll('.panel');
      panels.forEach(function (p) { p.hidden = (p.id !== targetId); });
    });
  });
});

document.querySelectorAll('.mobile-footer').forEach(function (footer) {
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  function showCopied() {
    footer.classList.add('is-tapped');
    setTimeout(function () {
      footer.classList.remove('is-tapped');
    }, 220);

    footer.classList.remove('-copied');
    void footer.offsetWidth;
    footer.classList.add('-copied');
    clearTimeout(footer._copiedTimeout);
    footer._copiedTimeout = setTimeout(function () {
      footer.classList.remove('-copied');
    }, 1400);
  }

  footer.addEventListener('click', function () {
    var email = footer.getAttribute('data-email');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(showCopied).catch(function () {
        fallbackCopy(email);
        showCopied();
      });
    } else {
      fallbackCopy(email);
      showCopied();
    }
  });
});
