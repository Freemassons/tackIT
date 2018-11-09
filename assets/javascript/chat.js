
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
// DELETE THIS BEFORE LIVE V V
memberID = "-LQjkI1jnHMweU_cJHxc";
let database = firebase.database();

var data = {
    user: {
    },
    channels: [],
    friends: [],
    default: {
        channelID: "-LQfdAdsa1T1kTV-MewD"
    }
};

activeFocus = { id: data.default.channelID, type: "chat" };

$(document).ready(function () {
    // If the user is not in any channels, add them to Open_Chat
    database.ref("members/" + memberID).once('value').then(function (snapshot) {
        if (snapshot.val().chatChannels.length < 1) {
            database.ref("members/" + memberID).update({ chatChannels: ["-LQfdAdsa1T1kTV-MewD"] });
        }
        // if (snapshot.val().friends.length === "" ) {
        //     database.ref("members/" + memberID).update({ friends: ["-LQjgthR777stMT6w7HO", "-LQjkI1jnHMweU_cJHxc", "-LQnrO55nPflGBPm-RDa"] });
        // }
    });
    database.ref("members/" + memberID).on("value", function (snapshot) {
        data.user = snapshot.val();
        if (data.user.friends.length != data.friends.length){
            data.friends = [];
            database.ref("members/").once("value").then(function (snapshot) {
                for (p = 0; p < data.user.friends.length; p++) {
                    var friendElem = { id: "", userName: "", fullName: "" };
                    let newID = data.user.friends[p];
                    friendElem.id = newID;
                    friendElem.userName = snapshot.val()[newID].userName;
                    friendElem.fullName = snapshot.val()[newID].fullName;
                    console.log(friendElem);
                    data.friends.push(friendElem);
                }
                console.log(data.friends);
                build.sidebar.populateContacts();
            });
        }
        build.sidebar.populateChannels();
    });
    database.ref("channels/" + activeFocus.id).on("value", function (snapshot) {
        build.focus.target(activeFocus);
    });
    $("#add-channel").on("click", function () { return handle.changeFocus("addChannel") });
    $("#add-contact").on("click", function () { return handle.changeFocus("addContact") });
});


