console.log('Dear reviewer... If jQuery is not working, check the README.md.');

let total = 0;

//TODO: “Design” menu, no color options appear in the “Color” drop down and the “Color” field reads “Please select a T-shirt theme”.

//**ON LOAD *//

$('#name').focus();
$('#other').hide();
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
//TODO: “Color” drop down menu is hidden until a T-Shirt design is selected.

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
    total === 0 ? $('.total').hide() : $('.total').text(`Total: $${total}`)
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

//******** FORM SUBMIT ********//

$('form').submit(function(e) {
    //hide previous submit errors upon multiple submissions
    $('.error').hide();

    //TODO e.preventDefault() should be moved before submission to error zones
    e.preventDefault();
   
    //TODO: Email Validation Email field contains validly formatted e-mail address: hellO@hello.com

    //TODO: Validate at least one activity is selected

    //TODO: Credit card 13 to 16-digit credit card number
    //check for empty fields
    validEntry(this.name.value, this.name.id);
    validEntry(this.payment.value, this.payment.id);
    validEntry(this.mail.value, this.mail.id);

    if(this.payment.value === 'Credit Card') {
        let ccNum = $('#cc-num');

        //check for empty fields
        validEntry(ccNum.val(), 'cc-num');
        validEntry(this.zip.value, this.zip.id);
        validEntry(this.cvv.value, this.cvv.id);

        validCredit(ccNum, this.zip.value, this.cvv.value);

        //validation of zip and cvv
        validDigits(this.zip.value, this.zip.id, '5');
        validDigits(this.cvv.value, this.cvv.id, '3');
    }
});
//******** FORM VALIDATION HELPER FUNCTIONS ********//

function validEntry(val, id) {
    const error = `<span class="error">*Required*</span>`;

    if(val === 'select method' || val === '') {
        $(`#${id}`).before(error);
    }
}
function validCredit(ccNum, zip, cvv){
    // console.log(ccNum, zip, cvv)
}
function validDigits(val, id, num) {
    //creates a new regex based on num
    var regex = new RegExp(`^(\\d{${num}})$`);
    if(!regex.test(val)) {
        $(`#${id}`).before(`<span class="error"> *Error: Zip must be ${num} numbers</span>`);
    }
}
/* Form validation

Email field must be a validly formatted e-mail address name@email.com

one+ checkbox under the "Register for Activities" section of the form.

Credit Card field should only accept a number between 13 and 16 digits.
.

 */
