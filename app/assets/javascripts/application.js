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

var clientServerClockOffset = 0;
var secondsWasZero = false;

function connectVolume() {
	$("#volumeRange").change(function(e) {
		var volumeFloat = parseFloat($("#volumeRange").val());
		notifyAudio.volume = timerAudio.volume = volumeFloat;
	})
}

function startTimer() {
	setInterval(function() {
		if (pcsVenueInfo.timer != null && !pcsVenueInfo.breaktime) {
			var timeNow = (new Date()).getTime() + clientServerClockOffset;
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
	
	if (pcsVenueInfo.pcs2_flag) {
		$("#pcs2flag").text("true");
	} else {
		$("#pcs2flag").text("false");
	}

	if (pcsVenueInfo.pcs2_venue_name) {
		$("#pcs2venueName").text(pcsVenueInfo.pcs2_venue_name);
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
	$("#queue-count").html(pcsVenueInfo.papers.length + "");

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

			var paperLink = $("<a></a>").text(paperId).addClass("paperLink");
			if (pcsVenueInfo.pcs2_flag && pcsVenueInfo.pcs2_venue_name != null) {
				paperLink.attr("href","https://new.precisionconference.com/" + pcsVenueInfo.pcs2_venue_name + "/chair/subs/" + paperId);
			} else if (pcsUserRef != null) {
				paperLink.attr("href","https://confs.precisionconference.com/~chi18a/adminOnePaper?userRef=" + pcsUserRef + "&paperNumber=" + paperId + "&noHomeButton=true&noLogoutButton=true&closeWindowButton=true");
			}
			paperItem.append(paperLink);

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
		} else {
			if (pcsVenueInfo.pcs2_flag && pcsVenueInfo.pcs2_venue_name != null) {
				var paperLink = $("<a></a>").text(paperId).addClass("paperLink");
				paperLink.attr("href","https://new.precisionconference.com/" + pcsVenueInfo.pcs2_venue_name + "/committee/subs/" + paperId);
				paperItem.append(paperLink);
			} else {
				paperItem.append($("<span></span>").text(paperId));
			}
		}
		
		$("#paper-queue").append(paperItem);
	}
}

function forcePageRefresh(callback) {
	$.getJSON("/venues/" + venueID + ".json",function(data) {
		if (data.timer != null)
			data.timer = Date.parse(data.timer);
		
		// If we move from an active paper to an inactive state, play the alert sound	
		if (notifyAudio != null && pcsVenueInfo != null && pcsVenueInfo.active_paper && !data.active_paper && !data.breaktime)
			notifyAudio.play();
		
		// If we move to a different paper than previous, play the alert sound
		if (notifyAudio != null && pcsVenueInfo != null && pcsVenueInfo.active_paper && data.active_paper && pcsVenueInfo.paper_pcs_id != data.paper_pcs_id)
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


// the following comes from: 
// http://stackoverflow.com/questions/1638337/the-best-way-to-synchronize-client-side-javascript-clock-with-server-date

// the NTP algorithm
// t0 is the client's timestamp of the request packet transmission,
// t1 is the server's timestamp of the request packet reception,
// t2 is the server's timestamp of the response packet transmission and
// t3 is the client's timestamp of the response packet reception.
function ntp(t0, t1, t2, t3) {
    return {
        roundtripdelay: (t3 - t0) - (t2 - t1),
        offset: ((t1 - t0) + (t2 - t3)) / 2
    };
}

function setClockSync() {

	// calculate the difference in seconds between the client and server clocks, use
	// the NTP algorithm, see: http://en.wikipedia.org/wiki/Network_Time_Protocol#Clock_synchronization_algorithm
	var t0 = (new Date()).valueOf();

	$.ajax({
	    url: '/ntp',
	    success: function(servertime, text, resp) {
			var serverTimeInt = parseInt(servertime);

	        // NOTE: t2 isn't entirely accurate because we're assuming that the server spends 0ms on processing.
	        // (t1 isn't accurate either, as there's bound to have been some processing before that, but we can't avoid that)
	        var t1 = serverTimeInt,
	            t2 = serverTimeInt,
	            t3 = (new Date()).valueOf();

	        // we can get a more accurate version of t2 if the server's response
	        // contains a Date header, which it generally will.
	        // EDIT: as @Ariel rightly notes, the HTTP Date header only has 
	        // second resolution, thus using it will actually make the calculated
	        // result worse. For higher accuracy, one would thus have to 
	        // return an extra header with a higher-resolution time. This 
	        // could be done with nginx for example:
	        // http://nginx.org/en/docs/http/ngx_http_core_module.html
	        // var date = resp.getResponseHeader("Date");
	        // if (date) {
	        //     t2 = (new Date(date)).valueOf();
	        // }

	        var c = ntp(t0, t1, t2, t3);

	        // log the calculated value rtt and time driff so we can manually verify if they make sense
	        console.log("NTP delay:", c.roundtripdelay, "NTP offset:", c.offset, "corrected: ", (new Date(t3 + c.offset)));
	
			clientServerClockOffset = c.offset;
	    }
	});	
}