var build = {
    focus: {
        target: function (focusTarget) {
            $("#focus-header").html("");
            $("#focus-body").html("");

            if (focusTarget.type === "chat") {
                build.focus.chat(focusTarget);
            };
            if (focusTarget.type === "addChannel") {
                build.focus.header(focusTarget);
                build.focus.newChannel();
            }
            if (focusTarget.type === "addContact") {
                build.focus.header(focusTarget);
                build.focus.newContact();
            }
        },
        chat: function (focusTarget) {
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
                focusData.type = focusTarget.type;
                $("#focus-header").html("");
                $("#focus-body").html("");
                build.focus.header(focusData);
                build.focus.chatBody(focusData);
            });
        },
        header: function (channelData) {
            console.log(channelData);
            inidcatorIcon = "";
            let channelInfo = $("<div class='focus-header-info'>");
            let channelInfoHTML = "";
            membersIndicator = "";
            if (channelData.type === "chat") {
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
                channelInfoHTML =
                    "<div id='channel-info-wrapper'>" +
                    "<div id='channel-info'><h6 class='focus-header-name'>" + channelData.name + "</h6>" + 
                    inidcatorIcon + "<span>" + membersIndicator + "</span></div>" +
                    "<div id='add-member-section' class='right-align'><span>Add Member: </span><input><i class='material-icons blue-text text-lighten-2' id='add-member-existingChannel'>add_box</i></div></div>";
            }
            if (channelData.type === "addChannel") {
                channelInfoHTML =
                    "<h6 class='focus-header-name'>Add A Channel</h6>"
            };
            if (channelData.type === "addContact") {
                channelInfoHTML =
                    "<h6 class='focus-header-name'>Add A Contact</h6>"
            };
            channelInfo.html(channelInfoHTML);
            $("#focus-header").append(channelInfo);
        },
        chatBody: function (channelData) {
            $("#interact-chat-input").off();
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
                    let msgSender = $("<b class='chat-message-meta' class='blue-text text-darken-3'>").text("  " + msgData.sender);
                    let msgTimestamp = $("<span class='chat-message-meta'>").text("  " +  timeSent);
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
        },
        newChannel: function () {
            $(".sidebar-contact").off();
            $("#createChannel-private").off();
            $("#createChannel-public").off();
            $("#add-member").off();
            $("#createChannel-submit").off();

            isPublic = false;
            membersAdded = [memberID];
            createChannelHTML =
                "<div id='createChannel-wrapper'>" +
                "<div><b>Create New Channel</b><br>" +
                "<i id ='createChannel-private' class='material-icons blue-text'>lock_outline</i>" +
                "<i id ='createChannel-public' class='material-icons'>public</i><br>" +
                "<b>Privacy</b>" +
                "</div><br>" +
                "<div class='focus-body-content'>" +
                "<b>Channel Name</b><br>" +
                "<input id='createChannel-name'><br><br>" +
                "<b>Add Members</b><br>" +
                // "<input id='createChannel-members'><i class='material-icons blue-text text-lighten-2' id='add-member'>add_box</i><br>" + 
                "<span><b>Click a contact on the sidebar to add them</b></span><br>" +
                "<div>" +
                "<span>Members added</span><br>" +
                "<div id='members-added-display'></div>" +
                "</div>" +
                "<br>" +
                "<button id='createChannel-submit'>Create Channel</button>" +
                "</div></div><br>" +
                "<div class='divider'></div><br>" +
                "<div id='joinChannel-wrapper'>" +
                "<span>OR</span><br><br>" +
                "<b>Enter The Name of The Channel You Want to Join</b><br><br>" +
                "<input id='join-channel-input'><i class='material-icons blue-text text-lighten-2' id='join-channel-go'>add_box</i>" +
                "</div>";
            $("#focus-body").html(createChannelHTML);
            $("#createChannel-private").on("click", function () {
                if (isPublic) {
                    isPublic = false;
                    $("#createChannel-private").attr("class", "material-icons blue-text");
                    $("#createChannel-public").removeClass("blue-text");
                }
            });

            $("#createChannel-public").on("click", function () {
                if (!isPublic) {
                    isPublic = true;
                    $("#createChannel-public").attr("class", "material-icons blue-text");
                    $("#createChannel-private").removeClass("blue-text");
                }
            });
            $("#add-member").on("click", function () {
                if ($("#createChannel-members").val().length > 0) {
                    $("#members-added-display").append($("#createChannel-members").val());
                    $("#createChannel-members").val("");
                }
            })
            $(".sidebar-contact").on("click", function (event) {
                if (membersAdded.indexOf(event.currentTarget.id) === -1) {
                    membersAdded.push(event.currentTarget.id);
                    $("#members-added-display").append(event.currentTarget.innerText + "<br>");
                };
            })
            $("#createChannel-submit").on("click", function () {
                if ($("#createChannel-name").val().length > 0) {
                    $(".sidebar-contact").off();
                    $("#sidebar-contact-list").html("");
                    newChannelData = {};
                    timeOfCreation = moment().format("MM/DD/YY HH:mm");
                    newChannelData.public = isPublic;
                    newChannelData.name = $("#createChannel-name").val();
                    newChannelData.members = membersAdded;
                    newChannelData.log = [{ sender: "tackIt Team", type: "text", timestamp: timeOfCreation, content: { text: "Welcome to your new tackIT channel! To get started, say something!" } }];
                    newChannelData.owner = memberID;
                    newChannelData.created = timeOfCreation;
                    handle.addChatChannel(newChannelData);
                }
            })
        },
        newContact: function () {
            addContactHTML =
                "<div id='addContact-wrapper'>" +
                "<b>Search User Name</b><br>" +
                "<input id='addContact-username'><br><br>" +
                "<button id='addContact-userName-submit'>Search Username</button>" +
                // "<input id='addContact-members'><i class='material-icons blue-text text-lighten-2' id='add-member'>add_box</i><br>" + 
                "<br><div id='search-results'><br></div>" +
                "</div>";
            $("#focus-body").html(addContactHTML);
            $("#addContact-userName-submit").on("click", function (event){
                userNameQuery = $("#addContact-username").val().toLowerCase();
                database.ref("members/").once("value").then(function (snapshot) {
                    console.log(snapshot.val());
                    for (var i in snapshot.val()){
                        if( snapshot.val()[i].userName.slice(0, (userNameQuery.length)).toLowerCase() == userNameQuery.toLowerCase()){
                            console.log("MATCH");
                            let contactResultElem = $("<span id='"+ i + "'>");
                            contactResultElem.append($("<br>"));
                            contactResultElem.text("Added: " + snapshot.val()[i].userName);
                            $("#search-results").append(contactResultElem);
                            handle.addContact(i);
                        }
                    }
                })

            })
        }
    },
    sidebar: {
        init: function () {
            
            build.sidebar.populateChannels();
            build.sidebar.populateContacts();
        },
        populateChannels: function () {
            $("#sidebar-channels-list").html("")
            for (q = 0; q < data.user.chatChannels.length; q++) {
                let currentChannelId = data.user.chatChannels[q];
                database.ref("channels/" + currentChannelId).once("value").then(function (snapshot) {
                    let line = $("<div class='sidebar-line'>")
                    let itemDiv = $("<div class='sidebar-item' id='" + currentChannelId + "'>");
                    let sidebarElem = $("<span class='sidebar-item-text'>");
                    sidebarElem.text(snapshot.val().name);
                    itemDiv.html(sidebarElem);
                    line.append(itemDiv);
                    $("#sidebar-channels-list").append(line);
                    $("#" + currentChannelId).on("click", function () { return handle.changeFocus(currentChannelId) });
                });
            }
        },
        populateContacts: function () {
            console.log('init');
            $("#sidebar-contacts-list").html("");
            for (c = 0; c < data.friends.length; c++) {
                console.log('iterate');
                let currentFriend = data.friends[c];
                let line = $("<div class='sidebar-line'>")
                let itemDiv = $("<div class='sidebar-item sidebar-contact' id='" + currentFriend.id + "'>");
                let sidebarFullNameElem = $("<span class='sidebar-item-text'>");
                sidebarFullNameElem.text(data.friends[c].fullName);
                itemDiv.html(sidebarFullNameElem);
                console.log('append');
                line.append(itemDiv);
                $("#sidebar-contacts-list").append(line);
                // $("#" + currentChannelId).on("click", function () { return handle.changeFocus(currentChannelId) });
            };
        }

    }
}


