
var config = {
    apiKey: "AIzaSyBu7V_ug_GY-INtO8tWmJHYZEUltT0YE5s",
    authDomain: "tackit-86cc7.firebaseapp.com",
    databaseURL: "https://tackit-86cc7.firebaseio.com",
    projectId: "tackit-86cc7",
    storageBucket: "tackit-86cc7.appspot.com",
    messagingSenderId: "386217384452"
};

firebase.initializeApp(config);

let memberID = localStorage.getItem("accountId");
let database = firebase.database();

var data = {
    user: {
    },
    channels: [],
    default: {
        channelID: "-LQfdAdsa1T1kTV-MewD"
    }
};

activeFocus = { id: data.default.channelID, type: "chat" };

$(document).ready(function () {
    database.ref("members/" + memberID).once('value').then(function (snapshot) {
        if (snapshot.val().chatChannels.length < 1) {
            // console.log("no channels");
            database.ref("members/" + memberID).update({ chatChannels: ["-LQfdAdsa1T1kTV-MewD"] });
        }
    })
    database.ref("members/" + memberID).on("value", function (snapshot) {
        let userDataServed = snapshot.val()
        data.user.fullName = userDataServed.fullName;
        data.user.userName = userDataServed.userName;
        data.user.email = userDataServed.email;
        data.user.channels = userDataServed.chatChannels;
        data.user.contacts = userDataServed.friends;
        for (h = 0; h < data.user.channels.length; h++) {
            let channelGrab = {};
            let channelID = data.user.channels[h];
            database.ref("channels/" + channelID).on("value", function (snapshot) {
                let channelDataServed = snapshot.val();
                // console.log(channelDataServed);
                channelGrab.id = channelID;
                channelGrab.name = channelDataServed.name;
                channelGrab.public = channelDataServed.public;
                channelGrab.members = channelDataServed.members;
                channelGrab.log = channelDataServed.log
            });
            data.channels.push(channelGrab);
        }
        // console.log(data);
    });
    database.ref("channels/" + activeFocus.id).on("value", function (snapshot) {
        console.log("New Chat Data Received");
        build.focus.target(activeFocus);
    });
});

let build = {
    sidebar: function () {
        $("#sidebar-channels-list").html("");
        $("#sidebar-contacts-list").html("");
        $("#sidebar-extensions-list").html("");

        let populate = function (arr, dest, interactTag, icon) {
            for (a = 0; a < arr.length; a++) {
                let line = $("<div class='sidebar-line'>")
                let itemDiv = $("<div class='sidebar-item " + interactTag + "' >");
                let sidebarElem = $("<span class='sidebar-item-text'>");
                let iconElem = $("<i class='material-icons sidebar-icon teal-text text-lighten-3'>");
                let iconDiv = $("<div>");
                iconElem.text(icon);
                iconDiv.html(iconElem);

                sidebarElem.text(arr[a]);
                itemDiv.html(sidebarElem);

                line.append(itemDiv);
                // line.append(iconDiv);
                $("#" + dest).append(line);
            }
        }
        // populate(data.channels, "sidebar-channels-list", "interact-sidebar-channel", "settings");
        // populate(data.user.contacts, "sidebar-contacts-list", "interact-sidebar-contact", "message");
        // populate(data.user.extensions, "sidebar-extensions-list", "interact-sidebar-extension", "");
    },

    focus: {
        target: function (focusTarget) {
            console.log("Targeting chat channel");
            if (focusTarget.type === "chat") {
                build.focus.chat(focusTarget);
            };
        },
        chat: function (focusTarget) {
            console.log("Chat channel targeted");
            activeFocus = focusTarget;
            focusData = {
                name: "",
                members: [],
                public: false,
                log: [],
                notify: []
            };
            database.ref("channels/" + focusTarget.id).on("value", function (snapshot) {
                channelDataServed = snapshot.val();
                focusData.name = channelDataServed.name;
                focusData.members = channelDataServed.members;
                focusData.public = channelDataServed.public;
                focusData.log = channelDataServed.log;
                console.log("Building chat header and chat body");
                $("#focus-header").html("");
                $("#focus-body").html("");
                build.focus.chatHeader(focusData);
                build.focus.chatBody(focusData);
            });
        },

        // ++++++++++++
        // CREATE CHAT HEADER
        chatHeader: function (channelData) {
            inidcatorIcon = "";
            if (channelData.public === true) {
                inidcatorIcon = "<i class='material-icons focus-header-icon'>public</i>"
            } else if (channelData.public === false) {
                inidcatorIcon = "<i class='material-icons focus-header-icon'>lock_outline</i>"
            }

            if (channelData.members[0] === "-*") {
                // "-*" is the only element listed under members in open chat channels  
                // "-*" => "all users"
                membersIndicator = " ALL ";
            } else if (channelData.members[0] === "-!") {
                // "-!" => DM channel
            } else {
                membersIndicator = channelData.members.length;
            }

            let channelInfoHTML =
                "<h6 class='focus-header-name'>" + channelData.name + "</h6>" +
                inidcatorIcon + "<span>" + membersIndicator + "</span>";
            let channelInfo = $("<div class='focus-header-info'>").html(channelInfoHTML);
            $("#focus-header").append(channelInfo);
            console.log("Chat header built");
        },
        chatBody: function (channelData) {
            let chatBodyDiv = $("<div class='focus-chat'>");
            let chatLog = $("<div id='chat-log'>");
            // For loop to iterate through each message in the channel log
            if (channelData.log.length > 0) {
                for (p = 0; p < channelData.log.length; p++) {
                    let msgData = channelData.log[p];
                    let timeSent = moment(msgData.timestamp, "MM/DD/YY HH:mm").format("hh:mm A");
                    let msgRow = $("<div class='chat-row'>");
                    let msgBlock = $("<div class='chat-message'>");
                    let msgContent = $("<div class='chat-message-content'>");
                    let msgCaption = $("<div class='chat-message-caption'>");
                    let msgSender = $("<span class='chat-message-meta'>").text(msgData.sender);
                    let msgTimestamp = $("<span class='chat-message-meta'>").text(timeSent);
                    msgCaption.append(msgSender);
                    msgCaption.append(msgTimestamp);
                    if (msgData.type === "text") {
                        msgContent.append($("<p class='chat-message-content-text'>").text(msgData.content.text));
                    };
                    msgBlock.append(msgCaption);
                    msgBlock.append(msgContent);
                    msgRow.append(msgBlock);
                    chatLog.append(msgRow);
                }
                chatBodyDiv.append(chatLog);
            };
            let chatInteract = $("<div class='chat-interact'>");
            let interactWrap = $("<div class='interact-wrapper center-align'>;");
            let interactToolbar = $("<div id='interact-chat-toolbar' class='interact interact-toolkit'>");
            let chatDefaultInput = $("<textarea id='interact-chat-input' rows='5' class='interact interact-intput'>");
            interactToolbar.text("TOOL ICONS FOR INTEGRATED CHAT FEATURES");
            interactWrap.append(interactToolbar);
            interactWrap.append(chatDefaultInput);
            chatInteract.append(interactWrap);

            chatBodyDiv.append(chatInteract);

            $("#focus-body").append(chatBodyDiv);
            $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);

            $("#interact-chat-input").on("keyup", function (event) {
                if (event.key === "Enter") {
                    let inputText = $("#interact-chat-input").val().trim();
                    if (inputText.length > 0) {
                        chat.send(inputText, activeFocus.id, "text");
                    }
                    $("#interact-chat-input").val("");
                }
            });
            console.log("Chat body built");
        }
    }
}

