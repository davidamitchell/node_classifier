
// listening for an event / long-lived connections
// coming from devtools
chrome.extension.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (message) {
    switch(port.name) {
    case "inspect-content-port":
      notifyDevtools(message);
      break;
    case "rerun-inspect-port":
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {}, function(response) {
          // console.log(response);
          // appendStatus('images: ' + response.image_count);
        });
      });
      break;
    }
  });
});


// Function to send a message to all devtools.html views:
function notifyDevtools(msg) {
    ports.forEach(function(port) {
        port.postMessage(msg);
    });
}


// scafolding for passing messages to the dev tool panels
var ports = [];
chrome.runtime.onConnect.addListener(function(port) {
    if (port.name !== "devtools") return;
    ports.push(port);
    // Remove port when destroyed (eg when devtools instance is closed)
    port.onDisconnect.addListener(function() {
        var i = ports.indexOf(port);
        if (i !== -1) ports.splice(i, 1);
    });
    port.onMessage.addListener(function(msg) {
        // Received message from devtools. Do something:
        console.log('Received message from devtools page', msg);
    });
});
