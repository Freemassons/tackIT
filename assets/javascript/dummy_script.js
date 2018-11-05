
// Everything in this data object will be content served to the page by
// our database system.. Obviously this structure can be easily changed
var data = {
    user:
    {
        username: "zrheaume",
        email: "zachary.a.rheaume@gmail.com",
        channels: ["Open_Chat", "Design101", "Project_1_Group", "Test_Group", "PenTellers", "freeMasons", "soxTalk", "whoDunnit", "Playing_Clue"],
        contacts: ["jameson247", "rodneyBigHorn", "jFitzgerald", "unknowChalupa", "simpleSeerup", "stevePearceHitsBombs", "whosAskin22"],
        extensions: ["giphy", "Google Maps API", "GeocodeAPI", "WhetherAPI"],
        board: {

        },
        settings: {
            default_channel: "Open_Chat",
        },
    },
    channels:
        [
            {
                name: "Open_Chat",
                id: "some sort of unique ID besides name",
                public: true,
                members: ["jameson247", "rodneyBigHorn", "jFitzgerald", "unknowChalupa", "simpleSeerup", "stevePearceHitsBombs", "whosAskin22"],
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
                    { type: "text", sender: "unknowChalupa", timestamp: "11/03/18 09:40", content: { text: "Nam efficitur lacinia ex nec pharetra. Praesent efficitur magna urna, vitae luctus eros tempus at. Class aptent." } },
                    { type: "text", sender: "zrheaume", timestamp: "11/03/18 09:43", content: { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fermentum nec mauris sed mattis. Donec quis est lectus. Nulla quis malesuada eros. Aliquam sollicitudin, lectus quis venenatis tempus, est sem dignissim enim, imperdiet venenatis justo eros sit amet metus. Phasellus mollis diam eu nisl elementum luctus. Curabitur varius molestie vehicula. Sed ut pulvinar ipsum. Phasellus mollis lectus id purus accumsan porttitor. Mauris convallis dictum eros, a tempor ligula vestibulum sed. Sed suscipit ut risus at." } },
                    { type: "text", sender: "rodneyBigHorn", timestamp: "11/03/18 09:46", content: { text: "...", url: "https://media1.giphy.com/media/11R5KYi6ZdP8Z2/giphy.gif" } },
                    { type: "text", sender: "jFitzgerald", timestamp: "11/03/18 12:12", content: { text: "Nam efficitur lacinia ex nec pharetra. Praesent efficitur magna urna" } },
                    { type: "text", sender: "rodneyBigHorn", timestamp: "11/03/18 13:33", content: { text: "Lorem ipsum dolor sit amet." } },
                    { type: "text", sender: "unknowChalupa", timestamp: "11/03/18 13:35", content: { text: "Nam efficitur lacinia ex nec pharetra. Praesent efficitur magna urna, vitae luctus eros tempus at. Class aptent." } },
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
            },
            {
                name: "Project_1_Group",
                id: "some sort of unique ID besides name",
                public: true,
                members: ["jFitzgerald", "unknowChalupa", "simpleSeerup", "whosAskin22"],
            },

        ],
    extensions:
        [
            {
                name: "giphy",
                enabled: true,
                features:{
                    search : 'pointer to our hosted API call method'
                } 
            },
            { name: "Google Maps API", enabled: false },
            { name: "GeocodeAPI", enabled: false },
            { name: "WeatherAPI" }
        ]
};

// 
let currentFocus = {
    selector: data.user.settings.default_channel,
    type: "chat",
};

var buildView = {

    // Initializer calls build methods for each section
    init: function () {
        buildView.sidebar();
        buildView.focus(currentFocus);
    },

    // Build sidebar
    sidebar: function () {
        let populate = function (arr, dest, icon) {
            for (a = 0; a < arr.length; a++) {
                let line = $("<div class='sidebar-line'>")
                let itemDiv = $("<div class='sidebar-item'>");
                let sidebarElem = $("<span class='sidebar-item-text'>");
                let iconElem = $("<i class='material-icons sidebar-icon teal-text text-lighten-3'>");
                let iconDiv = $("<div>")
                iconElem.text(icon);
                iconDiv.html(iconElem);

                sidebarElem.text(arr[a]);
                itemDiv.html(sidebarElem);

                line.append(itemDiv);
                // line.append(iconDiv);
                $("#" + dest).append(line);
            }
        }
        populate(data.user.channels, "sidebar-channels-list", "settings");
        populate(data.user.contacts, "sidebar-contacts-list", "message");
        populate(data.user.extensions, "sidebar-extensions-list");
    },

    focus: function (activeFocus) {
        let focusData = {};
        // Check to see what type we're working with here
        //
        if (activeFocus.type === "chat") {

            for (f = 0; f < data.channels.length; f++) {
                if (data.channels[f].name === activeFocus.selector) {
                    focusData = data.channels[f];
                };
            };
            //Step 2 - Build chat header

            let channelInfo = $("<div class='focus-header-info'>");
            let channelName = $("<h6 class='focus-header-name'>");
            let channelPrivacy = $("<i class='material-icons focus-header-icon'>");
            let channelMembers = $("<span class='focus-header-members'>");

            channelName.text(focusData.name);
            channelMembers.text(focusData.members.length);

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
            chatBody.append(chatLog);
            // Messages in the channel's chat log have been populated to the chat body.
            // Now the chat input needs to be built in

            let interactWrap = $("<div id='interact-wrapper'>");
            let interactToolbar = $("<div id='interact-tools'>");
            let interactDefaultInput = $("<input id='interact-input-text'>");

            interactWrap.append(interactToolbar);
            interactWrap.append(interactDefaultInput);
            chatInteract.append(interactWrap);

            chatBody.append(chatInteract);
            $("#focus-body").append(chatBody);
            $('#chat-log').scrollTop($('#chat-log')[0].scrollHeight);
        }
    },

    board: function () {
    }
}
$(document).ready(function () {
    buildView.init();
});