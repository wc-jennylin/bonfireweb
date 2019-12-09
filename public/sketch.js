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
        input.attribute('placeholder','Find who you are talking to ;)');
        let welcome = createDiv('Try to find at most 4 other people in this chatroom" + "<br>" + "then sit your group at a flower');
        welcome.addClass('transbox');
        // let welcome = createP("Try to find at most 4 other people in this chatroom" + "<br>" + "then sit your group at a flower");
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

// Listen for line breaks to clear input field
function keyPressed() {
    if (keyCode == ENTER) {
        connection.send("create-text", input.value());
        input.value("");
        // console.log("message send");
    }
}
