
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
    });
    database.ref("members/" + memberID).on("value", function (snapshot) {
        console.log("User Data Updated!");
        data.user = snapshot.val();
        build.sidebar.init();
    });
    database.ref("channels/" + activeFocus.id).on("value", function (snapshot) {
        console.log("Focus Data Received");
        build.focus.target(activeFocus);
    });
    $("#add-channel").on("click", function () { return handle.changeFocus("addChannel") })
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
                focusData.type = focusTarget.type;
                console.log("Building chat header and chat body");
                $("#focus-header").html("");
                $("#focus-body").html("");
                build.focus.header(focusData);
                build.focus.chatBody(focusData);
            });
        },
        header: function (channelData) {
            inidcatorIcon = "";
            let channelInfo = $("<div class='focus-header-info'>");
            let channelInfoHTML = "";
            let viewMembers = $("<i id='view-chat-members' class='material-icons>");
            let notOpenOrDM = false;
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
                    notOpenOrDM = true;
                }
                channelInfoHTML =
                    "<h6 class='focus-header-name'>" + channelData.name + "</h6>" +
                    inidcatorIcon + "<span>" + membersIndicator + "</span>";
                if (notOpenOrDM){
                    channelInfoHTML = channelInfoHTML + viewMembers;
                }
            }
            if (channelData.type === "addChannel") {
                channelInfoHTML =
                    "<h6 class='focus-header-name'>Add A Channel</h6>"
            };
            channelInfo.html(channelInfoHTML);
            $("#focus-header").append(channelInfo);
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
        },
        newChannel: function () {
            isPublic = false;
            membersAdded = [memberID];
            createChannelHTML =
                "<div id='createChannel-wrapper'>" +
                "<div><br>" +
                "<i id ='createChannel-private' class='material-icons blue-text'>lock_outline</i>" +
                "<i id ='createChannel-public' class='material-icons'>public</i><br>" +
                "<b>Privacy</b>" +
                "</div><br>" +
                "<div class='focus-body-content'>" +
                "<b>Channel Name</b><br>" +
                "<input id='createChannel-name'><br>" +
                "<b>Add Members</b><br>" +
                "<input id='createChannel-members'><i class='material-icons blue-text text-lighten-2' id='add-member'>add_box</i><br>" +
                "<div>" +
                "<span>Members added</span><br>" +
                "<div id='members-added-display'></div>"+
                "</div>" +
                "<br>" +
                "<button id='createChannel-submit'>Create Channel</button>" +
                "</div></div>";
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
            $("#add-member").on("click",function(){
                if($("#createChannel-members").val().length>0){
                    $("#members-added-display").append($("#createChannel-members").val());
                    $("#createChannel-members").val("");
                }
            })
            $("#createChannel-submit").on("click", function () {
                if ($("#createChannel-name").val().length > 0) {
                    newChannelData = {};
                    timeOfCreation = moment().format("MM/DD/YY HH:mm");
                    newChannelData.public = isPublic;
                    newChannelData.name = $("#createChannel-name").val();
                    newChannelData.members = membersAdded;
                    newChannelData.log = [{sender:"tackIt Team", type: "text", timestamp: timeOfCreation, content: {text:"Welcome to your new tackIT channel! To get started, say something!"}}];
                    newChannelData.owner = memberID;
                    newChannelData.created = timeOfCreation;
                    console.log(newChannelData);
                    handle.addChatChannel(newChannelData);
                }
            })
        }
    },
    sidebar: {
        init: function () {
            $("#sidebar-channels-list").html("");
            $("#sidebar-contact-list").html("");
            build.sidebar.populateChannels();
        },
        populateChannels: function () {
            console.log("Fetch channels");
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
                    $("#" + currentChannelId).on("click", function () {return handle.changeFocus(currentChannelId)});
                });
            }
        },
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
        console.log(activeFocus);
        build.focus.target(activeFocus);
    },
    addChatChannel: function (toAdd) {
        newChannelKey = "";
        newChannelPost = database.ref("channels").push(toAdd)
        database.ref("channels").on("child_added",(snapshot)=>{
            if(snapshot.val().name === toAdd.name){
                console.log("Looks right to me!");
                newChannelKey = newChannelPost.getKey();
                console.log("New key: " + newChannelKey);
                let tempChanArr = data.user.chatChannels;
                tempChanArr.push(newChannelKey);
                database.ref("members/"+memberID).update({chatChannels: tempChanArr});
            }
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

// var suggest = {
//     channels : function ( thusfar,  lim ) {
//         var channelList = database.ref("channels").once("value").then((snapshot)=>{
//             console.log(snapshot.val());
//         })

//     }
// }

// suggest.channels();






