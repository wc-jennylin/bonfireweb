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
let congrats;
let timeToTip = true;
let timeToRemind = false;

console.log("up to date 6");

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
        congrats = createP("Welcome to Bonfire!" + "<br>" + "<br>" + "Wait for the count down on the big screen to enter your chatroom...");
        congrats.addClass("center");
        // congrats.addClass("fade-out");
    });

    // Open chatroom
    connection.on("start", function(){
        congrats.html("");
        input = createInput('');
        input.id('inputBox');
        input.attribute('placeholder','Press "return" to send your text...');
        // let welcome = createDiv('');
        // welcome.addClass('transbox');
        // let welcomeMessage = createP("Try to find all other people in this chatroom" + "<br>" + "then sit your group at a flower.");
        let welcomeMessage = createP("Use the chatroom to find your group and then gather at an empty flower station." + "<br>" + "Type the code on the flower in this chatroom to bloom a flower on the big screen. Don’t close your browser ;)");
        welcomeMessage = welcomeMessage.addClass('prompt');
        // welcomeMessage = welcomeMessage.addClass('fade-out');
        // welcome.child('welcomeMessage');
        start = second();


        //document.addEventListener('DOMContentLoaded', () => {
            setPlatformInfo();
            // var inputBox = document.getElementById("inputBox");
            var inputBox = document.querySelector('.safari #inputBox');
            console.log(inputBox);
            if(inputBox) {
              inputBox.addEventListener('focus', function(e) {
                  console.log("Input Box Selected");
                document.body.classList.add('keyboard');
                // inputBox.styles.bottom = "270px";


                setTimeout(function() {
                    // window.scrollTo(document.body.scrollLeft, document.body.scrollTop);
                    window.scrollTo(0, 0);
                }, 200);
              });
              
              inputBox.addEventListener('blur', function(e) {
                document.body.classList.remove('keyboard');
                // inputBox.styles.bottom = "0px";
              });
            }
          //});
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
            'Tips for finding each other:' + '<br>' +
            '1)	Everyone raises a hand/does jumping jacks' + '<br>' + 
            '2)	Ask what colors everyone is wearing' + '<br>' +
            '3) Get C.R.E.A.T.I.V.E!').addClass('tips');
            // tips.addClass('fade-out');
            start = now;
            timeToTip = false;
        } 
        // else if (time > 30 && timeToTip == false){
        //     start = now;
        //     timeToRemind = true;
        //     if (time > 30 && timeToRemind){
        //     let reminder = createP("Gather everyone at a flower that hasn't been claimed" + "<br>" + "& everyone sends the code on the flower to the chatroom").addClass('tips');
        //     start = -1;
        //     timeToRemind = false;
        //     }   
        // }
        // console.log(start, now, time);   
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

// function setPlatformInfo() {
//     var ua = navigator.userAgent.toLowerCase(); 
//     console.log()
//     if (ua.indexOf('safari') != -1) { 
//       if (ua.indexOf('chrome') > -1) {
//         document.body.classList.add('chrome');
//       } else {
//         document.body.classList.add('safari');
//       }
//     }
//   }
