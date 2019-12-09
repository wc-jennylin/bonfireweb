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
        let congrats = createP("Welcome to Bonfire!" + "<br>" + "Please wait for the countdown on the big screen to begin...");
        congrats.addClass("center");
        // congrats.addClass("fade-out");
    });

    // Open chatroom
    connection.on("start", function(){
        input = createInput('');
        input.id('input');
        input.attribute('placeholder','Type to find who you are talking to ;)');
        // let welcome = createDiv('');
        // welcome.addClass('transbox');
        let welcomeMessage = createP("Try to find all other people in this chatroom" + "<br>" + "then sit your group at a flower.");
        welcomeMessage.addClass('prompt');
        // welcome.child('welcomeMessage');
        start = second();
    });

    function draw(){
        If (start != undefined){
            const now = second();
            const time = now - start;
            if (time > 30){
                createP('Tips: (at most 5 people in a chatroom)' + '<br>' +
                '1)	Count off' + '<br>' +
                '2)	Everyone raise a hand/does jumping jacks' + '<br>' + 
                '3)	Gather at a specific location' + '<br>' +
                '4)	What colors everyone is wearing' + '<br>' +
                'Get Creative!').addClass('prompt');
            }
        }
            
    }

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

// Listen for line breaks to clear input field
function keyPressed() {
    if (keyCode == ENTER) {
        connection.send("create-text", input.value());
        input.value("");
        // console.log("message send");
    }
}
