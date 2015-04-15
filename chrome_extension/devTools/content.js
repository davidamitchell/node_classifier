function inspectPage(){
	var payload = [];

	var domain = window.location.hostname.replace(/^www\./,'');
	payload.push({name: 'domain', value: domain})

	var url = window.location.hostname + window.location.pathname
	payload.push({name: 'url', value: url})

	var images = document.querySelectorAll("img");
	var imagesPartition = partition(images.length, [5,20,100,300])
	payload.push({name: 'images', value: imagesPartition + '(' + images.length + ')'})

	var links = document.querySelectorAll("a");
	var linksPartition = partition(links.length, [10,50,150,500])
	payload.push({name: 'links', value: linksPartition + '(' + links.length + ')'})

	var nonLocalLinks = offSiteLinks(links)
	var nonLocalPartition = partition(nonLocalLinks.length, [5,10,50,100])
	payload.push({name: 'off site links', value: nonLocalPartition + '(' + nonLocalLinks.length + ')'})

	var scripts = document.querySelectorAll("script");

	var adUrls = ads(links, scripts)
	var adsPartition = partition(adUrls.length, [1,5,10,15])
	payload.push({name: 'ads', value: adsPartition + '(' + adUrls.length + ')'})

	var port = chrome.extension.connect({ name: "inspect-content-port" });
	port.postMessage({'summary': payload, 'links': adUrls});
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

function ads(links, scripts){
	var ads = [];
	for(var i = 0; i < links.length; i++){
		if(isAd(links[i].href)) {
			ads.push(links[i].href);
		}
	}
	for(var i = 0; i < scripts.length; i++){
		console.log(isAd(scripts[i].src), scripts[i].src);
		if(isAd(scripts[i].src)) {
			ads.push(scripts[i].src);
		}
	}

	return ads;
}

function partition(count, partitions) {
	var r_partition = 'vhigh';
	switch(true){

	case count <= partitions[0]:
		r_partition = 'vlow';
		break;
	case count <= partitions[1]:
		r_partition = 'low';
		break;
	case count <= partitions[2]:
		r_partition = 'medium';
		break;
	case count <= partitions[3]:
		r_partition = 'high';
		break;
	}
	return r_partition;
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

var ad_pattern = "doubleclick|adclick|pagead|googleadservices|show_ads|pagefair|viglink|idgtn";


function isAd(text) {
	return !!text.match(new RegExp(ad_pattern, "i"));
}

inspectPage();

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		inspectPage();
	}
);
