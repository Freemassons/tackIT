let promptTypes = {
    WELCOME: 1,
    MAIN_MENU: 2,
    CREATE_ACCOUNT_FOR_ME: 3,
    CREATE_ACCOUNT_FOR_SOMEONE_ELSE: 4,
    CREATE_ORGANIZATION: 5,
    ADD_USER_TO_ORG: 6,
    CREATE_REPO: 7,
    CREATE_ISSUE: 8,
    INVALID_ENTRY: 9,
};

let chatbotName = "Tacki";
let defaultChatResponse = "Still Processing...Please wait a few seconds then say <b>continue</b> to see if I'm done processing. Sorry for the hold up!"
let displayText = defaultChatResponse;

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
                if(data.command == "createUser"){
                    chatbot.gitHubAccountExists = false;
                }
                else if(data.command === "createOrg"){
                    console.log("createOrg success");
                    chatbot.gitHubOrgExists = false;
                }
                else if(data.command === "addMember"){
                    chatbot.gitHubMemberOfOrg = false;
                }
                else if(data.command === "createRep"){
                   chatbot.getRepoExists = false; 
                }
                chatbot.currentPrompt.invokeCallback(result.htmlDisplayMessage);
            },
            error: function(result){
                console.log("error", result);
                if(data.command === "createUser"){
                    chatbot.gitHubAccountExists = true;
                }
                else if(data.command === "createOrg"){
                    if(result.responseJSON.message === "Not Found"){
                        chatbot.gitHubOrgExists = false;
                    }
                    else{
                        chatbot.gitHubOrgExists = true;
                    }
                }
                else if(data.command === "addMember"){
                    if(result.responseJSON.message === "Not Found"){
                        chatbot.gitHubMemberOfOrg = false;
                    }
                    else{
                        chatbot.gitHubMemberOfOrg = true;
                    }
                }
                chatbot.currentPrompt.invokeCallback(result.responseText);
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
    targetUser : "",
    targetEmail: "",
    targetTeam: "",
    targetAvatar: "",
    currentPrompt: "",
    prompts: [
        {
            name: promptTypes.WELCOME,
            requiresSetupTask: false,
            getQuestion: function(){
                let question = "Hi " + account.userName + ",<br/><br/> I'm " + chatbotName + ", your personal guide " +
                "through the team setup process.  If you would like help in expediting your team's development needs, type <b>help</>.";
                if(displayText != defaultChatResponse){
                    question = displayText + question;
                }
                return question;
            },
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
            requiresSetupTask: false,
            getQuestion: function(){
                let question = "Are you looking to get yourself setup, or someone else?  If this is for you, " +
                "say <b>me</b>.  If this is to get someone else setup, say <b>someone else</b>. If you don't " +
                "need setup help, but would like to create a GitHub issue, say <b>create issue<b/>";
                if(displayText != defaultChatResponse){
                    question = displayText + question;
                }
                return question;
            },
            action: function(userInput){
                if (userInput === "me"){
                    chatbot.targetUser = account.userName;
                    chatbot.targetEmail = account.email;
                    chatbot.targetAvatar = account.avatar;
                    chatbot.targetTeam = account.team;
                    chatbot.setCurrentPrompt(promptTypes.CREATE_ACCOUNT_FOR_ME);
                }
                else if(userInput === "someone else"){
                    chatbot.setCurrentPrompt(promptTypes.CREATE_ACCOUNT_FOR_SOMEONE_ELSE);
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
            name: promptTypes.CREATE_ACCOUNT_FOR_ME,
            requiresSetupTask: true,
            getQuestion: function(){
                let question = "I'm in the process of pulling up your account information to make this as " +
                    "seamless as possible. Say <b>continue</b> to check on my process.";
                if(displayText != defaultChatResponse){
                    question = displayText + question;
                }
                return question;
            },
            action: function(userInput){
                if(userInput === "continue"){
                    if(displayText !== defaultChatResponse){
                        chatbot.setCurrentPrompt(promptTypes.CREATE_ORGANIZATION);
                    }
                    else{
                        chatbot.populateText(displayText, chatbotName);
                    }
                }
            },
            invokeSetupTask: function(){
                // creates a user account
                let username = chatbot.targetUser;
                let team = chatbot.targetTeam;
                let email = chatbot.targetEmail;
                let avatar = chatbot.targetAvatar;

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
            },
            invokeCallback: function(results){
                if(!chatbot.gitHubAccountExists){
                    let prefixText = "<br/><br/>I noticed you did not have a GitHub account, so I took the liberty of " +
                        "creating one for you. <br/><br/>"
                    displayText = prefixText + results;
                }
                else if(chatbot.gitHubAccountExists) {
                    let message = "Wow, you're one step ahead of me. I noticed that " + chatbot.targetUser + 
                        " already has a GitHub account.  Let's keep moving so that you can start coding right away.";
                    displayText = message;
                }
                else{
                    chatbot.setCurrentPrompt(promptTypes.INVALID_ENTRY);
                }
            }
        },
        {
            name: promptTypes.CREATE_ORGANIZATION,
            requiresSetupTask: true,
            getQuestion: function(){
                let question = "<br/><br/>I'm now checking to see if your team has a GitHub organization created..." +
                    "<br/><br/>Say <b>'create org'</b> when you're ready to continue the setup process.";

                if(displayText != defaultChatResponse){
                    question = displayText + question;
                }
                return question;
            },
            action: function(userInput){
                if(userInput === "create org"){ 
                    if(displayText !== defaultChatResponse){
                        chatbot.setCurrentPrompt(promptTypes.ADD_USER_TO_ORG);
                    }
                    else{
                        chatbot.populateText(chatbot.displayText, chatbotName);
                    }
                }
            },
            invokeSetupTask: function(){
                let orgName = chatbot.targetTeam;
    
                let parameters = {
                    orgDisplayName: orgName,
                    orgName: orgName,
                }
                let data = {
                    command: "createOrg",
                    parameters: parameters
                }
                apiGateway.callCloudFunctions(data, "callGitHub");
            },
            invokeCallback: function(results){
                if(!chatbot.gitHubOrgExists){
                    let prefixText = "It couldn't find a GitHub organization for your team, so I created one!<br/><br/>"
                    displayText = prefixText + results;
                }
                else if(chatbot.gitHubOrgExists) {
                    displayText = "It looks like your team already has the " + chatbot.targetTeam + 
                        " GitHub organization created! <br/><br/>"
                }
                else{
                    chatbot.setCurrentPrompt(promptTypes.INVALID_ENTRY);
                }
            }
        },
        {
            name: promptTypes.ADD_USER_TO_ORG,
            requiresSetupTask: true,
            getQuestion: function(){
                let question = "<br/><br/>In the meantime, I will try to associate " + chatbot.targetUser + 
                " to this GitHub organization.<br/><br/> Say <b>yes</b> if you would like me to do this.";
                if(displayText != defaultChatResponse){
                    question = displayText + question;
                }
                return question;
            },
            action: function(userInput){
                if(userInput === "yes"){ 
                    if(displayText !== defaultChatResponse){
                        chatbot.setCurrentPrompt(promptTypes.CREATE_REPO);
                    }
                    else{
                        chatbot.populateText(chatbot.displayText, chatbotName);
                    }
                }
            },
            invokeSetupTask: function(){
                let username = chatbot.targetUser;
                let orgName = chatbot.targetTeam;

                let parameters = {
                    username: username,
                    orgName: orgName,
                    role: "admin"
                }
                let data = {
                    command: "addMember",
                    parameters: parameters
                }
                apiGateway.callCloudFunctions(data, "callGitHub");
            },
            invokeCallback: function(results){
                if(!chatbot.gitHubMemberOfOrg){
                    let prefixText = "I noticed " + chatbot.targetUser + " was not associated to the " 
                    + chatbot.targetTeam + " so I took the liberty of doing it for you. <br/><br/>"
                    displayText = prefixText + results;
                }
                else if(chatbot.gitHubMemberOfOrg) {
                    let message = "Wow, you're one step ahead of me again. I noticed that " + chatbot.targetUser + 
                        " is already associated to the " + chatbot.targetTeam + " GitHub organization.";

                    let suffixText = "<br/><br/>Say <b>continue</b> to move onto the final step."
                    displayText = message + suffixText;
                }
                else{
                    chatbot.setCurrentPrompt(promptTypes.INVALID_ENTRY);
                }
            }
        },
        {
            name: promptTypes.CREATE_REPO,
            requiresSetupTask: false,
            getQuestion: function(){
                let question = "<br/><br/> You are almost setup, just one last question! In order for you to " +
                    "start developing, you will need a code repository. What do you want your code repository to " +
                    "be called?  Please make sure there are no spaces in the repository name!";
                if(displayText != defaultChatResponse){
                    question = displayText + question;
                }
                return question;
            },
            action: function(userInput){
                let orgName = chatbot.targetTeam;

                let parameters = {
                    orgName: orgName,
                    repoName: userInput
                }
                let data = {
                    command: "createRepo",
                    parameters: parameters
                }
                apiGateway.callCloudFunctions(data, "callGitHub");
            },
            invokeCallback: function(results){
                if(!chatbot.gitHubMemberOfOrg){
                    let prefixText = "Your setup is now complete!<br/><br/>"
                    displayText = prefixText + results;
                    chatbot.populateText(displayText, chatbotName);
                }
                else if(chatbot.gitHubMemberOfOrg) {
                    let message = "Wow, you're one step ahead of me again. I noticed that " + chatbot.targetUser + 
                        " is already associated to the " + chatbot.targetTeam + " GitHub organization.";

                    let suffixText = "<br/><br/>Say <b>continue</b> to move onto the final step."
                    displayText = message + suffixText;
                }
                else{
                    chatbot.setCurrentPrompt(promptTypes.INVALID_ENTRY);
                }
            }
        }
    ],
    setCurrentPrompt: function(promptName){
        for(let index in chatbot.prompts){
            let currentPrompt = chatbot.prompts[index];
            if(currentPrompt.name === promptName){
                chatbot.currentPrompt = currentPrompt;
                if(chatbot.currentPrompt.requiresSetupTask){
                    chatbot.currentPrompt.invokeSetupTask();
                }
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
            chatbot.populateText(chatbot.currentPrompt.getQuestion(), chatbotName);
        }
        triggerAnimation();
    });

    $(chatbot.classModalInputSelector).keypress(function(e) {
        if (e.which === 13 && $("#chat-input").val() !== "") {
            let userInput = $(chatbot.classModalInputSelector).val();
            chatbot.populateText(userInput, account.userName);

            $(chatbot.classModalInputSelector).val("");
            chatbot.currentPrompt.action(userInput);
            chatbot.populateText(chatbot.currentPrompt.getQuestion(), chatbotName);
        }
      });
});