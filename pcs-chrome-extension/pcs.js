var AUTOSET_TIMER_FLAG = true;
var AUTOSET_TIMER_INTERVAL = 5;

$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}

$(function() {
	if (window.location.pathname.indexOf("adminOnePaper") >= 0) {
		var paperId = $.urlParam("paperNumber");
		var title = $("h1 font").text();
		var authors = "";
		
		var authorRows = $("h3 font table tbody tr");
		for(var i = 0; i < authorRows.length; i++) {
			if (i > 0) authors += "\n";
			
			var name = $($(authorRows[i]).children("td")[0]).text();
			var affiliation = $($(authorRows[i]).children("td")[2]).text();
			authors += name + " - " + affiliation;
		}
		
		// alert("ID: " + paperId + "\nTitle: " + title + "\n" + authors);
		var sendData = {
			"paper_title" : title,
		    "paper_authors" : authors,
		    "paper_pcs_id" : paperId,
			"active_paper" : true
		}

		if (AUTOSET_TIMER_FLAG) {
			var newTime = new Date((new Date()).getTime() + AUTOSET_TIMER_INTERVAL*60*1000);
			sendData.timer = newTime.toUTCString();
		}
		
		chrome.runtime.sendMessage(sendData, function() {
		    // active paper data updated
		});
	}

	$(window).on("unload",function() {
		var sendData = {
			"paper_title" : "",
		    "paper_authors" : "",
			"active_paper" : false
		}

		if (AUTOSET_TIMER_FLAG) {
			sendData.timer = null;
		}

		chrome.runtime.sendMessage(sendData, function() {
			// active paper turned to false
		});	
	})
})
