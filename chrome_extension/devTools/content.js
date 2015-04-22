
/************************************************************************************************/
// page inspection
/************************************************************************************************/
function inspectPage(){

	if(window.location.hostname != 'www.google.co.nz'){
		var payload = [];

		var domain = window.location.hostname.replace(/^www\./,'');
		payload.push({name: 'domain', value: domain, meta: null});

		var url = window.location.hostname + window.location.pathname;
		// payload.push({name: 'url', value: url, meta: null});

		var images = document.querySelectorAll("img");
		var imagesPartition = partition(images.length, [5,20,100,300]);
		payload.push({name: 'images', value: images.length, meta: imagesPartition});

		var largest_image = largestImage(document.querySelectorAll("img"));
		var l_imagePartition = partition(Math.sqrt(largest_image.area), [100,200,500,1000]);
		payload.push({name: 'main image', value: largest_image.area, meta: JSON.stringify({h: largest_image.height, w: largest_image.width, p: l_imagePartition})});

		var links = document.querySelectorAll("a");
		var nonLocalLinks = offSiteLinks(links);
		var nonLocalPartition = partition(nonLocalLinks.length, [5,10,50,100]);
		payload.push({name: 'off site links', value: nonLocalLinks.length, meta: nonLocalPartition});

		var below_fold = mainContentBelowFold();
		payload.push({name: 'below fold', value: below_fold, meta: null});

		var scripts = document.querySelectorAll("script");
		var adUrls = ads(links, scripts);
		var adsPartition = partition(adUrls.length, [1,5,10,15]);
		payload.push({name: 'ads', value: adUrls.length, meta: adsPartition});

		var font_info = getFontData(document.querySelectorAll('*'));
		payload.push({name: 'font size', value: font_info.size, meta: font_info.count});
		payload.push({name: 'font family', value: font_info.family, meta: font_info.count});

		var doctype = docType(document.doctype);
		payload.push({name: 'html5', value: (doctype == 'html5'), meta: null});

		var message = {'summary': payload, 'links': adUrls, 'domain': domain, meta: null}
		return message;
	}
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
var ad_pattern = "doubleclick|adclick|pagead|googleadservices|show_ads|pagefair|viglink|idgtn|swiffy";

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
	if (doctype_el === null || doctype_el === '') {
		return false;
	}

	var type = new XMLSerializer().serializeToString(doctype_el);

	var std_html5 = /<!doctype html>/i.test(type);
	//var alt_html5 = /<!doctype html system "about:legacy-compat">/i.test(type);

	return std_html5;// || atl_html5;
};
// doctype stuff END

/*===============================================================================================*/
// image size stuff

function largestImage(img_els){

  var image_areas = [].map.call(img_els, function(node) {
    var bounds = node.getBoundingClientRect();
    return {tag: node.outerHTML, area: bounds.width * bounds.height, height: bounds.height, width: bounds.width};
  }).sort(function(x, y) {
    var a = x.area, b= y.area;
    return a > b ? -1 : a < b ? 1 : 0;
  });


	return image_areas[0];
}
// image size stuff END

/*===============================================================================================*/
// below fold stuff

function mainContentBelowFold(){
	var below = true;
	var main_node = scanWordCount(document.querySelectorAll('*'))[0].node;
	var rect = main_node.getBoundingClientRect();
	// rect.top, rect.right, rect.bottom, rect.left;
	below = window.innerHeight < rect.top;
	return below;
}
// below fold stuff END

/*===============================================================================================*/
// font data stuff

//getFontData(document.querySelectorAll('*'));
function getFontData(nodes){
	console.time("getFontData");

	var scaned = scanWordCount(nodes)
	var node = scaned[0].node
	var fi = fontInfo(node);
	fi.count = scaned[0].word_count;

	console.timeEnd("getFontData");
	return fi;
}

function fontInfo(el){

	var info = {};
	info.family = '';
	info.size = '';
	info.node = '';

	if (el) {
		styles = window.getComputedStyle(el);
		info.family = styles.fontFamily;
		info.size = parseFloat(styles.fontSize.replace('px',''));
		info.node = el;
	}

	return info;
}

function scanWordCount(nodes) {
	var matches, count, clean, a;
	return [].map.call(nodes, function(node) {
		count = 0;
		clean = !/<([B-OQ-Z][A-Z0-9]*)\b[^>]*>/i.test(node.innerHTML)
		if (clean && !/script|style|title/i.test(node.tagName) && node.textContent){
			matches = node.textContent.match(/[^\s]+/g);
			count = matches == null ? 0 : matches.length;
		}
		return {tag: node.outerHTML, word_count: count, node: node};
	}).sort(function(x, y) {
		a = x.word_count, b= y.word_count;
		return a > b ? -1 : a < b ? 1 : 0;
	});
}
// font type stuff END

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

function yesNo(e){
	var m = inspectPage();
	var liked = false;
	if (e.target.id == 'yes_button'){
		liked = true;
		m.summary.push({name: 'liked', value: liked, meta: null});
		m.liked = liked;
	} else if(e.target.id == 'no_button') {
		liked = false;
		m.summary.push({name: 'liked', value: liked, meta: null});
		m.liked = liked;
	} else if(e.target.id == 'inspect_button') {

	}

	console.log(m);

	var port = chrome.extension.connect({ name: "inspect-content-port" });
	port.postMessage(m);
}

function addYesNo(){
	var buttonStyle = 'padding: 5px; margin: 8px;'
	var d = document.createElement("div");

	var ib = document.createElement("button");
	ib.setAttribute("style", buttonStyle);
	ib.textContent = 'inspect';
	ib.id = 'inspect_button';
	ib.onclick = yesNo;

	var yb = document.createElement("button");
	yb.setAttribute("style", buttonStyle);
	yb.textContent = 'yes';
	yb.id = 'yes_button';
	yb.onclick = yesNo;

	var nb = document.createElement("button");
	nb.setAttribute("style", buttonStyle);
	nb.textContent = 'no';
	nb.id = 'no_button';
	nb.onclick = yesNo;

	d.appendChild(ib);
	d.appendChild(yb);
	d.appendChild(nb);
	d.setAttribute("style","background: #3559CA; border-radius: 4px; border: 1px solid #ccc; padding: 5px; top: 0px; position: absolute; right: 0px; margin: 10px; z-index: 99999999;");

	document.querySelector('body').appendChild(d);
}


if(window.location.hostname != 'www.google.co.nz'){
	addYesNo();
}

// inspectPage();

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		// inspectPage();
		augmentResults();
	}
);
