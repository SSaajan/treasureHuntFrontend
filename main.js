const htmlClasses = [  
                    document.querySelector(".initial1"), 
                    document.querySelector(".initial2"), 
                    document.querySelector(".initial3"),
                    document.querySelector(".initial4"),
                    document.querySelector(".initial5"),
                    document.querySelector(".initial6"), 
                    document.querySelector(".cursor"), 
                    document.querySelector(".typedWelcome")
                    ];       

const submitForm = document.getElementById("submitForm");
const words = ["/////", "> Initializing services", "> [success]", "> Commencing communication with services", ">> ## DSP | ADAP | CASB ##", ">> Instance ID #2112", "welcome..."];
const typeSpeed = [0, 50, 200, 400];
let loaderCounter = 0, wordIndex = 0, charIndex = 0, htmlIndex = 0, speedIndex = 2;

function loadType() {
    if(charIndex < words[wordIndex].length) {
        htmlClasses[htmlIndex].textContent += words[wordIndex].charAt(charIndex);
        charIndex++;
        setTimeout(loadType, typeSpeed[speedIndex]);
    }
    else {
        eraseLoader();
    }
}

function eraseLoader() {
    htmlClasses[htmlIndex].textContent = "";
    loaderCounter++;
    charIndex = 0;
    if(loaderCounter < 3) {
        loadType();
    }  
    else {
        wordIndex++;
        htmlIndex++;
        speedIndex = 0;
        type();
    }
}

function type() {
    if(wordIndex == 6) {
        if(charIndex >= 6) {
            speedIndex = 3;
        }
        else {
            speedIndex = 1;
        }
    }
    if(wordIndex == words.length) {
        document.querySelector(".cursor").textContent = "";
        document.querySelector(".typedWelcome").textContent = "";
        document.getElementById("tree").style.visibility = "visible";
        document.getElementById("snowflake").style.visibility = "visible";
        document.getElementById("teamIDForm").style.visibility = "visible";
    }
    else {
        if(charIndex < words[wordIndex].length) {
            htmlClasses[htmlIndex].textContent += words[wordIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typeSpeed[speedIndex]);
        }
        else {
            nextWord();
        }
    }
}

function nextWord() {
    charIndex = 0;
    wordIndex++;
    htmlIndex++;
    if(wordIndex == 6) {
        htmlClasses[htmlIndex].textContent += "|";
        htmlIndex++;
        setTimeout(type, 2000);
    }
    else {
        setTimeout(type, 500);
    }
}

function hideTeamID() {
    document.getElementById("teamIDLabel").style.visibility = "hidden";
    document.getElementById("teamID").style.visibility = "hidden";
    document.getElementById("teamIDSubmit").style.visibility = "hidden";
    document.getElementById("passphraseLabel").style.visibility = "visible";
    document.getElementById("passphrase").style.visibility = "visible";
    document.getElementById("key").style.visibility = "visible";
    document.getElementById("keyLabel").style.visibility = "visible";
    document.getElementById("passphraseSubmit").style.visibility = "visible";
}

function sendData() {
    const XHR = new XMLHttpRequest();
    
    let teamID = document.getElementById("teamID").value;
    let passphrase = document.getElementById("passphrase").value;
    let key = document.getElementById("key").value;
    let data = new Object();
    data.teamID = teamID;
    data.passphrase = passphrase;
    data.key = key;
    data = JSON.stringify(data);

    XHR.addEventListener("load", (event) => {
        document.getElementById("passphraseLabel").style.visibility = "hidden";
        document.getElementById("passphrase").style.visibility = "hidden";
        document.getElementById("key").style.visibility = "hidden";
        document.getElementById("keyLabel").style.visibility = "hidden";
        document.getElementById("passphraseSubmit").style.visibility = "hidden";
        document.getElementById("success").style.visibility = "visible";

        let result = JSON.parse(event.target.responseText);

        if(result.Status) {
            if(result.Status == "Failed") {
                document.getElementById("mainMsg").textContent = "Decryption failed";  
                document.getElementById("mainMsg").style.color = "#ff2626";
                document.getElementById("subText").textContent = "Your encryption text/decryption key is invalid.";
                document.getElementById("subText2").style.visibility = "hidden";
                document.getElementById("subTextWon").style.visibility = "hidden";
                alertColour();
                
                document.getElementById("retry").style.visibility = "visible";
            }
            else {
                document.getElementById("mainMsg").textContent = "ACCESS DENIED";
                document.getElementById("mainMsg").style.color = "#ff2626";
                document.getElementById("subText").textContent = "Only one submission per team is allowed.";
                document.getElementById("subText2").style.visibility = "hidden";
                document.getElementById("subTextWon").style.visibility = "hidden";
                alertColour();
            }
        }
        else {
            if(result.place && result.place == 1) {
                document.getElementById("subTextWon").textContent = "FIRST PLACE!";
            }
            else if(result.place && result.place == 2) {
                document.getElementById("subTextWon").textContent = "SECOND PLACE!";
            }
            else if(result.place && result.place == 3) {
                document.getElementById("subTextWon").textContent = "THIRD PLACE!";
            }
            else if(result.place && result.place > 3) {
                document.getElementById("mainMsg").textContent = "Decryption Successful, but you're too late."; 
                document.getElementById("subText").textContent = "3 teams have already claimed the prize :(";
                document.getElementById("subText2").style.visibility = "hidden";
                document.getElementById("subTextWon").style.visibility = "hidden";
            }   
        }
    });
  
    // Define what happens in case of error
    XHR.addEventListener("error", (event) => {
        alertColour();
        alert("API Error. Please contact event incharges - Saajan / Devnath / Dhanabal / Rajkumar");
    });

    // Set up our request
    XHR.open("POST", "https://stellular-bombolone-ba80b2.netlify.app/.netlify/functions/api");
    XHR.setRequestHeader("Accept", "application/json");
    XHR.setRequestHeader("Content-Type", "application/json");

    // The data sent is what the user provided in the form
    XHR.send(data);
}

function alertColour() {
    document.getElementById("treeInner").style.color = "#ff2626";
    document.getElementById("star").style.color = "#ff2626";
    document.getElementById("snowflake").style.color = "#ff2626";
    document.getElementById("treeInner").style.color = "#ff2626";
    document.getElementById("tree").style.color = "#ff2626";
    document.getElementById("snowflake").style.color = "#ff2626";
    document.getElementById("initialTexts").style.color = "#ff2626";
    document.getElementById("container").style.color = "#ff2626";
    document.getElementById("footerText").style.color = "#ff2626";
    document.getElementById("star").style.animation = "none";
    document.getElementById("tree").style.animation = "none";
    document.getElementById("snowflake").style.animation = "none";
}

document.addEventListener("DOMContentLoaded", function() {
    loadType();
});

submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendData();
});
