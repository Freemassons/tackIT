
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
        if (data.user.friends.length != data.friends.length) {
            data.friends = [];
            database.ref("members/").once("value").then(function (snapshot) {
                for (p = 0; p < data.user.friends.length; p++) {
                    var friendElem = { id: "", userName: "", fullName: "" };
                    let newID = data.user.friends[p];
                    friendElem.id = newID;
                    friendElem.userName = snapshot.val()[newID].userName;
                    friendElem.fullName = snapshot.val()[newID].fullName;
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
                    inidcatorIcon = "<i id='view-members' class='material-icons focus-header-icon'>public</i>"
                } else if (channelData.public === false) {
                    inidcatorIcon = "<i id='view-members' class='material-icons focus-header-icon'>lock_outline</i>"
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
                    "<div id='channel-info'>" +
                    "<h4 class='focus-header-name'>" + channelData.name + "</h4><br>" +
                    "<div id='members-section'>" +
                    "<div id='members-indicator-section'>" +
                    "<span id='focus-header-numMembers' class='focus-header-text'>" + membersIndicator + "</span>" + inidcatorIcon +
                    "<div id='member-list-hover'>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>";
            }
            if (channelData.type === "addChannel") {
                channelInfoHTML =
                    "<h4 class='focus-header-name'>Add A Channel</h4>"
            };
            if (channelData.type === "addContact") {
                channelInfoHTML =
                    "<h4 class='focus-header-name'>Add A Contact</h4>"
            };
            if (channelData.type === "chat") {
                for (l = 0; l < channelData.members.length && channelData.members[0] != "-*"; l++) {
                    thisMember = channelData.members[l];
                    database.ref("members/" + thisMember).once("value").then(function (snapshot) {
                        let memberFullNameElem = $("<b>").text(snapshot.val().fullName).append($("<br>"));
                        let memberUserNameElem = $("<b>").text(snapshot.val().userName);
                        let memberDiv = $("<div>");
                        // memberDiv.append(memberFullNameElem);
                        memberDiv.append(memberUserNameElem);
                        memberDiv.append($("<div class='divider blue blue-darken-1'>"));
                        $("#member-list-hover").append(memberDiv);
                    });
                }
            }
            channelInfo.html(channelInfoHTML);
            $("#focus-header").append(channelInfo);
            if (channelData.type === "chat" && channelData.members[0] === "-*") {
                console.log()
                let membersAreAll = $("<b>").text("ALL")
                $("#member-list-hover").html(membersAreAll);
                $("#add-member-section").css("display", "none");
            }
            if (channelData.type === "chat" && channelData.members[0] != "-*") {
                let extraHTML =
                    "<div id='add-member-section' class='right-align'>" +
                    "<span id='leave-channel-label'class='focus-header-text-2'>Leave This Channel</span>" +
                    "<i class='material-icons red-text text-darken-1 focus-header-icon-2' id='leave-channel'>remove_circle</i><br>" +
                    "<input id='add-member-username' placeholder='Add a member by username'>" +
                    "<i class='material-icons blue-text text-lighten-2 focus-header-icon' id='add-member-existingChannel'>add_box</i>" +
                    "</div>";
                $("#channel-info-wrapper").append(extraHTML);
            }

            $("#view-members").off();
            $("#view-members").on("mouseover", function () {
                $("#member-list-hover").css("visibility", "visible");
            });
            $("#view-members").on("mouseout", function () {
                $("#member-list-hover").css("visibility", "hidden");
            });

            $("#add-member-existingChannel").off();
            $("#add-member-existingChannel").on("click", function (event) {
                userNameQuery = $("#add-member-username").val().toLowerCase();
                $("#add-member-username").val("");
                if (userNameQuery.length > 1) {
                    database.ref("members/").once("value").then(function (snapshot) {
                        for (var i in snapshot.val()) {
                            if (snapshot.val()[i].userName.slice(0, (userNameQuery.length)).toLowerCase() == userNameQuery.toLowerCase()) {
                                console.log("MATCH");
                                let contactResultElem = $("<span id='" + i + "'>");
                                contactResultElem.append($("<br>"));
                                contactResultElem.text("Added: " + snapshot.val()[i].userName);
                                handle.addToChannel(i, activeFocus.id);
                            }
                        }
                    });
                }

            })
            $("#leave-channel").off();
            $("#leave-channel").on("click", function () {
                handle.leaveChatChannel(activeFocus.id);
                build.focus.target({ id: data.user.chatChannels[0], type: "chat" });
            });
        },
        chatBody: function (channelData) {
            $("#interact-chat-input").off();
            let chatBodyDiv = $("<div class='focus-chat'>");
            let chatLog = $("<div id='chat-log'>");
            // For loop to iterate through each message in the channel log
            if (channelData.log.length > 0) {
                for (p = 0; p < channelData.log.length; p++) {
                    let msgData = channelData.log[p];
                    let timeSent = moment(msgData.timestamp, "MM/DD/YY HH:mm").format("MM/DD hh:mm A");
                    let msgRow = $("<div class='chat-row'>");
                    let msgBlock = $("<div class='chat-message'>");
                    let msgContent = $("<div class='chat-message-content'>");
                    let msgCaption = $("<div class='chat-message-caption'>");
                    let msgSender = $("<b class='blue-text text-darken-3'>").text("" + msgData.sender).append($("<br>"));
                    let msgTimestamp = $("<span class='chat-message-meta'>").text("  " + timeSent);
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
            let chatDefaultInput = $("<textarea placeholder='Type to chat! Press enter to send.' id='interact-chat-input' rows='5' class='interact interact-intput'>");
            // interactToolbar.text("TOOL ICONS FOR INTEGRATED CHAT FEATURES");
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
            showCreate = true;
            membersAdded = [memberID];
            createChannelHTML =
                "<div id='create-join-wrapper'>" +
                "<div>" +
                "<button id='show-create'> Create New Channel</button>" +
                "<button id='show-join'> Join Existing Channel </button> <br>" +
                // "<div class='divider'></div>" +
                "</div>" +
                "<div id='createChannel-wrapper'>" +
                "<div>" +
                "<b>Privacy Setting</b><br>" +
                "<i id ='createChannel-private' class='material-icons blue-text'>lock_outline</i>" +
                "<i id ='createChannel-public' class='material-icons'>public</i>" +
                "<br><span id='priv-sel'>Private</span>" +
                "</div><br>" +
                "<b>Channel Name</b><br>" +
                "<input id='createChannel-name'><br><br>" +
                "<b>Add Members</b><br>" +
                "<span><b>Click a contact on the sidebar to add them</b></span><br>" +
                "<div>" +
                "<br>" +
                "<div id='members-added-display'></div>" +
                "</div>" +
                "<br>" +
                "<button id='createChannel-submit'>Create Channel</button>" +
                "</div>" +
                "<div id='joinChannel-wrapper'>" +
                "<br>" +
                "<h5>Join Existing Channel</h5><br><br>" +
                "<input id='join-channel-input'><i class='material-icons blue-text text-lighten-2' id='join-channel-go'>add_box</i>" +
                "</div>" +
                "</div>";
            $("#focus-body").html(createChannelHTML);
            $("#joinChannel-wrapper").css("display", "none");

            $("#show-create").off();
            $("#show-create").on("click", function () {
                if (!showCreate) {
                    $("#joinChannel-wrapper").css("display", "none");
                    $("#createChannel-wrapper").css("display", "block");
                }
                showCreate = true;
            });

            $("#show-join").off();
            $("#show-join").on("click", function () {
                if (showCreate) {
                    $("#createChannel-wrapper").css("display", "none");
                    $("#joinChannel-wrapper").css("display", "block");
                }
                showCreate = false;
            })

            $("#createChannel-private").off();
            $("#createChannel-private").on("click", function () {
                if (isPublic) {
                    isPublic = false;
                    $("#createChannel-private").attr("class", "material-icons blue-text");
                    $("#createChannel-public").removeClass("blue-text");
                    $("#priv-sel").text("");
                    $("#priv-sel").text("Private");
                }
            });

            $("#createChannel-public").off();
            $("#createChannel-public").on("click", function () {
                if (!isPublic) {
                    isPublic = true;
                    $("#createChannel-public").attr("class", "material-icons blue-text");
                    $("#createChannel-private").removeClass("blue-text");
                    $("#priv-sel").text("");
                    $("#priv-sel").text("Public");
                }
            });

            
            $("#add-member").off();
            $("#add-member").on("click", function () {
                if ($("#createChannel-members").val().length > 0) {
                    $("#members-added-display").append($("#createChannel-members").val());
                    $("#createChannel-members").val("");
                }
            });

            $(".sidebar-contact").off();
            $(".sidebar-contact").on("click", function (event) {
                if (membersAdded.indexOf(event.currentTarget.id) === -1) {
                    membersAdded.push(event.currentTarget.id);
                    $("#members-added-display").append(event.currentTarget.innerText + "<br>");
                };
            });

            $("#createChannel-submit").off();
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
            });

            $("#join-channel-go").off();
            $("#join-channel-go").on("click", function(){
                let searchTerm = $("#join-channel-input").val();
                handle.joinChatChannel(searchTerm);
                $("#join-channel-input").val("");
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

            $("#addContact-userName-submit").off();
            $("#addContact-userName-submit").on("click", function () {
                userNameQuery = $("#addContact-username").val().toLowerCase();
                database.ref("members/").once("value").then(function (snapshot) {
                    console.log(snapshot.val());
                    for (var i in snapshot.val()) {
                        if (snapshot.val()[i].userName.slice(0, (userNameQuery.length)).toLowerCase() == userNameQuery.toLowerCase()) {
                            console.log("MATCH");
                            let contactResultElem = $("<span id='" + i + "'>");
                            contactResultElem.append($("<br>"));
                            contactResultElem.text("Added: " + snapshot.val()[i].userName);
                            $("#search-results").append(contactResultElem);
                            if (data.user.friends.indexOf(i) === -1) { handle.addContact(i) }
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
        if (changeTo === "addContact") {
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
    addToChannel(newMember, thisChannel) {
        database.ref("channels/" + thisChannel).once("value").then(function (snapshot) {
            let tempMemberArr = snapshot.val().members;
            if (tempMemberArr.indexOf(newMember) === -1) {
                tempMemberArr.push(newMember);
                database.ref("channels/" + thisChannel).update({ members: tempMemberArr });
            }
        });
        database.ref("members/" + newMember).once("value").then(function (snapshot) {
            let tempArr = snapshot.val().chatChannels;
            tempArr.push(thisChannel);
            database.ref("members/" + newMember).update({ chatChannels: tempArr })
        })
    },
    joinChatChannel: function (toJoinName) {
        database.ref("channels").once("value").then(function (snapshot) {
            channelList = snapshot.val();
            for (var g in channelList) {
                if (channelList[g].name.slice(0, (toJoinName.length)).toLowerCase() == toJoinName.toLowerCase()) {
                    let toJoin = g;
                    database.ref("channels/" + toJoin).once("value").then(function (snapshot) {
                        tempMemberArr = snapshot.val().members;
                        if (tempMemberArr.indexOf(memberID) === -1 && snapshot.val().public) {
                            tempMemberArr.push(memberID);
                            database.ref("channels/" + toJoin).update({ members: tempMemberArr });
                        }
                    });
                    data.user.chatChannels.push(toJoin);
                    database.ref("members/" + memberID).update({ chatChannels: data.user.chatChannels })
                }
            }
        });
    },
    leaveChatChannel: function (toLeave) {
        database.ref("channels/" + toLeave).once("value").then(function (snapshot) {
            tempMemberArr = snapshot.val().members;
            newMemberArr = tempMemberArr.filter(function (value, index, arr) {
                return value != memberID
            })
            database.ref("channels/" + toLeave).update({ members: newMemberArr });
        });
        userChannels = data.user.chatChannels.filter(function (value, index, arr) {
            return value != toLeave;
        })
        database.ref("members/" + memberID).update({ chatChannels: userChannels });
    },

    addContact: function (toAddID) {
        database.ref("members/" + toAddID).once("value").then(function (snapshot) {
            let tempContactList = snapshot.val().friends;
            tempContactList.push(memberID);
            console.log(tempContactList);
            database.ref("members/" + toAddID).update({ friends: tempContactList });
        });
        database.ref("members/" + memberID).once("value").then(function (snapshot) {
            let tempContactList = snapshot.val().friends;
            tempContactList.push(toAddID);
            database.ref("members/" + memberID).update({ friends: tempContactList });
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
