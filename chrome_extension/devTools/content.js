
/************************************************************************************************/
// page inspection
/************************************************************************************************/
function inspectPage(){
	var payload = [];

	var domain = window.location.hostname.replace(/^www\./,'');
	payload.push({name: 'domain', value: domain, meta: null})

	var url = window.location.hostname + window.location.pathname
	payload.push({name: 'url', value: url, meta: null})

	var images = document.querySelectorAll("img");
	var imagesPartition = partition(images.length, [5,20,100,300])
	payload.push({name: 'images', value: imagesPartition, meta: images.length})

	var links = document.querySelectorAll("a");
	var nonLocalLinks = offSiteLinks(links)
	var nonLocalPartition = partition(nonLocalLinks.length, [5,10,50,100])
	payload.push({name: 'off site links', value: nonLocalPartition, meta: nonLocalLinks.length})

	var scripts = document.querySelectorAll("script");
	var adUrls = ads(links, scripts)
	var adsPartition = partition(adUrls.length, [1,5,10,15])
	payload.push({name: 'ads', value: adsPartition, meta: adUrls.length})

	var doctype = docType(document.doctype);
	payload.push({name: 'doctype', value: doctype, meta: null})

	var port = chrome.extension.connect({ name: "inspect-content-port" });
	port.postMessage({'summary': payload, 'links': adUrls, 'domain': domain, meta: null});
}
/*===============================================================================================*/
// counts to string stuff
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
// counts to string stuff END


/*===============================================================================================*/
// link stuff
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
// link stuff END

/*===============================================================================================*/
// ad stuff
var ad_pattern = "doubleclick|adclick|pagead|googleadservices|show_ads|pagefair|viglink|idgtn";

function ads(links, scripts){
	var ads = [];
	for(var i = 0; i < links.length; i++){
		if(isAd(links[i].href)) {
			ads.push(links[i].href);
		}
	}
	for(var i = 0; i < scripts.length; i++){
		// console.log(isAd(scripts[i].src), scripts[i].src);
		if(isAd(scripts[i].src)) {
			ads.push(scripts[i].src);
		}
	}

	return ads;
}

function isAd(text) {
	return !!text.match(new RegExp(ad_pattern, "i"));
}
// ad stuff END

/*===============================================================================================*/
// doctype stuff

function docType(doctype_el){
	var type;

	if(is_html5(doctype_el)){
		type = 'html5';
	} else {
		type = 'other';
	}

	return type;
}

var is_html5 = function (doctype_el) {
    if (doctype_el === null || doctype_el === '') return false;

    var type = new XMLSerializer().serializeToString(doctype_el);

		var std_html5 = /<!doctype html>/i.test(type)
		var alt_html5 = /<!doctype html system "about:legacy-compat">/i.test(type)

    return std_html5 || atl_html5;
};

// doctype stuff END

/************************************************************************************************/
// page inspection END



/************************************************************************************************/
// result augementing
/************************************************************************************************/
function orderResults(results){
	var a_results = []
	for (var i = 0, result; result = results[i]; i++) {
		result.setAttribute('order', getResultWeight(result));
		a_results.push(result);
	}

	function order(a,b){
		if (a.getAttribute('order') < b.getAttribute('order')) {
			return -1;
		}
		if (a.getAttribute('order') > b.getAttribute('order')) {
			return 1;
		}
		return 0;
	}

	return a_results.sort(order);
}

function getResultWeight(result){
	//would look up result in local storage
	var weight = Math.random();
	return weight;
}


function augmentResults(){
	if(window.location.hostname == 'www.google.co.nz'){
		// var viewport = document.getElementById("main");
		// viewport.setAttribute("style","width:50%;float:left;");
		if (document.getElementById('imagebox_bigimages')){
			document.getElementById('imagebox_bigimages').remove();
		}
		document.getElementById('rhs_block').innerHTML = '';

		var d = document.createElement("div");
		d.setAttribute("style","background:#ddd;border:1px solid #ccc;padding:15px;top:-40px;position:relative;");

		// the results of the search (first page)
		results = document.querySelectorAll(".rc");
		orderedResults = orderResults(results);

		for (var i = 0, result; result = orderedResults[i]; i++) {
			var dup = result.cloneNode(true);
			dup.setAttribute("style","padding: 10px; margin-top:10px;");
			d.appendChild(dup);
		}
		// repurpose the 'more info box' to hold the aumented results
		document.getElementById('rhs_block').appendChild(d);
	}
}
/************************************************************************************************/
// result augementing END



inspectPage();

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		inspectPage();
		augmentResults();
	}
);
