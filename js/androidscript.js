$(document).ready(function(){

    Parse.initialize("SBYhfUbIzN4jFYOYCg5acXyhZ6DAZjEMPmxPhcZM", "ACJPWbfahWN1jT40NUKjtJgJhJlBaQw4NvHe4q0k");
    var Attempt = Parse.Object.extend("Attempt");

    var accelx = 0;
    var accely = 0;
    var accelz = 0;

    window.ondevicemotion = function(event) {
        accelx = event.accelerationIncludingGravity.x;
        accely = event.accelerationIncludingGravity.y;
        accelz = event.accelerationIncludingGravity.z;
    }

    var attempt = new Attempt();
    attempt.set('start_times', [])
    attempt.set('end_times', [])
    attempt.set('start_x_coords', [])
    attempt.set('start_y_coords', [])
    
    function log_tap_start(evt) 
    {
        console.log ( 'start_time: ' + (new Date()).getTime())
        keyRect = evt.originalEvent.target.getBoundingClientRect(),
    	console.log ( 'Relative_X: ' + String(parseInt(evt.originalEvent.touches[0].pageX) - parseInt(keyRect.left)));   //maybe change 0 to length - 1 ?????
        console.log ( 'Relative_Y: ' + String(parseInt(evt.originalEvent.touches[0].pageY) - parseInt(keyRect.top)));   //maybe change 0 to length - 1 ?????
        console.log ( 'accelx: ' + accelx );
        console.log ( 'accely: ' + accely );
        console.log ( 'accelz: ' + accelz );
    }

    function log_tap_end(evt) 
    {
        console.log ( 'end_time: ' + (new Date()).getTime())
    }

    var numSlotsFilled = 0;
    var context = $('#passcode');

    $('.number').bind('touchstart', function(evt) { 
    	log_tap_start(evt); 
    });
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

    /// CODE FOR HANDLING BACKSPACE /// 
    $('#backspace').bind('touchend', function(evt) { 
        // get the last slot that was filled in and clear it
        if (numSlotsFilled !== 0) {
            var lastSlot = $('#input_circles li:nth-of-type(' + numSlotsFilled + ')');
            lastSlot.text('____');
            numSlotsFilled--;
        }
    });


});