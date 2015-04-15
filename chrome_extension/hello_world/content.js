

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    alert('message received')
    var images = document.querySelectorAll("img");
    console.log('found ', images.length, ' images');

    sendResponse({image_count: images.length});
  }
);
