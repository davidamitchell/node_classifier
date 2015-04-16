(function() {
	var icon = localStorage["toolbar_icon"] || 'dark';
	chrome.browserAction.setIcon({
		path: {
			'dark': 'icon19',
			'light': 'icon19_light'
		}[icon] + '.png'
	});
}());

chrome.browserAction.onClicked.addListener(function(tab) {
	console.log('button clicked');
	_gaq.push(['_trackEvent', 'chrome', 'loaded']);

	chrome.tabs.sendRequest(tab.id, {
		action: 'initOrRestore'
	}, function(loaded) {
		var msg = loaded ? 'inited' : 'restored';

		console.log(msg);
	});
});

chrome.extension.onRequest.addListener(function(request, sender, callback) {
	console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");

	if (request.action === 'getJSON') {
		request.data = request.data || {};

		// because of Chrome policy, JSONP won't work but XMLHttpRequest can cross-origin
		request.url = request.url.replace(/callback=\?/g, '');

		wf$.getJSON(request.url, request.data, function(data) {
			if (callback) {
				callback(data);
			}
		});
	}

	if (request.action === 'capture') {
		var options = request.options || {};

		if (options.format) {
			options.format = options.format.replace(/^image\//, '');
		}

		if (options.quality > 0 && options.quality <=1) {
			options.quality = options.quality * 100;
		}

		chrome.tabs.captureVisibleTab(options, callback);
	}
});