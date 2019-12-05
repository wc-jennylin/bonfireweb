////////////////////////////////////////
// CONNECTION
////////////////////////////////////////

const connection = new Connection(
    "Bonfire",
    "player",
    "https://fireflower.herokuapp.com/"
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

    // Listen for changes to input field
    input = select("#input");

    // connection.on("text-original", function(data){
    // let message = {
    //     id: socket.id,
    //     word: data
    // }
    // connection.send("text", message);
    // });

    // Listen for texts from partners
    connection.on("text", function(sender, message) {
        let id = message.id;
        let txt = message;
        let p;
        try {
            p = select("#" + id).html(txt);
            p.elt.className = "";
            if (p.timeout) clearTimeout(p.timeout);
            p.timeout = setTimeout(() => p.addClass("fade"), 100);
        } catch {
            // Otherwise craete a new on
            p = createP(txt).id(id);
            p.addClass("fade");
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
        // connection.send("text-original", input.value());
        input.value("");
        console.log("message send");
    }
}
