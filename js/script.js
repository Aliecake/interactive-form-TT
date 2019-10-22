console.log('Dear reviewer... If jQuery is not working, check the README.md.');

let total = 0;

//**ON LOAD *//

$('#name').focus();
$('#other').hide();
$('#colors-js-puns').hide(); //<div id="colors-js-puns" class="">
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
        $('#colors-js-puns').show()
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

//TODO User cannot select two activities that are at the same time.

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
    total === 0 ? $('.total').hide() : $('.total').text(`Total: $${total}`);
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

$('#mail').keyup(function(){
    validEmail(this.value, this.id)? $('#js-mail-error').hide() : $('#js-mail-error').show();
});

//******** FORM SUBMIT ********//

$('form').submit(function(e) {
    //hide previous submit errors upon multiple prevented submissions
    $('.error').hide();

    //TODO e.preventDefault() should be moved before submission to error zones
    e.preventDefault();
   

    //TODO: Validate at least one activity is selected

    //check for empty fields
    validEntry(this.name.value, this.name.id);
    validEntry(this.payment.value, this.payment.id);
    validEntry(this.mail.value, this.mail.id);
    
    console.log($('input[type=checkbox]'))
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
});
//******** FORM VALIDATION HELPER FUNCTIONS ********//

function validEntry(val, id) {
    const error = `<span class="error">**Required**</span>`;

    if(val === 'select method' || val === '') {
        $(`#${id}`).before(error);
    }
    //if HTML mail validation fails
    if(id === 'mail') {
      if(!validEmail(val)) {
        $(`#${id}`).before(`<span class="error">Email is not in valid format</span>`);
      }
    }
}

//Due to rubric I did not use https://www.bram.us/2011/11/29/punycode-js/
//however, a properly formed email validation would.

function validEmail(val, id) {
        //**format: local cannot begin or end with . */
        //** can contain a-z 0-9 ._+%- note: could not void .. */
        //**domain must be 2 or more chars */
        const regex = /\b^[^\.]([a-z0-9._+%-])+[^\.]@[a-z0-9-.]+\.[a-z]{2,}\b/i;

        return regex.test(val);
}
function validActivities (activities) {
   
}
function validCredit(ccNum, id){
    const digitRegex = /[0-9]{13, 16}/;
    if(!digitRegex.test(ccNum)) {
        $(`#${id}`).before(`<span class="error">**Credit Card must be 13-16 numbers</span>`);
    }
}

function validDigits(val, id, num) {
    //creates a new regex based on num
    var regex = new RegExp(`^(\\d{${num}})$`);
    if(!regex.test(val)) {
        $(`#${id}`).before(`<span class="error"> *Error: ${id} must be ${num} numbers</span>`);
    }
}