var handle = {
    changeFocus: function (changeTo) {
        activeFocus.id = changeTo;
        if (data.user.chatChannels.indexOf(changeTo) >= 0) {
            activeFocus.type = "chat";
        }
        if (changeTo === "addChannel") {
            activeFocus.type = "addChannel";
        }
        if (changeTo === "addContact"){
            activeFocus.type = "addContact";
        }
        build.focus.target(activeFocus);
    },
    addChatChannel: function (toAdd) {
        newChannelKey = "";
        newChannelPost = database.ref("channels").push(toAdd)
        database.ref("channels").on("child_added", (snapshot) => {
            if (snapshot.val().name === toAdd.name) {
                newChannelKey = newChannelPost.getKey();
                let tempChanArr = data.user.chatChannels;
                tempChanArr.push(newChannelKey);
                database.ref("members/" + memberID).update({ chatChannels: tempChanArr });
            }
        });
    },
    joinChatChannel: function (toJoin) {

    },
    addContact : function (toAddID) {
        console.log("adding");
        console.log("...");
        database.ref("members/"+toAddID).once("value").then(function(snapshot){
            let tempContactList = snapshot.val().friends;
            console.log(tempContactList);
            console.log("...");
            tempContactList.push(memberID);
            console.log(tempContactList);
            console.log("...");
            database.ref("members/"+toAddID).update({friends : tempContactList});
        });
        database.ref("members/"+memberID).once("value").then(function(snapshot){
            let tempContactList = snapshot.val().friends;
            console.log(tempContactList);
            console.log("...");
            tempContactList.push(toAddID);
            console.log(tempContactList);
            console.log("...");
            database.ref("members/"+memberID).update({friends : tempContactList});
        });
    }
}

var chat = {
    send: function (content, dest, type) {
        if (type === "text") {
            database.ref("channels/" + dest).once('value').then(function (snapshot) {
                let priorLog = snapshot.val().log;
                let newLog = priorLog;
                newLog.push(chat.prepareMessage(content));
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









