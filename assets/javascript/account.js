var data = {
    service_id: 'gmail',
    template_id: 'tackIT Welcome Email',
    user_id: 'user_LhVxw7bxvmWOzZmutMDb6',
    template_params: {}
};

$( document ).ready(function() {

    $("#submit-account").on("click", function() {
            event.preventDefault();
        
            data.template_params.full_name =  $("#input-name").val();
            data.template_params.user_name = $("#input-nick").val();
            data.template_params.email =  $("#input-email").val();
            data.template_params.unique_link = "https://myuniquelink.com?signup=hello";

            $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
                type: 'POST',
                data: JSON.stringify(data),
                contentType: 'application/json'
            }).done(function() {
                alert('Your mail is sent!');
            }).fail(function(error) {
                alert('Oops... ' + JSON.stringify(error));
        });
    });
});