// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require bootstrap
//= require_tree .

var secondsWasZero = false;

function startTimer() {
	setInterval(function() {
		if (pcsVenueInfo.timer != null) {
			var timeNow = (new Date()).getTime();
			var timeDiff = pcsVenueInfo.timer - timeNow;

			var minutes = 0;
			var seconds = 0;
			
			if (timeDiff > 0) {
				$("#timer").removeClass("expired");
				
				var minutes = Math.floor(timeDiff / (60*1000));
				var seconds = Math.floor(timeDiff / 1000) - (minutes * 60);
			} else {				
				$("#timer").addClass("expired");
				
				var minutes = Math.abs(Math.ceil(timeDiff / (60*1000)));
				var seconds = Math.abs(Math.ceil((timeDiff + (minutes * 60*1000)) / 1000));
				
				if (!secondsWasZero && timerAudio != null && minutes == 0 && seconds == 0) {
					secondsWasZero = true;
					timerAudio.play();
				} else {
					secondsWasZero = false;
				}
			}
			
			
			if (seconds < 10) {
				seconds = "0" + seconds;
			}
			
			$("#timer").html(minutes + ":" + seconds);
		} else {
			$("#timer").removeClass("expired");
			$("#timer").html("0:00");
		}
	}, 1000);
}

function replacePaperInfo() {
	if (pcsVenueInfo.active_paper) {
		var id = $("<p></p>").addClass("paper-id").text("Paper #" + pcsVenueInfo.paper_pcs_id);
		var title = $("<p></p>").addClass("paper-title").text(pcsVenueInfo.paper_title);
		var authors = $("<ul></ul>").addClass("paper-authors");
		
		var authorStrs = pcsVenueInfo.paper_authors.split("\n");
		for(i = 0; i < authorStrs.length; i++)
			authors.append($("<li></li>").addClass("author").text(authorStrs[i]));

		$("#paper-info").empty().append(id,title,authors);
	} else {
		$("#paper-info").html('<p class="no-active-paper">No Active Paper</p>');
	}
}

function refreshPage() {

	if (pcsVenueInfo.breaktime) {
		$("#break").removeClass("invisible");
		$("#main").addClass("invisible");
	} else {
		replacePaperInfo();
		$("#break").addClass("invisible");
		$("#main").removeClass("invisible");
	}				
}

function makePaperMoveClickHandler(direction, paperId) {
	var sendData = { 
			dir : direction,
			pcs_id : paperId
		};

	return function() {
		$.ajax({
		           type: "PUT",
		           url: "/venues/" + venueID + "/movepaper",
		           dataType: "json",
		           success: function() { forcePapersRefresh(); },
		           data: sendData
		       });	
	}
}

function makePaperRemoveClickHandler(paperId) {
	var sendData = { 
			pcs_id : paperId
		};

	return function() {
		$.ajax({
		           type: "DELETE",
		           url: "/venues/" + venueID + "/removepaper",
		           dataType: "json",
		           success: function() { forcePapersRefresh(); },
		           data: sendData
		       });	
	}
}

function refreshPapers() {
	$("#paper-queue").empty();
	
	for(i = 0; i < pcsVenueInfo.papers.length; i++) {
		var paperId = pcsVenueInfo.papers[i].pcs_paper_id;
		var paperItem = $("<li></li>").addClass("paper");
		if (adminFlag) {
			if (i != 0) {
				var upLink = $("<a></a>").addClass("upLink").html('<img src="/assets/up.jpg" width="12"/>');
				paperItem.append(upLink);
				upLink.click(makePaperMoveClickHandler(true, paperId));				
			} else {
				paperItem.append($('<img src="/assets/clear.jpg" width="12"/>'));
			}
		}
		paperItem.append(" " + paperId + " ");
		if (adminFlag) {
		 	if (i != pcsVenueInfo.papers.length-1) {
				var downLink = $("<a></a>").addClass("downLink").html('<img src="/assets/down.jpg" width="12"/>');
				paperItem.append(downLink);
				downLink.click(makePaperMoveClickHandler(false, paperId))
			} else {
				paperItem.append($('<img src="/assets/clear.jpg" width="12"/>'));
			}
			var removeLink = $("<a></a>").addClass("removeLink").html('<img src="/assets/remove.jpg" width="12"/>');
			paperItem.append(" ",removeLink);
			removeLink.click(makePaperRemoveClickHandler(paperId));
		}
		
		$("#paper-queue").append(paperItem);
	}
}

function forcePageRefresh(callback) {
	$.getJSON("/venues/" + venueID + ".json",function(data) {
		if (data.timer != null)
			data.timer = Date.parse(data.timer);
			
		if (notifyAudio != null && pcsVenueInfo != null && pcsVenueInfo.active_paper && !data.active_paper)
			notifyAudio.play();
			
		pcsVenueInfo = data;

		refreshPage();
		
		if (callback) callback();
	})
}

function forcePapersRefresh(callback) {
	$.getJSON("/venues/" + venueID + "/papers",function(data) {
		pcsVenueInfo.papers = data;

		refreshPapers();

		if (callback) callback();
	})	
}

function startVenueUpdate() {
	setInterval(function() {
		forcePageRefresh();
		forcePapersRefresh();
	}, 5000)
}

function updateVenueWithData(sendData, callback) {
	sendData = {venue: sendData};
	$.ajax({
	           type: "PUT",
	           url: "/venues/" + venueID + ".json",
	           dataType: "json",
	           success: callback,
	           data: sendData
	       });	
}
