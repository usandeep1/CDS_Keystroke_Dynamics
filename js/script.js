$(document).ready(function(){

    Parse.initialize("SBYhfUbIzN4jFYOYCg5acXyhZ6DAZjEMPmxPhcZM", "ACJPWbfahWN1jT40NUKjtJgJhJlBaQw4NvHe4q0k");
    var TestUserObject = Parse.Object.extend("TestUserObject");
    
    document.body.addEventListener('touchstart', function(event) {
        console.log('touchstart:' + (new Date()).getTime());
    }, false);

    document.body.addEventListener('touchend', function(event) {
        console.log('touchend: ' + (new Date()).getTime());
    }, false);

    document.body.addEventListener('click', function(event) {
        console.log('click: ' + (new Date()).getTime());
    }, false);

    var numSlotsFilled = 0;

    /// FastClick CODE /// 
    $(function() {
        FastClick.attach(document.body);
    });

    /// CODE FOR FILLING IN SLOTS ///
    
    // establish context for faster search
    var context = $('#passcode');
    
    $('.number', context).click(function() {
        // clear the success message if it is there
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

            var testusrObj = new TestUserObject();
            testusrObj.save({'click_start': (new Date()).getTime()}, {
                success: function(object) {
                    console.log('successfully saved');
                },
                error: function(model, error) {
                    console.log('failed to save');
                }
            });
        }
    });

    /// CODE FOR HANDLING BACKSPACE /// 
    $('#backspace', context).click(function() {
        // get the last slot that was filled in and clear it
        if (numSlotsFilled !== 0) {
            var lastSlot = $('#input_circles li:nth-of-type(' + numSlotsFilled + ')');
            lastSlot.text('____');
            numSlotsFilled--;
        }
    });


});