var AUTOSET_TIMER_FLAG = true;
var AUTOSET_TIMER_INTERVAL = 5;

var PCS_USER_REF = null;

$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}

function PCSCHAIRclearActivePaper(closeFlag) {
	var sendData = {
		"paper_title" : "",
	    "paper_authors" : "",
		"active_paper" : false
	}

	if (AUTOSET_TIMER_FLAG) {
		sendData.timer = null;
	}

	chrome.runtime.sendMessage({type: "update", sendData: sendData }, function() {
		if (closeFlag) window.close();
	});	
}

$(function() {
	if (window.location.host == "precisionconference.com") {
		var pcsUserRef = $.urlParam("userRef");
		if (pcsUserRef != null) {
			chrome.runtime.sendMessage({type: "set-pcs-user-ref", pcsUserRef: pcsUserRef }, function() {
			    // pcs user ref updated
			});
		}
	}
	
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
		
		alert("ID: " + paperId + "\nTitle: " + title + "\n" + authors);
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
		
		chrome.runtime.sendMessage({type: "update", sendData: sendData }, function() {
		    // active paper data updated
		});
		
		/*
		 * Removing automatic unload
		
		$($("a.rollover")[0])
			.attr("href",'')
			.click(function() { PCSCHAIRclearActivePaper(true); });
			
		$(window).on("beforeunload",function() {
			PCSCHAIRclearActivePaper(false);
		})
		*/		
	}
	else if (window.location.host == "pcschair.org" && window.location.pathname.indexOf("admin") > 0) {
		var updateFunc = function() {
			var increment = parseInt($("#timerNum").val());
			if (Number.isInteger(increment)) {
				chrome.runtime.sendMessage({type: "timer", timerValue: increment}, function() {
					// timer value updated
				})
			}
		}
		
		$("#timerNum").change(updateFunc);
		updateFunc();
		
		$("#paper-queue").click(function(event) {
			if ($(event.target).hasClass("paperLink")) {
				var paperId = $(event.target).text();
				chrome.runtime.sendMessage({type: "open-pcs-page", paperId: paperId}, function(response) {
				    // hopefully the page opened
				});
			}
		})
	}
})
