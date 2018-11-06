
// [-[-[ GRAB ]-]-]
// On login, make a call requesting user data
// Iterate through channels and request channel data for each
// Iterate through users and request channel data for each 
// (Makes most sense to just store user-to-user DM as private channels)

var data = {

    //User data: packet to be served to page directly post login

    user:
    {
        username: "zrheaume",
        fullname: "Zach Rheaume",
        icon: "",
        email: "zachary.a.rheaume@gmail.com",
        channels: ["Open_Chat", "Design101", "Project_1_Group"],
        contacts: ["jameson247", "rodneyBigHorn", "jFitzgerald", "unknownChalupa", "simpleSeerup", "stevePearceHitsBombs", "whosAskin22"],
        extensions: ["giphy", "Google Maps API", "GeocodeAPI", "WhetherAPI"],
        board: {
            tacks: []
        },
        settings: {
            default_channel: "Open_Chat",
        }
    },
    channels:
        [
            {
                name: "Open_Chat",
                id: "some sort of unique ID besides name",
                public: true,
                members: ["jameson247", "rodneyBigHorn", "jFitzgerald", "unknownChalupa", "simpleSeerup", "stevePearceHitsBombs", "whosAskin22"],
                log: [
                    {
                        type: "text",
                        sender: "jameson247",
                        timestamp: "11/03/18 13:25",
                        content: {
                            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur lacinia ex nec pharetra. Praesent efficitur magna urna, vitae luctus eros tempus at. Class aptent.",
                            dependencies: null,
                            url: null,
                        }
                    },
                    { type: "text", sender: "rodneyBigHorn", timestamp: "11/03/18 07:27", content: { text: "Lorem ipsum dolor sit amet." } },
                    { type: "text", sender: "unknownChalupa", timestamp: "11/03/18 09:40", content: { text: "Nam efficitur lacinia ex nec pharetra. Praesent efficitur magna urna, vitae luctus eros tempus at. Class aptent." } },
                    { type: "text", sender: "zrheaume", timestamp: "11/03/18 09:43", content: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum nec mauris sed mattis. Donec quis est lectus. Nulla quis malesuada eros. Aliquam sollicitudin, lectus quis venenatis tempus, est sem dignissim enim, imperdiet venenatis justo eros sit amet metus. Phasellus mollis diam eu nisl elementum luctus. Curabitur varius molestie vehicula. Sed ut pulvinar ipsum. Phasellus mollis lectus id purus accumsan porttitor. Mauris convallis dictum eros, a tempor ligula vestibulum sed. Sed suscipit ut risus at." } },
                    { type: "text", sender: "rodneyBigHorn", timestamp: "11/03/18 09:46", content: { text: "...", url: "https://media1.giphy.com/media/11R5KYi6ZdP8Z2/giphy.gif" } },
                    { type: "text", sender: "jFitzgerald", timestamp: "11/03/18 12:12", content: { text: "Nam efficitur lacinia ex nec pharetra. Praesent efficitur magna urna" } },
                    { type: "text", sender: "rodneyBigHorn", timestamp: "11/03/18 13:33", content: { text: "Lorem ipsum dolor sit amet." } },
                    { type: "text", sender: "unknownChalupa", timestamp: "11/03/18 13:35", content: { text: "Nam efficitur lacinia ex nec pharetra. Praesent efficitur magna urna, vitae luctus eros tempus at. Class aptent." } },
                    { type: "text", sender: "zrheaume", timestamp: "11/03/18 13:35", content: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum nec mauris sed mattis. Donec quis est lectus. Nulla quis malesuada eros. Aliquam sollicitudin, lectus quis venenatis tempus, est sem dignissim enim, imperdiet venenatis justo eros sit amet metus. Phasellus mollis diam eu nisl elementum luctus. Curabitur varius molestie vehicula. Sed ut pulvinar ipsum. Phasellus mollis lectus id purus accumsan porttitor. Mauris convallis dictum eros, a tempor ligula vestibulum sed. Sed suscipit ut risus at." } },
                    { type: "text", sender: "rodneyBigHorn", timestamp: "11/03/18 13:36", content: { text: "...", url: "https://media1.giphy.com/media/11R5KYi6ZdP8Z2/giphy.gif" } },
                    { type: "text", sender: "jFitzgerald", timestamp: "11/03/18 13:48", content: { text: "Nam efficitur lacinia ex nec pharetra. Praesent efficitur magna urna" } },

                ]
            },
            {
                name: "Design101",
                id: "some sort of unique ID besides name",
                public: false,
                members: ["jameson247", "rodneyBigHorn"],
                log: [
                    {
                        type: "text",
                        sender: "jameson247",
                        timestamp: "11/03/18 13:25",
                        content: {
                            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur lacinia ex nec pharetra. Praesent efficitur magna urna, vitae luctus eros tempus at. Class aptent.",
                            dependencies: null,
                            url: null,
                        }
                    },
                    { type: "text", sender: "rodneyBigHorn", timestamp: "11/03/18 07:27", content: { text: "Lorem ipsum dolor sit amet." } },
                    { type: "text", sender: "unknownChalupa", timestamp: "11/03/18 09:40", content: { text: "Nam efficitur lacinia ex nec pharetra. Praesent efficitur magna urna, vitae luctus eros tempus at. Class aptent." } },
                    { type: "text", sender: "zrheaume", timestamp: "11/03/18 09:43", content: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum nec mauris sed mattis. Donec quis est lectus. Nulla quis malesuada eros. Aliquam sollicitudin, lectus quis venenatis tempus, est sem dignissim enim, imperdiet venenatis justo eros sit amet metus. Phasellus mollis diam eu nisl elementum luctus. Curabitur varius molestie vehicula. Sed ut pulvinar ipsum. Phasellus mollis lectus id purus accumsan porttitor. Mauris convallis dictum eros, a tempor ligula vestibulum sed. Sed suscipit ut risus at." } },
                    { type: "text", sender: "rodneyBigHorn", timestamp: "11/03/18 09:46", content: { text: "...", url: "https://media1.giphy.com/media/11R5KYi6ZdP8Z2/giphy.gif" } },
                    { type: "text", sender: "zrheaume", timestamp: "11/03/18 13:35", content: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum nec mauris sed mattis. Donec quis est lectus. Nulla quis malesuada eros. Aliquam sollicitudin, lectus quis venenatis tempus, est sem dignissim enim, imperdiet venenatis justo eros sit amet metus. Phasellus mollis diam eu nisl elementum luctus. Curabitur varius molestie vehicula. Sed ut pulvinar ipsum. Phasellus mollis lectus id purus accumsan porttitor. Mauris convallis dictum eros, a tempor ligula vestibulum sed. Sed suscipit ut risus at." } },
                    { type: "text", sender: "rodneyBigHorn", timestamp: "11/03/18 13:36", content: { text: "...", url: "https://media1.giphy.com/media/11R5KYi6ZdP8Z2/giphy.gif" } },
                ]
            },
            {
                name: "Project_1_Group",
                id: "some sort of unique ID besides name",
                public: true,
                members: ["jFitzgerald", "unknowChalupa", "simpleSeerup", "whosAskin22"],
                log: [
                    {
                        type: "text",
                        sender: "jameson247",
                        timestamp: "11/03/18 13:25",
                        content: {
                            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur lacinia ex nec pharetra. Praesent efficitur magna urna, vitae luctus eros tempus at. Class aptent.",
                            dependencies: null,
                            url: null,
                        }
                    },
                    { type: "text", sender: "rodneyBigHorn", timestamp: "11/03/18 07:27", content: { text: "Lorem ipsum dolor sit amet." } },
                    { type: "text", sender: "unknownChalupa", timestamp: "11/03/18 09:40", content: { text: "Nam efficitur lacinia ex nec pharetra. Praesent efficitur magna urna, vitae luctus eros tempus at. Class aptent." } },
                    { type: "text", sender: "zrheaume", timestamp: "11/03/18 09:43", content: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum nec mauris sed mattis. Donec quis est lectus. Nulla quis malesuada eros. Aliquam sollicitudin, lectus quis venenatis tempus, est sem dignissim enim, imperdiet venenatis justo eros sit amet metus. Phasellus mollis diam eu nisl elementum luctus. Curabitur varius molestie vehicula. Sed ut pulvinar ipsum. Phasellus mollis lectus id purus accumsan porttitor. Mauris convallis dictum eros, a tempor ligula vestibulum sed. Sed suscipit ut risus at." } },
                    { type: "text", sender: "jFitzgerald", timestamp: "11/03/18 13:48", content: { text: "Nam efficitur lacinia ex nec pharetra. Praesent efficitur magna urna" } },

                ]
            },
            {
                name: "jameson247",
                id: "some sort of unique ID besides name",
                public: false,
                members: "!",
                log: []
            },
            {
                name: "rodneyBigHorn",
                id: "some sort of unique ID besides name",
                public: false,
                members: "!",
                log: []
            },
            {
                name: "jFitzgerald",
                id: "some sort of unique ID besides name",
                public: false,
                members: "!",
                log: []
            },
            {
                name: "unknownChalupa",
                id: "some sort of unique ID besides name",
                public: false,
                members: "!",
                log: []
            },
            {
                name: "simpleSeerup",
                id: "some sort of unique ID besides name",
                public: false,
                members: "!",
                log: []
            },
            {
                name: "stevePearceHitsBombs",
                id: "some sort of unique ID besides name",
                public: false,
                members: "!",
                log: []
            },
            {
                name: "whosAskin22",
                id: "some sort of unique ID besides name",
                public: false,
                members: "!",
                log: []
            }

        ],
    extensions:
        [
            {
                name: "giphy",
                enabled: true,
                features: {
                    search: 'pointer to our hosted API call method'
                }
            },
            { name: "Google Maps API", enabled: false },
            { name: "GeocodeAPI", enabled: false },
            { name: "WeatherAPI" }
        ]
};

// 
let defaultFocus = {
    selector: data.user.settings.default_channel,
    type: "chat",
};

let activeFocus = {};

// buildView is gives us methods to dynamically build / rebuild the 

let buildView = {

    // init method calls build methods for all sections
    init: function () {
        buildView.sidebar();
        buildView.focus(defaultFocus);
        buildView.board();
        interact.init();
    },

    // Builds sidebar (most static component)
    sidebar: function () {
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
        populate(data.user.channels, "sidebar-channels-list", "interact-sidebar-channel", "settings");
        populate(data.user.contacts, "sidebar-contacts-list", "interact-sidebar-contact", "message");
        populate(data.user.extensions, "sidebar-extensions-list", "interact-sidebar-extension", "");
    },

    // Builds focus panel (most dynamic component)
    // buildview.focus takes a parameter formatted like
    // this object: { selector : "idendtifier", type ="focusType" }

    focus: function (focusTarget) {

        activeFocus = focusTarget;

        // Clear the parent divs the content will be pushed to
        $("#focus-header").html("");
        $("#focus-body").html("");


        let focusData = {};
        // Check to see what type we're working with here
        //
        if (focusTarget.type === "chat") {

            for (f = 0; f < data.channels.length; f++) {
                if (data.channels[f].name === focusTarget.selector) {
                    focusData = data.channels[f];
                };
            };

            //Step 2 - Build chat header 

            // Create header html components 
            let channelInfo = $("<div class='focus-header-info'>");
            let channelName = $("<h6 class='focus-header-name'>");
            let channelPrivacy = $("<i class='material-icons focus-header-icon'>");
            let channelMembers = $("<span class='focus-header-members'>");


            channelName.text(focusData.name);

            // Check if we've been given a chat channel or a DM channel
            if (focusData.members != "!") {
                channelMembers.text(focusData.members.length);
            };

            if (focusData.public === true) {
                channelPrivacy.text("public");
            } else if (focusData.public === false) {
                channelPrivacy.text("lock_outline");
            }

            channelInfo.append(channelName);
            channelInfo.append(channelPrivacy);
            channelInfo.append(channelMembers);
            channelInfo.append($("<i class='material-icons focus-header-icon'>").text("people"));

            $("#focus-header").append(channelInfo);

            //Step 3 - Build chat body
            let chatBody = $("<div class='focus-chat'>");
            let chatLog = $("<div id='chat-log'>");
            let chatInteract = $("<div class='chat-interact'>");

            // For loop to iterate through each message in the channel log
            if (focusData.log.length > 0) {
                for (p = 0; p < focusData.log.length; p++) {
                    let msgData = focusData.log[p];
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
            }
            chatBody.append(chatLog);
            // Messages in the channel's chat log have been populated to the chat body.
            // Now the chat input needs to be built in

            let interactWrap = $("<div class='interact-wrapper center-align'>;");
            let interactToolbar = $("<div id='interact-chat-toolbar' class='interact interact-toolkit'>");
            // let interactDefaultInput = $("<input id='interact-chat-input' class='interact interact-input'>");
            let interactDefaultInputTextarea = $("<textarea id='interact-chat-input' rows='5' class='interact interact-intput'>");
            // interactDefaultInput.append(interactDefaultInputTextarea);

            //TEMPORARY
            interactToolbar.text("TOOL ICONS FOR INTEGRATED CHAT FEATURES");

            interactWrap.append(interactToolbar);
            // interactWrap.append(interactDefaultInput);            
            interactWrap.append(interactDefaultInputTextarea);
            chatInteract.append(interactWrap);

            chatBody.append(chatInteract);
            $("#focus-body").append(chatBody);
            $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);
        };
        if (focusTarget.type === "createChannel") {

            // Build the header and push to page

            let headerInfo = $("<div class='focus-header-info'>");
            let headerName = $("<h6 class='focus-header-name'>");
            let channelPrivacy = $("<i class='material-icons focus-header-icon'>");

            headerName.text("Create A New Channel");
            headerInfo.append(headerName);
            $("#focus-header").append(headerInfo);

            // Build the form to add the channel


            let createChannelHTML = 
            "<div><br>"+
            "<i id ='createChannel-private' class='material-icons'>lock_outline</i>" +
            "<i id ='createChannel-public' class='material-icons'>public</i><br>" +
            "<b>Privacy</b>" +
            "</div><br>" +
            "<div class='focus-body-content'>" +
            "<b>Channel Name</b><br>" +
            "<input id='createChannel-name'><br>" +
            "<b>Add Members</b><br>" +
            "<input id='createChannel-members'><br>" +
            "<div>" +
            "<span>Members added</span><br>" +
            "</div>" +
            "<br>" +
            "<button id='createChannel-submit'>Create Channel</button>" +
            "</div>";

            $("#focus-body").html(createChannelHTML);
        }
    },

    // Build user board
    board: function () {

        //Board header
        let userInfo = $("<div>");
        let userBoardIcon = $("<i class='material-icons'>");
        let userBoardName = $("<span>")
        let userBoardUsername = $("<span>");
        let userBoardSettings = $("<i class='material-icons'>");

        userBoardIcon;
        userBoardName.text(data.user.fullname);
        userBoardUsername.text(data.user.username);
        userBoardSettings.text("settings_applications");

        userInfo.append(userBoardName);
        userInfo.append($("<br>"));
        userInfo.append(userBoardUsername);
        userInfo.append(userBoardSettings);

        $(".board-header-content").append(userInfo);

    }
}

let interact = {

    init: function () {
        if (!interact.set.listener.occured) {
            interact.set.listener.onStartup();
        }
    },

    set: {
        listener: {
            occured: false,
            onStartup: function () {
                interact.set.listener.sidebar();
                interact.set.listener.focus();
                interact.set.listener.board();
                interact.set.listener.occured = true;
            },
            sidebar: function () {
                $("#add-channel").on("click", interact.handle.addChannel)
                $(".interact-sidebar-channel").on("click", interact.handle.changeChannel);
                $(".interact-sidebar-contact").on("click", interact.handle.changeChannel);
            },
            focus: function ( ) {
                // Chat-specific
                if(activeFocus.type === "chat"){
                }
            },
            board: function ( ) { },
            
        }
    },

    handle: {
        changeChannel: function (event) {
            let viewSelector = event.currentTarget.innerText;
            let viewType = "chat";
            buildView.focus({ selector: viewSelector, type: viewType });
        },
        addChannel: function(event){
            buildView.focus({ selector: "", type : "createChannel" });
        }

    }
}

$(document).ready(function () {
    buildView.init();
});