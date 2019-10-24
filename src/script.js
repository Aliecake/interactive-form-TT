import "normalize.css";
import "../css/style.css";
import $ from 'jquery';

let total = 0;

//**ON LOAD *//

$('#name').focus();
$('#other').hide();
$('#colors-js-puns').hide();
$('#paypal').hide();
$('#bitcoin').hide();

//add new option and select
const colors = $('#color').prepend(new Option(`Please select a T-shirt theme`, 'none'));
$(colors[0][0]).attr('selected', 'selected');

//******** FORM DYNAMICS ********//

//#TITLE#//

$('#title').change(function() {
    if(this.value === 'other'){
        //hides/shows other input
        $('#other').show().attr('placeholder', 'What is your role?');
    } else {
        $('#other').hide();
    }
});

//#DESIGN#//

$('#design').change(function() {
    const selected = this.value.replace(' ', '-');
    $('#color > option').each(function() {
        $('#colors-js-puns').show();
        //show/hide color options based on design option selection.
        //currently selects all options of category.
        if(selected === this.className){
            $(this).show().attr('selected', 'selected');
        } else {
            $(this).hide().removeAttr('selected');
        }
    });
});

//#ACTIVITIES#//
$('.activities').append(`<span class="total">Total: </span>`);

$('.activities').on('change', function() {
    //reset to 0, loop will count already checked
    total = 0;
    $("input[type='checkbox']").each(function() {
        const time = $(this).attr('data-day-and-time');
        const checked = $(this).is(':checked');
        const price = $(this).attr('data-cost');

        activitiesTotal(checked, price);

        //not main
        if(this.name !== 'all') {
            activitiesTime(this, time, this.checked);
        }
    });
});

function activitiesTotal(checked, price) {
    if (checked) {
        const cost = price.slice(1, price.length);
        //turn into a int and add the cost to total.
        total += parseInt(cost);
        $('.total').show();
    }
    return total === 0 ? $('.total').hide() : $('.total').text(`Total: $${total}`);
}

function activitiesTime(event, time, checked) {
    $('input[type=checkbox]').each(function() {
        activityConflict(event, time, this, $(this).attr('data-day-and-time'), checked);
    });
}

function activityConflict(event1, time1, event2, time2, scheduled) {
    // if not same event, and times are at same time
    if(event1.name !== event2.name && time1 === time2) {
        $(event2).attr('disabled', scheduled);

        //could not fix for toggleClass to work without toggling 2-4 non-conflicting events.
        if (scheduled) {
            $(event2).parent().addClass('activ-conflict');
        } else {
            $(event2).parent().removeClass('activ-conflict');
        }
    }
}

//#PAYMENT#//

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

//#E-mail Helper//
//***REAL Time  */
$('#mail').keyup(function(){
    return validEmail(this.value, this.id)? $('#js-mail-error').hide() : $('#js-mail-error').show();
});

//******** FORM SUBMIT ********//

let noErrors = true;

$('form').submit(function(e) {
    //hide previous submit errors upon multiple prevented submissions
    $('.error').hide();
    e.preventDefault();

    //check for empty fields
    validEntry(this.name.value, this.name.id);
    validEntry(this.payment.value, this.payment.id);
    validEntry(this.mail.value, this.mail.id);
    validActivities(total);
    if(this.payment.value === 'Credit Card') {

        //check for empty fields
        validEntry(this['cc-num'].value, 'cc-num');
        validEntry(this.zip.value, this.zip.id);
        validEntry(this.cvv.value, this.cvv.id);

        validCredit(this['cc-num'], this['cc-num'].id);

        //validation of zip and cvv
        validDigits(this.zip.value, this.zip.id, '5');
        validDigits(this.cvv.value, this.cvv.id, '3');
    }
   
    if(noErrors) {
        location.reload();
    }
});
//******** FORM VALIDATION HELPER FUNCTIONS ********//

function validEntry(val, id) {
    if(val === '') {
        noErrors = false;
        $(`#${id}`).before(error(`Cannot be blank. `));
    }
    if(val === 'select method'){
        noErrors = false;
        $(`#${id}`).before(error(`Valid payment method`));
    }
    //if HTML mail validation fails
    if(id === 'mail') {
      if(!validEmail(val)) {
        noErrors = false;
        $(`#${id}`).before(error(`Email is not in valid format.`));
      }
    }
}

//Due to rubric I did not use https://www.bram.us/2011/11/29/punycode-js/
//however, a properly formed email validation would.

function validEmail(val) {
        //**format: local cannot begin or end with . */
        //** can contain a-z 0-9 ._+%- note: could not void .. */
        //**domain must be 2 or more chars */
        const regex = /\b^[^\.]([a-z0-9._+%-])+[^\.]@[a-z0-9-.]+\.[a-z]{2,}\b/i;

        return regex.test(val);
}
function validActivities (total) {
    if(total === 0) {
        noErrors = false;
        $('.activities').prepend(error(`One or more activity MUST be selected.`));
    }
}
function validCredit(ccNum, id){
    const digitRegex = /\d{13,16}/;

    if(!digitRegex.test(ccNum.value)) {
        noErrors = false;
        $(`#${id}`).before(error(`Credit card must be 13-16 digits.`));
    }
}

function validDigits(val, id, num) {
    //creates a new regex for num
    const regex = new RegExp(`^(\\d{${num}})$`);

    if(!regex.test(val)) {
        noErrors = false;
        $(`#${id}`).before(error(`digits required`, num, id));
    }
}
//Error Helper
function error(msg, num='', id='') {
    return `<span class="error">**Required: ${num} ${id} ${msg} </span>`
}