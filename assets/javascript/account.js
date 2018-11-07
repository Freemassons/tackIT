// Initialize Firebase
let db = {
    config: {
        apiKey: "AIzaSyBu7V_ug_GY-INtO8tWmJHYZEUltT0YE5s",
        authDomain: "tackit-86cc7.firebaseapp.com",
        databaseURL: "https://tackit-86cc7.firebaseio.com",
        projectId: "tackit-86cc7",
        storageBucket: "tackit-86cc7.appspot.com",
        messagingSenderId: "386217384452",
    },
    connection: '',

    initializeConnection: function () {
        firebase.initializeApp(db.config);
        db.connection = firebase.database();
    }
};

let emailData = {
    service_id: 'gmail',
    template_id: 'tackIT Welcome Email',
    user_id: 'user_LhVxw7bxvmWOzZmutMDb6',
    template_params: {}
};

let account = {
    id: '',
    userName: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    avatar: '',
    confirmed: false,
    confirmString: '',
    joined: '',
    status: false,

    // Array of chat channel IDs
    chatChannels: [],

    // Array of friend IDs
    friends: [],

    populate: function () {
        let dbCon = db.connection.ref('members/' + account.id);
        let statusCon = db.connection.ref('members/' + account.id + '/status');

        dbCon.once("value", function (snapshot) {
            account.userName = snapshot.val().userName;
            account.password = snapshot.val().password;
            account.fullName = snapshot.val().fullName;
            account.email = snapshot.val().email;
            account.phone = snapshot.val().phone;
            account.avatar = snapshot.val().avatar;
            account.confirmed = snapshot.val().confirmed;
            account.confirmString = snapshot.val().confirmString;
            account.joined = snapshot.val().joined;
            account.chatChannels = snapshot.val().chatChannels;
            account.friends = snapshot.val().friends;

            statusCon.set(true);
            statusCon.onDisconnect().set(false);
        });

        localStorage.setItem('accountId', account.id);

        page.hideSignUp();
        page.showSignOut();
    },

    create: function (formUserName, formPassword, formConfirmPassword, formFullName, formEmail, formPhone) {
        let validInput = true;

        // Validation Routines
        // Checking if passwords match
        if (formPassword !== formConfirmPassword) {
            let errorMessage = "Passwords do not match - please try again"
            page.showFormErrorMessage(errorMessage);
            validInput = false;
        }

        // Check if username is taken
        let dbCon = db.connection.ref('members');
        dbCon.orderByChild('userName').equalTo(formUserName).once("value", function (snapshot) {
            if (snapshot.val()) {
                let errorMessage = "User name already exists - please select another"
                page.showFormErrorMessage(errorMessage);
                validInput = false;
            }
        });

        // If everything is valid, create user
        if (validInput) {
            let timeStamp = moment().unix();
            let encryptedPW = encryptString(formPassword);
            confirmString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            let dbCon = db.connection.ref('members');
            let dbConnection = dbCon.push({
                // userName: formUserName,
                userName: formUserName,
                password: encryptedPW,
                fullName: formFullName,
                email: formEmail,
                phone: formPhone,
                avatar: '',
                confirmed: false,
                confirmString: confirmString,
                status: '',
                joined: timeStamp,
                chatChannels: '',
                friends: ''
            });

            // Defining this one since it's required later.
            account.userName = formUserName;
            account.id = dbConnection.ref.key;
            account.populate();

            let confirmMessage = '<p>Almost done, <span class="confirmed-next-name">' + formUserName + '</span></p>';
            confirmMessage += '<p>(Check Your Mail)</p>';

            page.showConfirmedNext(confirmMessage);
            account.sendMail(confirmString);
        }
    },

    confirm: function (confirmString, confirmUser) {
        let dbCon = db.connection.ref('members');

        dbCon.orderByChild('userName').equalTo(confirmUser).once("value", function (snapshot) {
            if (snapshot.val()) {
                snapshot.forEach(function (data) {
                    if(data.val().confirmString === confirmString) {
                        if(!data.val().confirmed) {
                            account.id = data.ref.key;
                            console.log(account.id);
                            dbPlayerCon = db.connection.ref('members/' + account.id);

                            dbPlayerCon.update({
                                confirmed: true,
                            });

                            account.populate();

                            let confirmMessage = '<p>Welcome to the cool kids club, <span class="confirmed-next-name">' + confirmUser + '</span></p>';
                            confirmMessage += '<p>(<a href="#customize">Customize Your Profile Now</a>)</p>';

                            page.showConfirmedNext(confirmMessage);
                        } else {
                            // Already confirmed - do nothing
                            account.id = data.ref.key;
                            account.populate();
                        }
                    }
                });
            }
        });
    },

    sendMail: function (confirmString) {
        emailData.template_params.full_name = $("#input-name").val();
        emailData.template_params.user_name = $("#input-nick").val();
        emailData.template_params.email = $("#input-email").val();
        emailData.template_params.unique_link = "https://freemassons.github.io/tackIT/index.html?confirm=" + confirmString + "&memberName=" + account.userName;

        $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
            type: 'POST',
            data: JSON.stringify(emailData),
            contentType: 'application/json'
        }).done(function () {
            console.log('SUCCESS!');
        }).fail(function (error) {
            alert('Oops... ' + JSON.stringify(error));
        });
    },

    login: function (loginUserName, loginPassword) {
        let dbCon = db.connection.ref('members');

        dbCon.orderByChild('userName').equalTo(loginUserName).once("value", function (snapshot) {
            if (snapshot.val()) {
                snapshot.forEach(function (data) {
                    let decryptedPassword = decryptString(data.val().password);
                    if (decryptedPassword === loginPassword && data.val().userName === loginUserName) {
                        account.id = data.key;
                        account.populate();
                        page.hideInvalidLogin();
                    } else {
                        page.showInvalidLogin();
                    }
                });
            } else {
                page.showInvalidLogin();
            }
        });
    },

    logout: function () {
        // Clear local storage
        localStorage.clear();

        // Remove any query parameters (if present) and reload
        location = window.location.href.split("?")[0];
    }
}

