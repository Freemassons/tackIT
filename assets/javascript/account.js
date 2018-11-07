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

        dbCon.once("value", function(snapshot) {
            account.userName = snapshot.val().userName;
            account.password = snapshot.val().password;
            account.fullName = snapshot.val().fullName;
            account.email = snapshot.val().email;
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

    create: function (formUserName, formPassword, formFullName, formEmail, formAvatar) {
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
            avatar: formAvatar,
            confirmed: false,
            confirmString: confirmString,
            status: '',
            joined: timeStamp,
            chatChannels: '',
            friends: ''
        });  
        
        account.id = dbConnection.ref.key;

        account.sendMail(confirmString);
        account.populate();
    },

    sendMail: function(confirmString) {
        emailData.template_params.full_name = $("#input-name").val();
        emailData.template_params.user_name = $("#input-nick").val();
        emailData.template_params.email = $("#input-email").val();
        emailData.template_params.unique_link = "https://freemassons.github.io/tackIT/?confirm=" + confirmString;

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

    login: function(loginUserName, loginPassword) {
        let dbCon = db.connection.ref('members');

        dbCon.orderByChild('userName').equalTo(loginUserName).once("value", function(snapshot) {
            snapshot.forEach(function(data) {
                let decryptedPassword = decryptString(data.val().password);
                if(decryptedPassword === loginPassword && data.val().userName === loginUserName) {
                    account.id = data.key;
                    account.populate();                    
                } else {
                    console.log("Trying to hack the account?!?");
                }
            });
        });
    },

    logout: function() {
        localStorage.clear();
        location.reload();
    }
}

let page = {
    selectorScreenSignUp: '.screen-sign-up',
    selectorScreenSignOut: '.screen-sign-out',

    hideSignUp: function() {
        $(page.selectorScreenSignUp).hide();
    },

    showSignUp: function() {
        $(page.selectorScreenSignUp).show();
    },

    hideSignOut: function() {
        $(page.selectorScreenSignOut).hide();
    },

    showSignOut: function() {
        $(page.selectorScreenSignOut).show();
    }
}

$(document).ready(function () {
    // Initiate sidenav bar if it's leveraged (mobile)
    $('.sidenav').sidenav();

    // Initialize scrollspy
    $('.scrollspy').scrollSpy();

    // Initialize the firebase connection
    db.initializeConnection();

    // If the account has already been created local storage is set
    if(localStorage.getItem('accountId') !== null) {
        account.id = localStorage.getItem('accountId');
        account.populate();
    }

    $(document).on('click', '#submit-login', function() {
        let loginUserName= $("#login-username").val();
        let loginPassword= $("#login-password").val();

        account.login(loginUserName, loginPassword);
    });

    $(document).on('click', '#submit-mini-login', function() {
        let loginUserName= $("#login-mini-username").val();
        let loginPassword= $("#login-mini-password").val();

        account.login(loginUserName, loginPassword);
    });

    $(document).on('click', '.submit-logout', function() {
        account.logout();
    });

    $(document).on('click', '#submit-account', function() {
        event.preventDefault();
        
        // Get Input from Form
        let formUserName= $("#input-nick").val();
        let formPassword= $("#input-pw").val();
        let formFullName= $("#input-name").val();
        let formEmail= $("#input-email").val();
        // let formAvatar= $("#input-avatar").val();
        let formAvatar = 'BulletBill.png';

        account.create(formUserName, formPassword, formFullName, formEmail, formAvatar);
    });
});