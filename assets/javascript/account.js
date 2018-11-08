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

            if (account.avatar) {
                page.updateIcon();
            }

            statusCon.set(true);
            statusCon.onDisconnect().set(false);
        });

        localStorage.setItem('accountId', account.id);

        page.hideSignUp();
        page.showSignOut();
    },

    create: function (formUserName, formPassword, formConfirmPassword, formFullName, formEmail, formPhone) {
        page.hideFormErrorMessage();
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
        console.log(formUserName);
        dbCon.orderByChild('userName').equalTo(formUserName).once("value", function (snapshot) {
            if (snapshot.val()) {
                console.log("in name");
                console.log(snapshot.val());
                let errorMessage = "User name already exists - please select another"
                page.showFormErrorMessage(errorMessage);
                validInput = false;
            }
        });

        // Check if email is taken
        dbCon = db.connection.ref('members');
        console.log(formEmail);
        dbCon.orderByChild('email').equalTo(formEmail).once("value", function (snapshot) {
            console.log("in email");
            console.log(snapshot.val());
            if (snapshot.val()) {
                let errorMessage = "Email already exists - please use another"
                page.showFormErrorMessage(errorMessage);
                validInput = false;
            } else {
                if (validInput) {
                    let timeStamp = moment().unix();
                    let encryptedPW = encryptString(formPassword);
                    confirmString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

                    let dbCon = db.connection.ref('members');
                    let dbConnection = dbCon.push({
                        userName: formUserName,
                        password: encryptedPW,
                        fullName: formFullName,
                        email: formEmail,
                        phone: formPhone,
                        avatar: 'QuestionBlock.png',
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

                    emailData.template_id = 'tackIT Welcome Email';
                    emailData.template_params.full_name = $("#input-name").val();
                    emailData.template_params.user_name = $("#input-nick").val();
                    emailData.template_params.email = $("#input-email").val();
                    emailData.template_params.unique_link = "https://freemassons.github.io/tackIT/index.html?confirm=" + confirmString + "&memberName=" + account.userName;
                    sendMail(emailData);

                    $('html, body').animate({ scrollTop: 0 }, 'slow');
                }
            }
        });

        // If everything is valid, create user
    },

    update: function(formPassword, formConfirmPassword, formFullName, formPhone, formAvatar) {
        page.hideAccountErrorMessage();
        // Validation Routines
        // Checking if passwords match
        if (formPassword !== formConfirmPassword) {
            let errorMessage = "Passwords do not match - please try again"
            page.showAccountErrorMessage(errorMessage);
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        } else {
            let encryptedPW = encryptString(formPassword);

            let dbCon = db.connection.ref('members/' + account.id);
            let dbConnection = dbCon.update({
                // userName: formUserName,
                password: encryptedPW,
                fullName: formFullName,
                phone: formPhone,
                avatar: formAvatar,
            });

            // Repopulate any changes
            account.populate();      
            page.showScreenIndex();
            page.hideScreenAccount();
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        }
    },

    confirm: function (confirmString, confirmUser) {
        let dbCon = db.connection.ref('members');

        dbCon.orderByChild('userName').equalTo(confirmUser).once("value", function (snapshot) {
            if (snapshot.val()) {
                snapshot.forEach(function (data) {
                    if (data.val().confirmString === confirmString) {
                        if (!data.val().confirmed) {
                            account.id = data.ref.key;
                            dbPlayerCon = db.connection.ref('members/' + account.id);

                            dbPlayerCon.update({
                                confirmed: true,
                            });

                            account.populate();

                            let confirmMessage = '<p>Welcome to the cool kids club, <span class="confirmed-next-name">' + confirmUser + '</span></p>';
                            confirmMessage += '<p>(<a href="#" class="submit-manage-account">Customize Your Profile Now</a>)</p>';

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
        location.reload();
    },

    forgotPassword: function (email) {
        randomPassword = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
        encryptedPassword = encryptString(randomPassword);

        dbCon = db.connection.ref('members');

        dbCon.orderByChild('email').equalTo(email).once("value", function (snapshot) {
            if (snapshot.val()) {
                snapshot.forEach(function (data) {
                    if (data.val()) {
                        account.id = data.ref.key;
                        dbPlayerCon = db.connection.ref('members/' + account.id);

                        dbPlayerCon.update({
                            password: encryptedPassword
                        });

                        emailData.template_id = 'tackIT Forgot Info';
                        emailData.template_params.random_password = randomPassword;
                        emailData.template_params.email = email;

                        sendMail(emailData);
                    }
                });
            }
        });
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
    selectorAvatarIcon: '#avatar-icon',
    selectorMobileAvatarIcon: '#avatar-icon-mobile',
    selectorScreenIndex: '.screen-index',
    selectorScreenAccount: '.screen-account',
    selectorAccountErrorMessage: '.account-error-message',
    selectorAccountErrorList: '.account-error-list',

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
    },

    updateIcon: function () {
        $(page.selectorAvatarIcon).attr('src', 'assets/images/avatars/' + account.avatar)
        $(page.selectorMobileAvatarIcon).attr('src', 'assets/images/avatars/' + account.avatar)
    },

    hideScreenIndex: function () {
        $(page.selectorScreenIndex).hide();
    },

    showScreenIndex: function () {
        $(page.selectorScreenIndex).show();
    },

    hideScreenAccount: function () {
        $(page.selectorScreenAccount).hide();
    },

    showScreenAccount: function () {
        $(page.selectorScreenAccount).show();
    },

    populateAccountScreen: function () {
        $('#input-account-nick').val(account.userName);         
        $('#input-account-name').val(account.fullName);           
        $('#input-account-pw').val(decryptString(account.password));
        $('#input-account-confirm-pw').val(decryptString(account.password));
        $('#input-account-email').val(account.email);
        $('#input-account-tel').val(account.phone);
        $('#current-avatar').attr('src', 'assets/images/avatars/' + account.avatar)

        M.updateTextFields();
    },

    hideAccountErrorMessage: function () {
        $(page.selectorAccountErrorList).empty();
        $(page.selectorAccountErrorMessage).hide();
    },

    showAccountErrorMessage: function (message) {
        console.log("test");
        $(page.selectorAccountErrorList).append('<li>' + message + '</li>');
        $(page.selectorAccountErrorMessage).show();
    },
}

$(document).ready(function () {
    // Initiate sidenav bar if it's leveraged (mobile)
    $('.sidenav').sidenav();

    // Initialize scrollspy
    $('.scrollspy').scrollSpy();

    // Initialize forgot login modal
    $('#modal-login-cred').modal();
    $('#modal-collab').modal();
    $('#modal-source').modal();
    $('#modal-agile').modal();
    $('#modal-bottom').modal();

    // Initialize the drop down trigger
    $(".dropdown-trigger").dropdown();

    // Initialize the firebase connection
    db.initializeConnection();

    // Get Query Parameters
    let queryParams = getUrlVars();
    if (queryParams['confirm'] && queryParams['memberName']) {
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

    $(document).on('click', '#forgot-login', function () {
        $('#modal-login-cred').modal('open');
    });

    $(document).on('click', '.btn-collab', function () {
        $('#modal-collab').modal('open');
    });

    $(document).on('click', '.btn-source', function () {
        $('#modal-source').modal('open');
    });

    $(document).on('click', '.btn-agile', function () {
        $('#modal-agile').modal('open');
    });

    $(document).on('click', '.submit-go-chat', function () {
        $('#modal-bottom').modal('open');
    });    
    
    $(document).on('click', '.modal-bottom-close', function () {
        $('#modal-bottom').modal('close');
    });

    $(document).on('click', '.modal-bottom-maximize', function () {
        // $('#modal-bottom').modal('close');
    });

    $(document).on('click', '#submit-forgot-pw', function () {
        formEmail = $("#forgot-pw").val();
        account.forgotPassword(formEmail);

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
        if (!$("#input-nick")[0].checkValidity()) {
            $("#input-nick")[0].reportValidity();
            validForm = false;
        }

        if (!$("#input-pw")[0].checkValidity()) {
            $("#input-pw")[0].reportValidity();
            validForm = false;
        }

        if (!$("#input-confirm-pw")[0].checkValidity()) {
            $("#input-confirm-pw")[0].reportValidity();
            validForm = false;
        }

        if (!$("#input-name")[0].checkValidity()) {
            $("#input-name")[0].reportValidity();
            validForm = false;
        }

        if (!$("#input-email")[0].checkValidity()) {
            $("#input-email")[0].reportValidity();
            validForm = false;
        }

        if (!$("#input-tel")[0].checkValidity()) {
            $("#input-tel")[0].reportValidity();
            validForm = false;
        }

        if (validForm) {
            account.create(formUserName, formPassword, formConfirmPassword, formFullName, formEmail, formPhone);
        }
    });

    $(document).on('click', '.submit-manage-account', function () {
        page.hideScreenIndex();
        page.showScreenAccount();
        page.populateAccountScreen();
    });

    $(document).on('click', '.submit-go-home', function () {
        page.showScreenIndex();
        page.hideScreenAccount();
    });

    $(document).on('click', '#submit-account-update', function () {
        event.preventDefault();
        let validForm = true;

        // Get Input from Form
        let formPassword = $("#input-account-pw").val();
        let formConfirmPassword = $("#input-account-confirm-pw").val();
        let formFullName = $("#input-account-name").val();
        let formPhone = $("#input-account-tel").val();
        let formAvatar = $("input:radio[name ='inputAvatar']:checked").val();

        if (!$("#input-account-pw")[0].checkValidity()) {
            $("#input-account-pw")[0].reportValidity();
            validForm = false;
        }

        if (!$("#input-account-confirm-pw")[0].checkValidity()) {
            $("#input-account-confirm-pw")[0].reportValidity();
            validForm = false;
        }

        if (!$("#input-account-name")[0].checkValidity()) {
            $("#input-account-name")[0].reportValidity();
            validForm = false;
        }

        if (!$("#input-account-tel")[0].checkValidity()) {
            $("#input-account-tel")[0].reportValidity();
            validForm = false;
        }

        if (!formAvatar) {
            formAvatar = account.avatar;
        }

        if (validForm) {
            account.update(formPassword, formConfirmPassword, formFullName, formPhone, formAvatar);
        }
    });
});