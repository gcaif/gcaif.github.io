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
