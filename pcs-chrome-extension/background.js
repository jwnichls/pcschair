var PCS_ASSIST_SERVER_HOST = "http://localhost:3000";
var PCS_VENUE_ID = 1;

function updateVenueWithData(sendData, callback) {
	sendData = {venue: sendData};
	$.ajax({
	           type: "PUT",
	           url: PCS_ASSIST_SERVER_HOST + "/venues/" + PCS_VENUE_ID + ".json",
	           dataType: "json",
	           success: callback,
	           data: sendData
	       });	
}

chrome.runtime.onMessage.addListener(function(sendData, sender, callback) {
	updateVenueWithData(sendData,callback);
});