function appendStatus(text) {
  document.getElementById('status').textContent += ("\n" + text)
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {
    // console.log(response);
    // appendStatus('images: ' + response.image_count);
  });
});