let chat = {
    send: function (content, dest, type) {
        if (type === "text") {
            database.ref("channels/" + dest).once('value').then(function (snapshot) {
                let priorLog = snapshot.val().log;
                let newLog = priorLog;
                newLog.push(chat.prepareMessage(content));
                console.log(newLog);
                database.ref("channels/" + dest).update({ log: newLog });
            })
        }
    },
    prepareMessage: function (textContent) {
        let logPacket = {};
        logPacket.sender = data.user.fullName;
        logPacket.type = "text";
        logPacket.content = { text: textContent };
        logPacket.timestamp = moment().format("MM/DD/YY HH:mm");
        return logPacket;
    }
}





//     //Step 3 - Build chat body
//    
//     
//     // Messages in the channel's chat log have been populated to the chat body.
//     // Now the chat input needs to be built in



// };
// if (focusTarget.type === "createChannel") {

//     // Build the header and push to page

//     let headerInfo = $("<div class='focus-header-info'>");
//     let headerName = $("<h6 class='focus-header-name'>");
//     let channelPrivacy = $("<i class='material-icons focus-header-icon'>");

//     headerName.text("Create A New Channel");
//     headerInfo.append(headerName);
//     $("#focus-header").append(headerInfo);

//     // Build the form to add the channel

//     let createChannelHTML =
//         "<div class='focus-body-content'>" +
//         "<div><br>" +
//         "<i id ='createChannel-private' class='material-icons'>lock_outline</i>" +
//         "<i id ='createChannel-public' class='material-icons'>public</i><br>" +
//         "<b>Privacy</b>" +
//         "</div><br>" +
//         "<b>Channel Name</b><br>" +
//         "<input id='createChannel-name'><br>" +
//         "<b>Add Members</b><br>" +
//         "<input id='createChannel-members'><br>" +
//         "<div>" +
//         "<span>Members added</span><br>" +
//         "</div>" +
//         "<br>" +
//         "<button id='createChannel-submit'>Create Channel</button>" +
//         "</div>";

//     $("#focus-body").html(createChannelHTML);

//     $("#createChannel-submit").on("click", function () {

//         let channelObj =
//         {
//             name: "",
//             id: "",
//             public: true,
//             members: [data.user.username],
//             log: [{ type: "text", sender: "tackIT team", timestamp: "", content: { text: "Welcome to your new tackIT channel! To get started, say something!" } }]
//         };

//         let channelName = $("#createChannel-name").val()
//         let channelMembers = [];
//         channelObj.name = channelName;
//         channelObj.members = channelMembers;

//         let channelDB = database.ref("channels");
//         channelDB.push(channelObj);
//         data.user.channels.push(channelObj);
//         build.sidebar();
//     })