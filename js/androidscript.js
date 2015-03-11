$(document).ready(function(){

    Parse.initialize("SBYhfUbIzN4jFYOYCg5acXyhZ6DAZjEMPmxPhcZM", "ACJPWbfahWN1jT40NUKjtJgJhJlBaQw4NvHe4q0k");
    var Attempt = Parse.Object.extend("Attempt");
    
    var attempt = new Attempt();
    attempt.set('start_times', [])
    attempt.set('end_times', [])
    attempt.set('start_x_coords', [])
    attempt.set('start_y_coords', [])
    
    function log_tap_start(evt) 
    {
    	console.log ( 'evt.originalEvent.target.attr("id"): ' + evt.originalEvent.target );
        console.log ('$(this).offset().top: ' + $(this).attr("id"));
    	// console.log ( 'evt.originalEvent.target.position().left: ' + evt.originalEvent.target.position().left );
    	console.log ( 'evt.originalEvent.touches[0].pageX: ' + evt.originalEvent.touches[0].pageX );   //maybe change 0 to length - 1 ?????
  		// var x = elem.offset().left; //evt.pageX - evt.target.offset().left;
		// var y = elem.offset().top;  //evt.pageY - evt.target.offset().top;
    }

    function log_tap_end(evt) 
    {
        console.log ('end');
    }

    var numSlotsFilled = 0;

    $('.number').bind('touchstart', function(evt) { 
    	log_tap_start(evt); 
    });
    $('.number').bind('touchend', function(evt) { 
    	log_tap_end(evt); 
    });

    /// FastClick CODE /// 
    // $(function() {
    //     FastClick.attach(document.body);
    // });

    // /// CODE FOR PREVENTING SCROLLING
    // document.body.addEventListener('touchstart', function(e){ 
    //     e.preventDefault(); 
    // });

    /// CODE FOR FILLING IN SLOTS ///
    
    // establish context for faster search
    // var context = $('#passcode');
    
    // $('.number', context).click(function() {      //Change to fastButton

    //     // clear the success message if it is there
    //     $('#successMsg', context).text('');
        
    //     // fill in the next empty slot with a circle
    //     var nextSlot = $('#input_circles li:nth-of-type(' + (numSlotsFilled + 1) + ')');
    //     nextSlot.text('O');
    //     numSlotsFilled++;
        
    //     // clear all the slots if the passcode is complete
    //     if (numSlotsFilled === 4){
    //         $('#input_circles li').text('____');
    //         numSlotsFilled = 0;
            
    //         // print a success message on completion
    //         $('#successMsg', context).text('Thanks!');
    //         attempt.save(null, {
    //             success: function(object) {
    //                 console.log('attempt successfully saved');
    //             },
    //             error: function(model, error) {
    //                 console.log('attempt failed to save');
    //             }
    //         });
    //     }
    // });

    // /// CODE FOR HANDLING BACKSPACE /// 
    // $('#backspace', context).click(function() {            //Change to fastButton
    //     // get the last slot that was filled in and clear it
    //     if (numSlotsFilled !== 0) {
    //         var lastSlot = $('#input_circles li:nth-of-type(' + numSlotsFilled + ')');
    //         lastSlot.text('____');
    //         numSlotsFilled--;
    //     }
    // });


});