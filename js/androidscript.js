$(document).ready(function(){

    Parse.initialize("SBYhfUbIzN4jFYOYCg5acXyhZ6DAZjEMPmxPhcZM", "ACJPWbfahWN1jT40NUKjtJgJhJlBaQw4NvHe4q0k");
    var Attempt = Parse.Object.extend("Attempt");
    
    var attempt = new Attempt();
    attempt.set('start_times', []);
    attempt.set('end_times', []);
    attempt.set('start_x_coords', []);
    attempt.set('start_y_coords', []);

    var numSlotsFilled = 0;

    $('.number').bind('touchstart', function(evt) { 
    	log_tap_start(evt); 
    });

    function log_tap_start(evt) 
    {
    	console.log ( elem.attr ('id') );
    	console.log ( 'e.originalEvent.touches[0].pageX;: ' + evt.originalEvent.touches[0].pageX);
    	console.log ( 'e.originalEvent.pageX;: ' + evt.originalEvent.pageX;);
  		// var x = elem.offset().left; //evt.pageX - evt.target.offset().left;
		// var y = elem.offset().top;  //evt.pageY - evt.target.offset().top;
  		attempt.add('start_times',(new Date()).getTime());
    }

    $('.number').bind('touchend', function(evt) { 
    	log_tap_end(evt); 
    	$('#successMsg', context).text('');
    	// fill in the next empty slot with a circle
        var nextSlot = $('#input_circles li:nth-of-type(' + (numSlotsFilled + 1) + ')');
        nextSlot.text('O');
        numSlotsFilled++;
        
        // clear all the slots if the passcode is complete
        if (numSlotsFilled === 4){
            $('#input_circles li').text('____');
            numSlotsFilled = 0;
            
            // print a success message on completion
            $('#successMsg', context).text('Thanks!');
            attempt.save(null, {
                success: function(object) {
                    console.log('attempt successfully saved');
                },
                error: function(model, error) {
                    console.log('attempt failed to save');
                }
            });
        }
    });

    function log_tap_end(elem) 
    {
        console.log ('end');
        attempt.add('end_times',(new Date()).getTime());
    }

    /// CODE FOR HANDLING BACKSPACE /// 
    $('#backspace').bind('touchend', function() { 
        // get the last slot that was filled in and clear it
        if (numSlotsFilled !== 0) {
            var lastSlot = $('#input_circles li:nth-of-type(' + numSlotsFilled + ')');
            lastSlot.text('____');
            numSlotsFilled--;
        }
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


});