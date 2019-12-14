////////////////////////////////////////
// CONNECTION
////////////////////////////////////////

const connection = new Connection(
    "Bonfire",
    "player",
    "https://www.bigscreens.live"
);

connection.onConnect(() => {
    console.log("CONNECTED");
});

connection.onDisconnect(() => {
    console.log("DISCONNECTED");
});

connection.onError(err => {
    console.error("CONNECTION ERROR:", err);
});

// Input field
let input;
let start;
let timeToTip = true;
let timeToRemind = false;

function setup() {
    noCanvas();
    // List is full
    connection.on("list-is-full", function(){
        let sorry = createP("Sorry, only 50 people can play..." + "<br>" + "Join sooner next time!");
        sorry.addClass("center");
        // sorry.addClass("load");
        connection.close();
    });

    // Onboarding
    connection.on("you-got-in", function(){
        let congrats = createP("Welcome to Bonfire!" + "<br>" + "Counting down on the big screen to enter your chatroom...");
        congrats.addClass("center");
        // congrats.addClass("fade-out");
    });

    // Open chatroom
    connection.on("start", function(){
        input = createInput('');
        input.id('input');
        input.attribute('placeholder','Type to find your group...');
        // let welcome = createDiv('');
        // welcome.addClass('transbox');
        let welcomeMessage = createP("Try to find all other people in this chatroom" + "<br>" + "then sit your group at a flower.");
        welcomeMessage = welcomeMessage.addClass('prompt');
        // welcomeMessage = welcomeMessage.addClass('fade-out');
        // welcome.child('welcomeMessage');
        start = second();
    });

    // Listen for texts from partners
    connection.on("text", function(sender, identification, text) {
        let id = identification;
        let txt = text;
        let p;
        try {
            p = select("#" + id).html(txt);
            p.elt.className = "";
            if (p.timeout) clearTimeout(p.timeout);
            p.timeout = setTimeout(() => p.addClass("fade-out"), 100);
            console.log("same" + id);
        } catch {
            // Otherwise craete a new on
            p = createP(txt).id(id);
            p.addClass("fade-out");
            console.log(id);
        }
    });

    // Remove disconnected users
    // Display "User left" message
    connection.on("leave room", function() {
        createP("(someone left...)").addClass("fade-out");
    });
}

function draw(){
    if (start != -1){
        let now = second();
        let time = abs(now - start);
        if (time > 30 && timeToTip){
            let tips = createP('Hint: At most 5 people in a chatroom' + '<br>' +
            'You all could ... to find each other faster ;)' + '<br>' +
            '1)	Count off' + '<br>' +
            '2)	Everyone raises a hand/does jumping jacks' + '<br>' + 
            '3)	Gather at a specific location' + '<br>' +
            '4)	Ask what colors everyone is wearing' + '<br>' +
            'Get C.R.E.A.T.I.V.E!').addClass('tips');
            // tips.addClass('fade-out');
            start = now;
            timeToTip = false;
        } else if (time > 30 && timeToTip == false){
            start = now;
            timeToRemind = true;
            if (time > 30 && timeToRemind){
            let reminder = createP("Gather everyone at a flower that hasn't been claimed" + "<br>" + "& everyone sends the code on the flower to the chatroom").addClass('tips');
            start = -1;
            timeToRemind = false;
            }   
        }
        console.log(start, now, time);   
    }
}

// Listen for line breaks to clear input field
function keyPressed() {
    if (keyCode == ENTER) {
        connection.send("create-text", input.value());
        input.value("");
        // console.log("message send");
    }
}
