console.log('Dear reviewer... If jQuery is not working, check the README.md.');

$('#name').focus();
$('#other').hide();
$('#paypal').hide();
$('#bitcoin').hide();

let total = 0;

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
    //reset to 0, loop will count already checked
    total = 0;
    $("input[type='checkbox']").each(function() {
        const event = this;
        const time = $(this).attr('data-day-and-time');

        const checked = $(this).is(':checked');
        const price = $(this).attr('data-cost');

        activitiesHandler(checked, price, event, time);
    });
   
});

function activitiesHandler(checked, price, event, time) {

    if (checked) {
        const cost = price.slice(1, price.length);
        //turn into a int and add the cost to total.
        total += parseInt(cost);
        $('.total').show();
    }
    total === 0 ? $('.total').hide() : $('.total').text(`Total: $${total}`)
}

/*
Some events are at the same day and time as others. If the user selects a workshop, don't allow selection of a workshop at the same day and time 
toggle disable
*/

$('#payment').click(function() {
    if ($(this).children().first()[0].value === 'select method') {
        $(this).children().first().remove();
    }
 });


$('#payment').change(function() {
    const method = this.value.toLowerCase().replace(' ', '-');
    const selectedPayment = this.value;

    $('#payment > option').each(function() {
        //disables select, only after another method has been chosen.
        if(this.value === selectedPayment) {
            $(`#${method}`).show();
        } else {
            const notPayment = this.value.toLowerCase().replace(' ', '-');
            $(`#${notPayment}`).hide();
        }
    });
});


$('form').submit(function(e) {
    e.preventDefault();
    console.log(this.name.value)
});
/* Form validation
If any of the following validation errors exist, prevent the user from submitting the form:
Name field can't be blank.
Email field must be a validly formatted e-mail address (you don't have to check that it's a real e-mail address, 
just that it's formatted like one: dave@teamtreehouse.com for example.
User must select at least one checkbox under the "Register for Activities" section of the form.
If the selected payment option is "Credit Card," make sure the user has supplied a Credit Card number, 
a Zip Code, and a 3 number CVV value before the form can be submitted.
Credit Card field should only accept a number between 13 and 16 digits.
The Zip Code field should accept a 5-digit number.
The CVV should only accept a number that is exactly 3 digits long.
NOTE: Don't rely on the built in HTML5 validation by adding the required attribute to your DOM elements.
 You need to actually create your own custom validation checks and error messages.
 NOTE: Make sure your validation is only validating Credit Card info if Credit Card is the selected payment method.
 */