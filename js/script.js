$(document).ready(function(){

    var numSlotsFilled = 0;

    // FastClick code
    $(function() {
        FastClick.attach(document.body);
    });

    $('.number').click(function() {
        // find the next empty slot and fill it with a circle
        $('#successMsg').text('');
        for (var i=1; i <= 4; i++){
            var nextSlot = $('li:nth-of-type(' + i + ')');
            if (nextSlot.text() !== 'O'){
                nextSlot.text('O');
                numSlotsFilled++;
                break;
            }
        }
        // clear the slots if the passcode is complete
        if (numSlotsFilled === 4){
            for (var i=1; i <= 4; i++){
                var nextSlot = $('li:nth-of-type(' + i + ')');
                nextSlot.text('____');
            }
            numSlotsFilled = 0;
            // print a success message on completion
            $('#successMsg').text('Thanks!');
        }
    });

    // code for handling backspace
    $('#backspace').click(function() {
        for (var i=1; i <= 4; i++){
            var nextSlot = $('li:nth-last-of-type(' + i + ')');
            if (nextSlot.text() === 'O'){
                nextSlot.text('____');
                numSlotsFilled--;
                break;
            }
        }
    });

});