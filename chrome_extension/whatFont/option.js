(function () {
  var icon = localStorage["toolbar_icon"] || 'dark',
  radios = document.querySelectorAll('input[name=toolbar_icon]'),
  selectedRadio = document.getElementById("toolbar_icon_" + icon),
  r;

  selectedRadio.setAttribute("checked", "checked");
  for (r = 0; r < radios.length; r++) {
    radios[r].addEventListener('change', function (e) {
      var r = e.target;
      localStorage["toolbar_icon"] = r.value;
      chrome.browserAction.setIcon({
        path: { 'dark' : 'icon19', 'light' : 'icon19_light' }[r.value] + '.png'
      });
    }, false);
  }
} ());
