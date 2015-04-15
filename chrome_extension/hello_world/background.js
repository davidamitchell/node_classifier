
chrome.extension.onRequest.addListener(function(request, sender, callback) {
  var tabId = request.tabId;
  appendStatus(tabId);
  // chrome.tabs.executeScript(tabId, { file: "content.js" }, function() {
  //   chrome.tabs.sendRequest(tabId, {}, function(results) {
  //     validateLinks(results, callback);
  //   });
  // });
});
