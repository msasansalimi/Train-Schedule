$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCcjzaCkdwlGWjIpOTjxCyNwnZh1P2InCc",
        authDomain: "train-schedule-da29f.firebaseapp.com",
        databaseURL: "https://train-schedule-da29f.firebaseio.com",
        projectId: "train-schedule-da29f",
        storageBucket: "",
        messagingSenderId: "596577209698"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // 2. Button for adding Employees
    $("#add-train-btn").on("click", function (event) {
        event.preventDefault();

        var trainName = $("#train-name-input").val().trim();
        var trainDest = $("#destination-input").val().trim();
        var firstTime = moment($("#first-train-input").val().trim(), "hh:mm").format("hh:mm");
        var trainFreq = $("#frequency-input").val().trim();

        var newTrain = {
            name: trainName,
            destination: trainDest,
            time: firstTime,
            frequency: trainFreq
        };
        database.ref().push(newTrain);

        //Clearing all of the text boxes
        $("#train-name-input").val("")
        $("#destination-input").val("")
        $("#first-train-input").val("")
        $("#frequency-input").val("")

    });
    // 3. Create Firebase event for adding new trains to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot.val());

        // Store everything into a variable.
        var trainName = childSnapshot.val().name;
        var trainDest = childSnapshot.val().destination;
        var firstTime = childSnapshot.val().time;
        var trainFreq = childSnapshot.val().frequency;

      // Methods to calculate the next arrival time and minutes away 

        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % trainFreq;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = trainFreq - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


        // ===============================================================================
        //Creating new row and append to the table
        $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + 
        "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>"); 


    });

});