let page = {
    selectorScreenSignUp: '.screen-sign-up',
    selectorScreenSignOut: '.screen-sign-out',
    selectorLoginMessage: '.login-message',
    selectorMiniLoginMessage: '.login-mini-message',
    selectorFormErrorMessage: '.form-error-message',
    selectorFormErrorList: '.form-error-list',
    selectorConfirmedNext: '.confirmed-next',
    selectorConfirmedNextName: '.confirmed-next-msg',

    hideSignUp: function () {
        $(page.selectorScreenSignUp).hide();
    },

    showSignUp: function () {
        $(page.selectorScreenSignUp).show();
    },

    hideSignOut: function () {
        $(page.selectorScreenSignOut).hide();
    },

    showSignOut: function () {
        $(page.selectorScreenSignOut).show();
    },

    hideInvalidLogin: function () {
        $(page.selectorLoginMessage).hide();
        $(page.selectorMiniLoginMessage).hide();
    },

    showInvalidLogin: function () {
        $(page.selectorLoginMessage).show();
        $(page.selectorMiniLoginMessage).show();
    },

    hideFormErrorMessage: function () {
        $(page.selectorFormErrorList).empty();
        $(page.selectorFormErrorMessage).hide();
    },

    showFormErrorMessage: function (message) {
        $(page.selectorFormErrorList).append('<li>' + message + '</li>');
        $(page.selectorFormErrorMessage).show();
    },

    hideConfirmedNext: function () {
        $(page.selectorConfirmedNext).empty();
        $(page.selectorConfirmedNext).hide();
    },

    showConfirmedNext: function (message) {
        $(page.selectorConfirmedNextName).html(message);
        $(page.selectorConfirmedNext).show();
    }
}

$(document).ready(function () {
    // Initiate sidenav bar if it's leveraged (mobile)
    $('.sidenav').sidenav();

    // Initialize scrollspy
    $('.scrollspy').scrollSpy();

    // Initialize the firebase connection
    db.initializeConnection();

    // Get Query Parameters
    let queryParams = getUrlVars();
    if(queryParams['confirm'] && queryParams['memberName']) {
        account.confirm(queryParams['confirm'], queryParams['memberName']);
    }

    // If the account has already been created local storage is set
    if (localStorage.getItem('accountId') !== null) {
        account.id = localStorage.getItem('accountId');
        account.populate();
    }

    $(document).on('click', '#submit-login', function () {
        let loginUserName = $("#login-username").val();
        let loginPassword = $("#login-password").val();

        account.login(loginUserName, loginPassword);
    });

    $(document).on('click', '#submit-mini-login', function () {
        let loginUserName = $("#login-mini-username").val();
        let loginPassword = $("#login-mini-password").val();

        account.login(loginUserName, loginPassword);
    });

    $(document).on('click', '.submit-logout', function () {
        account.logout();
    });

    $(document).on('click', '#submit-account', function () {
        event.preventDefault();
        let validForm = true;

        // Get Input from Form
        let formUserName = $("#input-nick").val();
        let formPassword = $("#input-pw").val();
        let formConfirmPassword = $("#input-confirm-pw").val();
        let formFullName = $("#input-name").val();
        let formEmail = $("#input-email").val();
        let formPhone = $("#input-tel").val();

        // Calling validation functions directly due to preventDefault()
        if(!$("#input-nick")[0].checkValidity()) {
            $("#input-nick")[0].reportValidity();
            validForm = false;
        }

        if(!$("#input-pw")[0].checkValidity()) {
            $("#input-pw")[0].reportValidity();
            validForm = false;
        }
        
        if(!$("#input-confirm-pw")[0].checkValidity()) {
            $("#input-confirm-pw")[0].reportValidity();
            validForm = false;
        }        

        if(!$("#input-name")[0].checkValidity()) {
            $("#input-name")[0].reportValidity();
            validForm = false;
        }

        if(!$("#input-email")[0].checkValidity()) {
            $("#input-email")[0].reportValidity();
            validForm = false;
        }     
        
        if(!$("#input-tel")[0].checkValidity()) {
            $("#input-tel")[0].reportValidity();
            validForm = false;
        }    

        if (validForm) {
            account.create(formUserName, formPassword, formConfirmPassword, formFullName, formEmail, formPhone);
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        }
    });
});