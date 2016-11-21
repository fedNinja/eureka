
var url= 'https://api.meetup.com/2/open_events';

var displayData = function(data){
	if (!data.meta) {
		$('#listEvents').hide();
		$('.errorDiv').append('<div class="top"><span>'+data.details+'</span></div>');
		$('.errorDiv').show();
		
	} else {
		$('.container').hide();
		$('#listEvents').show();
		data.results.forEach(function(item, index){
			var eTime=convertDateTime(item.time);
			console.log("time is "+eTime);
			$('#event'+[index+1]).append('<div class="inlineDiv left"><p>'+eTime[0]+'</p><p>'+eTime[1]+'</p></div><div class="inlineDiv top"><a href="'+item.event_url+'"><span>'+item.group.name+'</span></a><p><a href="'+item.event_url+'"><span>'+item.name+'<span></a></p></div>');
			
		});
	}
}


var convertDateTime = function(u_time){
	console.log(u_time);
	var monthOfYear=["January", "Febrauray", "March", "April", "May", "June", "July","August", "September","October", "November","December"];
	var date = new Date(u_time);
// Hours part from the timestamp
var period;
var hours = date.getHours();
if (hours>12){hours= (hours-12);
	period= "PM";} 
	else{ hours=hours;
		period= "AM";}
// Minutes part from the timestamp
var minutes = "0" + date.getMinutes();
var day= date.getDate();
console.log("the day of event is", day);
var year= date.getFullYear();
console.log("the year of the event is", year);
var month= date.getMonth();
console.log("the month of the event is", monthOfYear[month]);
var formattedDate = day+"-"+monthOfYear[month]+"-"+year;
console.log("the formatted date is", formattedDate);
// Will display time in 10:30AM/PM format
var formattedTime = hours + ':' + minutes.substr(-2)+" "+period;
var returnarr=[formattedDate, formattedTime];
return returnarr;
}

$('#goHome').click(function(e){
	$('#listEvents').hide();
	$('.container').show();
	//TODO:check that append issue
});

$('#goNext').click(function(e){


});




$(function(){

	function init() {
		var input = document.getElementById('inputValPlace');
		var autocomplete = new google.maps.places.Autocomplete(input);
	}

	google.maps.event.addDomListener(window, 'load', init);

	

	$('#search').click(function(e){
		e.preventDefault();
		var value=$('#inputVal').val();
		var place=$('#inputValPlace').val();
		console.log("place is", place);
			//console.log(typeof(place));
			//console.log(place.split(", "));
			var arr= place.split(", "); 
			$.ajax({
				dataType:'jsonP',
				url: url,
				type:'GET',
				data: {
					key: '1736634714527352a143e6011107e7f',
					sign: true, 
					host: 'public',		
					country: "US",
					topic: value,
					city: arr[0],
					state: arr[1],
					page: 20
				},
				success:function(data){
					console.log(data);
					displayData(data);
					
				},
				error:function(){
					console.log("Sorry, data not found");
				}
			});
			

		});
});

