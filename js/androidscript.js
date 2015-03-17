$(document).ready( function() {

    Parse.initialize("SBYhfUbIzN4jFYOYCg5acXyhZ6DAZjEMPmxPhcZM", "ACJPWbfahWN1jT40NUKjtJgJhJlBaQw4NvHe4q0k");
    var Attempt = Parse.Object.extend("Attempt");

    var accelx = 0,
        accely = 0,
        accelz = 0,
        delay = 60,
        currentUser = Parse.User.current();
    //     timerId = setInterval("ShowAlert()", 1000);
    
    // function ShowAlert() {
    //     if (delay != 0) {
    //         alert(delay);
    //         delay = delay - 1;
    //     }
    //     else {
    //         clearInterval(timerId);
    //     }
    // }

    if (!currentUser){
        window.open("login.html","_top");
    }

    var ratio = window.devicePixelRatio || 1;
    var screen_width = screen.width * ratio;
    var screen_height = screen.height * ratio;
    if ((currentUser.get('screen_width') != screen_width) || (currentUser.get('screen_height') != screen_height)){
        alert('The screen size of this device does not match the screen size of the device this account was created on.');
        window.open("login.html","_top");
    }

    console.log ("currentUser.get('username'): " + currentUser.get('username'));
    var pass_arr = currentUser.get('associated_password');
    $('#passcode_message').text('Enter passcode: ' + pass_arr);

    window.ondevicemotion = function(event) {
        accelx = event.accelerationIncludingGravity.x;
        accely = event.accelerationIncludingGravity.y;
        accelz = event.accelerationIncludingGravity.z;
    }

    var attempt = new Attempt();
    attempt.set('start_times', []);
    attempt.set('end_times', []);
    attempt.set('x_coords', []);
    attempt.set('y_coords', []);
    attempt.set('accel_x', []);
    attempt.set('accel_y', []);
    attempt.set('accel_z', []);
    attempt.set('buttons_pressed', []);
    attempt.set('associated_password', pass_arr);
    attempt.set('user', currentUser.get('username'));
    
    function log_tap_start(evt) 
    {
        attempt.add('start_times',(new Date()).getTime())
        keyRect = evt.originalEvent.target.getBoundingClientRect(),
        attempt.add('x_coords', String(parseInt(evt.originalEvent.touches[0].pageX) - parseInt(keyRect.left)));   //maybe change 0 to length - 1 ?????
        attempt.add('y_coords', String(parseInt(evt.originalEvent.touches[0].pageY) - parseInt(keyRect.top)));   //maybe change 0 to length - 1 ?????
        attempt.add('accel_x', accelx );
        attempt.add('accel_y', accely );
        attempt.add('accel_z', accelz );
        attempt.add('buttons_pressed', evt.originalEvent.target.id);
    }

    function log_tap_end(evt) 
    {
        attempt.add('end_times',(new Date()).getTime())
    }

    var numSlotsFilled = 0;
    var context = $('#passcode');

    $('.number').bind('touchstart', function(evt) { 
        // evt.originalEvent.target.style.backgroundColor = #E0FFFF;
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
                    attempt = new Attempt();
                    attempt.set('start_times', []);
                    attempt.set('end_times', []);
                    attempt.set('x_coords', []);
                    attempt.set('y_coords', []);
                    attempt.set('accel_x', []);
                    attempt.set('accel_y', []);
                    attempt.set('accel_z', []);
                    attempt.set('buttons_pressed', []);
                    attempt.set('associated_password', pass_arr);
                    attempt.set('user', currentUser.get('username'));
                    currentUser.increment('attempts_recorded');
                    currentUser.save(null, {
                        success: function(object) {
                            console.log ('attempts_recorded incremented');
                        }
                        error: function(model, error) {
                            console.log ('attempts_recorded failed to increment');
                        }
                    });
                },
                error: function(model, error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        }
        // evt.originalEvent.target.style.backgroundColor = transparent; 
    });

    $('#backspace').bind('touchstart', function(evt) {
        log_tap_start(evt);
    });

    /// CODE FOR HANDLING BACKSPACE /// 
    $('#backspace').bind('touchend', function(evt) {
        log_tap_end(evt);
        if (numSlotsFilled !== 0) {
            var lastSlot = $('#input_circles li:nth-of-type(' + numSlotsFilled + ')');
            lastSlot.text('____');
            numSlotsFilled--;
        }
    });
});
