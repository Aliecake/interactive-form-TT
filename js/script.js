console.log('Dear reviewer... If jQuery is not working, check the README.md.');

$('#name').focus();
$('#other').hide();
$('#paypal').hide();
$('#bitcoin').hide();

//add new option and select
const colors = $('#color').prepend(new Option(`Please select a T-shirt theme`, 'none'));
$(colors[0][0]).attr('selected', 'selected');

$('#title').change(function() {
    if(this.value === 'other'){
        //hides/shows other input
        $('#other').show().attr('placeholder', 'What is your role?');
    } else {
        $('#other').hide();
    }
});

$('#design').change(function() {
    const selected = this.value.replace(' ', '-');
    $('#color > option').each(function() {
        //show/hide color options based on design option selection.
        //currently selects all options of category.
        if(selected === this.className){
            $(this).show().attr('selected', 'selected');
        } else {
            $(this).hide().removeAttr('selected');
        }
    });
});

$('.activities').append(`<span class="total">Total: </span>`);

$('.activities').on('change', function() {
    let total = 0;
    $("input[type='checkbox']").each(function() {
        let schedule = {};
        const checked = $(this).is(':checked');
        if (checked) {
            const cost = $(this).attr('data-cost').slice(1, $(this).attr('data-cost').length);
            const time = $(this).attr('data-day-and-time');
           
            total += parseInt(cost);
            $('.total').show();
        }
        //add & subtract cost
    });
    if (total === 0){
        $('.total').hide();
    }
    $('.total').text(`Total: $${total}`);
});

/*
Some events are at the same day and time as others. If the user selects a workshop, don't allow selection of a workshop at the same day and time 
-- you should disable the checkbox and visually indicate that the workshop in the competing time slot isn't available.
When a user unchecks an activity, make sure that competing activities (if there are any) are no longer disabled.
*/



$('#payment').change(function() {
    $('#payment > option').each(function() {
        console.log(this.value)
    })
    const method = this.value.toLowerCase().replace(' ', '-')
    $(`#${method}`).show()
});

/*"Payment Info" section
Display payment sections based on the payment option chosen in the select menu.
 Payment option in the select menu should match the payment option displayed on the page.
When a user selects the "PayPal" payment option, the PayPal information should display, and the credit card and 
“Bitcoin” information should be hidden.
When a user selects the "Bitcoin" payment option, the Bitcoin information should display, and the credit card and “PayPal” information should be hidden.
NOTE: The user should not be able to select the "Select Payment Method" option from the payment select menu, 
because the user should not be able to submit the form without a chosen payment option.*/