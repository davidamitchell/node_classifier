function inspectPage(){
	var payload = [];

	var images = document.querySelectorAll("img");
	payload.push({name: 'images', value: images.length})

	var links = document.querySelectorAll("a");
	payload.push({name: 'links', value: links.length})

	var nonLocalLinks = offSiteLinks(links)
	payload.push({name: 'off site links', value: nonLocalLinks.length})


	var port = chrome.extension.connect({ name: "inspect-content-port" });
	port.postMessage({'summary': payload, 'links': nonLocalLinks});
}

function offSiteLinks(links) {

	var offsite = [];
	for(var i = 0; i < links.length; i++){

		if(!isLocalLink(links[i].href)) {
			offsite.push(links[i].href);
		}

	}
	return offsite;
}

function isLocalLink(uri){
	var localLink = false;
	var test_uri = uri.replace(/^http:\/\//, '');
	test_uri = test_uri.replace(/^https:\/\//, '');
	var hostname = window.location.hostname;
	pattern = "^" + hostname;
	var re = new RegExp(pattern, "i");

	return !!test_uri.match(re);
}

inspectPage();

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		inspectPage();
	}
);
