
chrome.extension.onRequest.addListener(function(request, sender, callback) {

  console.error("anything");

  var tabId = request.tabId;
  chrome.tabs.sendRequest(tabId, {}, function(results) {
    console.error(results);
    callback({ total: 5, badlinks: "bad" });
  });
});
