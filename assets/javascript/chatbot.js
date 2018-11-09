let promptTypes = {
    WELCOME: 1,
    MAIN_MENU: 2,
    ME: 3,
    SOMEONE_ELSE: 4,
    CREATE_ISSUE: 5,
    INVALID_ENTRY: 6,
    USER_EXISTS: 7,
    USER_DOES_NOT_EXIST: 8,
};

let chatbotName = "Tacki";

let apiGateway = {
    callCloudFunctions: function(data, functionName){
        let cloudFunctionUrl = "https://us-central1-tackit-86cc7.cloudfunctions.net/" + functionName;
        $.ajax({
            type: "POST",
            url: cloudFunctionUrl,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(data),
            dataType: "json",
            success: function(result) {
                console.log("success", result);
                chatbot.gitHubAccountExists = false;
                chatbot.currentPrompt.action(result.htmlDisplayMessage);
            },
            error: function(result){
                console.log("error", result);
                chatbot.gitHubAccountExists = true;
                chatbot.currentPrompt.action(promptTypes.USER_EXISTS);
            },
            onFailure: function(result){
                console.log("onFailure", result);
            }
        });
    },
}

let chatbot = {
    classCircleSelector: '.circle',
    classIconSelector: '.icon-elements',
    classModalSelector: '.modal-wrapper',
    classIconActive: 'js-icon-active',
    classModalActive: 'js-modal-active',
    classModalInputSelector: ".modal-input",
    classModalHeaderSelector: ".modal-header",
    currentPrompt: "",
    prompts: [
        {
            name: promptTypes.WELCOME,
            researchTask: false,
            question: "Hi, <br/><br/> I'm " + chatbotName + ", your personal guide through the team setup process.  " +
                "If you would like help in expediting your team's development needs, type 'help'.",
            action: function(userInput){
                if(userInput === "help"){
                    chatbot.setCurrentPrompt(promptTypes.MAIN_MENU);
                }
                else{
                    chatbot.setCurrentPrompt(promptTypes.WELCOME);
                }
            }
        },
        {
            name: promptTypes.MAIN_MENU,
            researchTask: false,
            question: "Are you looking to get yourself setup, or someone else?  If this is for you, " +
                "say 'me'.  If this is to get someone else setup, say 'someone else'. If you don't " +
                "need setup help, but would like to create a GitHub issue, say 'create issue'",
            action: function(userInput){
                if (userInput === "me"){
                    chatbot.setCurrentPrompt(promptTypes.ME);
                }
                else if(userInput === "somone else"){
                    chatbot.setCurrentPrompt(promptTypes.SOMEONE_ELSE);
                }
                else if(userInput === "create issue"){
                    chatbot.setCurrentPrompt(promptTypes.CREATE_ISSUE);
                }
                else{
                    chatbot.setCurrentPrompt(promptTypes.INVALID_ENTRY);
                }
            }
        },
        {
            name: promptTypes.ME,
            researchTask: true,
            question: "I'd love to help you get up and running as quickly as possible! Let me check on " +
                "something before we start...",
            action: function(userInput){
                if(chatbot.gitHubAccountExists){
                    chatbot.populateText(userInput, chatbotName);
                }
                else if(!chatbot.gitHubAccountExists) {
                    chatbot.populateText(userInput, chatbotName);
                }
                else{
                    chatbot.setCurrentPrompt(promptTypes.INVALID_ENTRY);
                }
            },
            performResearchTask: function(){
                // look to see if the user has a GitHub account
                let username = account.userName;
                let team = account.team;
                let email = account.email;

                let parameters = {
                    username: username,
                    orgName: team,
                    email: email
                }
                let data = {
                    command: "createUser",
                    parameters: parameters
                }
                apiGateway.callCloudFunctions(data, "callGitHub");
            }
        },
    ],
    setCurrentPrompt: function(promptName){
        for(let index in chatbot.prompts){
            let currentPrompt = chatbot.prompts[index];
            if(currentPrompt.name === promptName){
                chatbot.currentPrompt = currentPrompt;
                break;
            }
        }
    },
    populateText: function(message, name){
        let textElement = $("<p>", {
            class: "margin-s1",
            html: name + ": " + message
        })
        $(chatbot.classModalHeaderSelector).append(textElement);
    }
}

$(document).ready(function () {

    let triggerAnimation = function() {
        const isActive = $(chatbot.classIconSelector).hasClass(chatbot.classIconActive);
        if(isActive){
            $(chatbot.classIconSelector).removeClass(chatbot.classIconActive);
            $(chatbot.classModalSelector).removeClass(chatbot.classModalActive);
        }
        else{
            $(chatbot.classModalSelector).addClass(chatbot.classModalActive);
            $(chatbot.classIconSelector).addClass(chatbot.classIconActive);
        }
    }

    $(chatbot.classCircleSelector).on("click", function (){
        let chatAreaDiv = $(chatbot.classModalHeaderSelector);

        // if there has been no previous correspondence, we need the chatbot to respond with welcome text
        if(chatAreaDiv.contents().length == 1){
            chatbot.setCurrentPrompt(promptTypes.WELCOME);
            chatbot.populateText(chatbot.currentPrompt.question, chatbotName);
        }
        triggerAnimation();
    });

    $(chatbot.classModalInputSelector).keypress(function(e) {
        if (e.which === 13 && $("#chat-input").val() !== "") {
            let userInput = $(chatbot.classModalInputSelector).val();
            chatbot.populateText(userInput, account.userName);

            $(chatbot.classModalInputSelector).val("");
            chatbot.currentPrompt.action(userInput);

            chatbot.populateText(chatbot.currentPrompt.question, chatbotName);
            if(chatbot.currentPrompt.researchTask){
                chatbot.currentPrompt.performResearchTask();
                //disable chatbot until research task is complete
            }
        }
      });
});