//
// Shannon Game using HTML5 and JavaScript
// 08/11/2016, Giulio Zausa, Leonardo Pinton
//

// Hardcoded JSONs URLs
const highScoreURL = "https://api.myjson.com/bins/1uu0c";

// Statistics
const	nwords		= 20;
const	nchars		= 27;
var		infoPerChar	= Math.log2(nchars);
var 	info1Bit	= Math.log2(2);

// DOM Elements
var outputSpan  = document.getElementById("output"),
    errori      = document.getElementById("errori"),
    percErrors	= document.getElementById("percErrors"),
    giuste		= document.getElementById("giuste"),
    rindondanza = document.getElementById("rindondanza"),
    moderrSpan  = document.getElementById("modalerr"),
    nameInput   = document.getElementById("nameInput"),
    dropd       = document.getElementById("dropd"),
    hiTable     = document.getElementById("hiTable");
	
// Global Variables
var currentText, currentIndex, currentErrors, currentLength, currentSubject, currentInfoS, currentInfoT, currentGuesses;

// Populate Lists
PopulateDropDown();
PopulateHiScores();

// TESTO CIFRATO button Click
document.getElementById("testoCifratoBut").addEventListener("click", function(){
    outputSpan.innerText = ErrSentence(currentText, currentGuesses);
});

// Keyboard Hook
RegisterCharEvent(function(key) {
    // End Condition
    if (currentIndex < currentText.length)
    {
        // Checks for error
        if (key.toLowerCase() != removeAccents(currentText.substring(currentIndex, currentIndex + 1).toLowerCase())) {
            // -Error-
            currentErrors++;
            errori.innerText = currentErrors;
        }
		else {
            // -Guess-
            currentGuesses++;
            giuste.innerText = currentGuesses;
        }
        
        // Update output with another character
        currentIndex++;
        outputSpan.innerText = RenderGrayedText(currentText, "\u2022", currentIndex);
        
        // Checks if next character is a letter
        while (currentIndex < currentText.length &&
                !IsCharOrSpace(removeAccents(currentText.substring(currentIndex, currentIndex + 1)).toUpperCase().charCodeAt(0)))
        {
            currentIndex++;
            outputSpan.innerText = RenderGrayedText(currentText, "\u2022", currentIndex);

            // Update statistics with new length
            currentLength--;
			currentInfoT = currentLength * infoPerChar;
        }

        // -- STATISTICS --
        // Percent error
        var percent = (Math.round((currentErrors / currentLength) * 100000)) / 1000;
		percErrors.innerText = "(" + percent + "%)";

        // Information and Rendundancy
		currentInfoS = currentGuesses * info1Bit + currentErrors * infoPerChar;
        var rendundancy = (Math.round((currentInfoT - currentInfoS) * 1000)) / 1000;
		rindondanza.innerText = rendundancy + " bit";
        
        // Win Modal - SAVE HIGHSCORE
        if (currentIndex == currentText.length) {
            moderrSpan.innerText = currentErrors;
            $('#hsModal').modal();
        }
    }
});

// Save Highscore
function saveClick()
{
    var nameToSave = nameInput.value;
	currentInfoS = currentGuesses * info1Bit + currentErrors * infoPerChar;
	currentInfoT = currentLength * infoPerChar;
    var rec = currentInfoT - currentInfoS;
    loadJSON(highScoreURL, function(data){
        data.push({"name": nameToSave, "err": currentErrors, "rec": rec, "l": currentLength, "subject": subjects[currentSubject]});
        saveJSON(highScoreURL, data, function () {
            PopulateHiScores();
            $('#hsModal').modal('hide');
        });
    });
}

// Starts a new game
function newGame(subject)
{
    // Load Texts
    currentSubject = subject;
    currentText = GetRandomSentence(texts[subject][randomIntFromInterval(0, texts[subject].length)], nwords).trim();
    currentIndex = 0;
    currentErrors = 0;
    currentGuesses = 0;
    currentLength = currentText.length;
	currentInfoT = currentLength * infoPerChar;
	currentInfoS = currentGuesses * info1Bit + currentErrors * infoPerChar;
    outputSpan.innerText = RenderGrayedText(currentText, "\u2022", currentIndex);
}

// Adds elements to the dropdown start game menu
function PopulateDropDown()
{
    for (var i = 0; i < subjects.length; i++)
    {
        dropd.innerHTML += "<li><a href=\"#\" onclick=\"newGame(" + i + ")\">" + subjects[i] + "</a></li>";
    }
}

// Fills the Highscores table
function PopulateHiScores()
{
    // Loads the JSON
    loadJSON(highScoreURL, function(data){
        // Sort the table by rendundancy
        data.sort(function(a,b) {return (a.rec < b.rec) ? 1 : ((b.rec < a.rec) ? -1 : 0);} );
        
        // Populate the table
        var html = "";
        for (var i = 0; i < data.length; i++)
        {
            html += "<tr>";
                html += "<th scope=\"row\">" + i + "</td>";
                html += "<td>" + data[i].name + "</td>";
                html += "<td>" + data[i].subject + "</td>";
                html += "<td>" + data[i].err + "</td>";
                html += "<td>" + data[i].rec + "</td>";
            html += "</tr>";
        }
        hiTable.innerHTML = html;
    });
}

// For internal use
function ResetHiScores()
{
    loadJSON(highScoreURL, function(data){
        data = [];
        saveJSON(highScoreURL, data, function () {
            PopulateHiScores();
        });
    });
}
