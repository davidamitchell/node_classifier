window.onload = function() {
	var port = chrome.extension.connect({ name: "rerun-inspect-port" });
	document.getElementById("button").onclick = function() {
		port.postMessage({});
	}
}

function log(text) {

  var t = document.createTextNode(text);
  var p = document.createElement("div")
	p.appendChild(t);

	document.getElementById('log').appendChild(p);
}


function do_something(msg){
	var tableRef = document.getElementById('dev-tools-table');
	for (var i = tableRef.rows.length - 1; i > 0; i--) {
		tableRef.deleteRow (i);
	}

	var summary = msg.summary;
	for (var i = 0; i < summary.length; i++) {
		var newRow = tableRef.insertRow(tableRef.rows.length);
		newRow.insertCell(0).appendChild(document.createTextNode(summary[i].name));
		newRow.insertCell(1).appendChild(document.createTextNode(summary[i].value));
	}



	for (var i = 0; i < msg.links.length; i++) {
		log(msg.links[i]);
	}
}
