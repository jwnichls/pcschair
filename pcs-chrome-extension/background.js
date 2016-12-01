var PCS_ASSIST_SERVER_HOST = "http://pcschair.org";
var PCS_VENUE_ID = 1;

var TIMER_VALUE = 5;
var PCS_USER_REF = null;

function updateVenueWithData(sendData, callback) {
	if (sendData.timer != null) {
		var newTime = new Date((new Date()).getTime() + TIMER_VALUE*60*1000);
		sendData.timer = newTime.toUTCString();
	}

	sendData = {venue: sendData};
	$.ajax({
	           type: "PUT",
	           url: PCS_ASSIST_SERVER_HOST + "/venues/" + PCS_VENUE_ID + ".json",
	           dataType: "json",
	           success: callback,
	           data: sendData
	       });	
}

chrome.runtime.onMessage.addListener(function(message, sender, callback) {
	if (message.type == "update") {
		updateVenueWithData(message.sendData,callback);
	}
	else if (message.type == "timer") {
		TIMER_VALUE = message.timerValue;
	}
	else if (message.type == "set-pcs-user-ref") {
		PCS_USER_REF = message.pcsUserRef;
	}
	else if (message.type == "open-pcs-page") {
		if (PCS_USER_REF != null) {
			chrome.tabs.create({'url': "https://precisionconference.com/~chi17pn/adminOnePaper?userRef=" + PCS_USER_REF + "&paperNumber=" + message.paperId + "&noHomeButton=true&noLogoutButton=true&closeWindowButton=true&anonView=true"});
		}
	}
});
