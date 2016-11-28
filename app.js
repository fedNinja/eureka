
var url= 'https://api.meetup.com/2/open_events';
var pageCnt, totalNumOfPages, arr=[];


var initialize = function(data){
	if (data.results.length==0) {
		$('#errorMsg').removeClass('hidden');
		$('#errorMsg').append("No results found");
			
		} 
	else{
		$('#errorMsg').addClass('hidden');
		$('.app-form').hide();
		$('#listEvents').show();
		totalNumOfPages= Math.ceil((data.results.length)/5);
		pageCnt=1;
		arr=data.results;
		$('#goPrev').prop("disabled", true);
		if(totalNumOfPages==1) $('#goNext').prop("disabled", true);
		displayData(arr,pageCnt);
	}

}

var displayData = function(data, pageCnt){
		$('.app-form').hide();
		$('#listEvents').show();
			data.forEach(function(item, index){
			if((index<5*pageCnt-5) || (index>5*pageCnt-1)) return;
			var eTime=convertDateTime(item.time);
			$('.eventContainer').append('<div class="eventDesc"><div class="inlineDiv left"><p>'+eTime[0]+'</p><p>'+eTime[1]+'</p></div><div class="inlineDiv top"><a href="#" id="'+item.id+'" class="descClass"><span>'+item.group.name+'</span></a><p><a href="#" id="'+item.id+'"class="descClass"><span>'+item.name+'<span></a></p></div></div>');
			});
	}

	var clearAll= function(){
	$('.eventTitle').html("");
	$('.when').html("");
	$('.rsvp').html("");
	$('.where').html("");
	$('#details').html("");
	}


$('.eventContainer').on('click', '.descClass',function(e){
	clearAll();
	e.preventDefault();
	var displayedItem, displayedId;
	displayedId= this.id;
	$('.detailsEvent').show();
	$('.app-form').hide();
	$('#listEvents').hide();
	arr.forEach(function(item, index){
		if(item.id==displayedId) {
			displayedItem=item;
			}
	});
	$('#detailsContainer').show();
	var eventTime=convertDateTime(displayedItem.time);
	$('.eventTitle').append(displayedItem.name);
	$('.when').html("When: "+ eventTime);
	$('.rsvp').html("RSVP Count: "+ displayedItem.yes_rsvp_count);

	if(displayedItem.venue){
		initMap(displayedItem.venue.lat, displayedItem.venue.lon);
		$('.where').html("Where: "+displayedItem.venue.address_1 + ", " + displayedItem.venue.city +", "+ displayedItem.venue.state+", "+displayedItem.venue.localized_country_name);
	} else {
		$('#map').hide();
		$('.where').html("Where: remote");
	}
	$('#details').append(displayedItem.description);
	

});


$('.navbar').on('click','.goHome',function(e){
	$('#listEvents').hide();
	$('.app-form').show();
	$('.eventContainer').html("");
	$('#detailsContainer').hide();
});

 function initMap(newlat,newlon){
        var uluru = {lat: newlat, lng: newlon};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: uluru
        });
        var marker = new google.maps.Marker({
          position: uluru,
          map: map
        });
        $('#map').show();
      }


var convertDateTime = function(u_time){
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
var year= date.getFullYear();
var month= date.getMonth();
var formattedDate = day+"-"+monthOfYear[month]+"-"+year;
// Will display time in 10:30AM/PM format
var formattedTime = hours + ':' + minutes.substr(-2)+" "+period;
var returnarr=[formattedDate, formattedTime];
return returnarr;
}

$('#goHome').click(function(e){
	$('#listEvents').hide();
	$('.app-form').show();
	$('.eventContainer').html("");
});

$('#goNext').click(function(e){
	pageCnt++;
	$('.eventContainer').html("");
	$('#goPrev').prop("disabled", false);
	if(pageCnt == totalNumOfPages) {
		$('#goNext').prop("disabled", true);
			}
	displayData(arr, pageCnt);
});

$('#goPrev').click(function(e){
	pageCnt--;
	$('.eventContainer').html("");
	$('#goNext').prop("disabled", false);
	if(pageCnt == 1) {
		$('#goPrev').prop("disabled", true);
	}
	displayData(arr, pageCnt);
});




$(function(){

	function init(){
		var input = document.getElementById('inputValPlace');
		var autocomplete = new google.maps.places.Autocomplete(input);
	}

	google.maps.event.addDomListener(window, 'load', init);

		$('.app-form').submit(function(e){
		e.preventDefault();
		var value=$('#inputVal').val();
		var place=$('#inputValPlace').val();
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
					page: 30
				},
				success:function(data){
				initialize(data);
				},
				error:function(){
					console.log("Sorry, data not found");
				}
			});
			

		});
});


