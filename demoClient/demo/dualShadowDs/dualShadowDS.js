// Init
var clientText = "", shadowCopy = "";
var dmp = new diff_match_patch();
var typingTimer;                //timer identifier
var keyPressed = false;
var sessionId = "";

// Visual
let textarea = document.getElementById("textarea");
let div = document.getElementById("div");
let title = document.getElementById("documentTitle");
textarea.hidden = true;
div.hidden = false;
div.contentEditable = "true";

// Event handlers
div.oninput = (e) => {
    textarea.value = div.innerHTML;
};
//on keyup, start the countdown
div.onkeyup = (e) => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(updateDocument, config.doneTypingInterval);
};
//on keydown, clear the countdown 
div.onkeydown = (e) => {
    clearTimeout(typingTimer);
    keyPressed = true;
};
setInterval(checkOnIdle, config.idleSyncInterval);

function checkOnIdle (){
    customLog("CheckOnIdle");
    if (keyPressed)
    {
        keyPressed = false;
        return;
    }
    updateDocument();
}

//user is "finished typing," do something
function updateDocument () {
    customLog("UpdateDocument event handling\n" + textarea.value, );
    clientText = textarea.value;
    getUpdatedClientText(clientText);
}

// Session & document init from server
fetch("/api/session").then(function(sessionResponse) {
    return sessionResponse.json();
}).then(function(sessionData) {
    sessionId = sessionData.id;
    return sessionData.id;
}).then(function(id){
    getDocument(id);
});

function getDocument(sessionId){
    const requestBody = { sessionId : sessionId };
    fetch("/api/document", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body : JSON.stringify(requestBody),
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        title.innerHTML = data.title;
        div.innerHTML = data.content;
        textarea.value = data.content;
        shadowCopy = data.content;
        clientText = data.content;
    }).catch(function(ex) {
        customLog("Error fetching /api/document\n" + ex, level.error);
    });
}



function getUpdatedClientText(source){
    // On client
    let diff = dmp.diff_main(shadowCopy, source, true);

    if (diff.length > 2) {
        dmp.diff_cleanupSemantic(diff);
    }
    const patch_list = dmp.patch_make(shadowCopy, source, diff);
    
    shadowCopy = source;
    
    const patch_text = dmp.patch_toText(patch_list);
    const requestBody = { patchText : patch_text, sessionId : sessionId };
    customLog("Patch to server:\n" + patch_text, );

    // Document init from server
    fetch("/api/document/save", 
        { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        })
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        customLog("Patch to client:\n" + data.patches);
        const patches = dmp.patch_fromText(data.patches);

        const shadowCopyResults = dmp.patch_apply(patches, shadowCopy);
        shadowCopy = shadowCopyResults[0];
        customLog("Shadow copy after patch apply:\n" + shadowCopy);

        const clientTextResults = dmp.patch_apply(patches, clientText);
        
        if (clientText !== clientTextResults[0])
        {
            clientText = clientTextResults[0];
            customLog("Client text after patch apply:\n" + clientText);
            div.innerHTML = clientText;
            textarea.value = clientText;
        }
    }).catch(function(ex) {
        customLog("Error fetching /api/document/save\n" + ex, level.error);
    });
}