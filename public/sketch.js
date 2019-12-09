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
        createP("We are sorry, but you need to be the first 50 people to join this social experiment.");
        createElement("br");
        createP("Please be the first to join our next round!");
    });

    // Listen for changes to input field
    input = createInput('');
    input.id('input');
    input.attribute('placeholder','Find who you are talking to ;)');

    // Listen for texts from partners
    connection.on("text", function(id, text) {
        let id = id;
        let txt = text;
        let p;
        try {
            p = select("#" + id).html(txt);
            p.elt.className = "";
            if (p.timeout) clearTimeout(p.timeout);
            p.timeout = setTimeout(() => p.addClass("fade"), 100);
            console.log("same person");
        } catch {
            // Otherwise craete a new on
            p = createP(txt).id(id);
            p.addClass("fade");
            console.log(id);
        }
    });

    // Remove disconnected users
    // Display "User left" message
    connection.on("leave room", function() {
        createP("(someone left...)").addClass("fade");
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
