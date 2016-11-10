//
// Shannon Game using HTML5 and JavaScript
// 08/11/2016, Giulio Zausa
//

// Hardcoded JSONs URLs
var highScoreURL = "https://api.myjson.com/bins/1uu0c";

// Number of Words per game
var nwords = 100;

// DOM Elements
var outputSpan  = document.getElementById("output"),
    errorsSpan  = document.getElementById("errors"),
    recSpan     = document.getElementById("rec"),
    moderrSpan  = document.getElementById("modalerr"),
    nameInput   = document.getElementById("nameInput"),
    dropd       = document.getElementById("dropd"),
    hiTable     = document.getElementById("hiTable");

// Global Variables
var currentText, currentIndex, currentErrors, currentL, currentSubject;

// Populate Lists
PopulateDropDown();
PopulateHiScores();

// Keyboard Hook
RegisterCharEvent(onKey);
function onKey(key)
{
    // End Condition
    if (currentIndex < currentText.length)
    {
        // Checks for error
        if (key.toLowerCase() != removeAccents(currentText.substring(currentIndex, currentIndex + 1).toLowerCase())) {
            currentErrors++;
            errorsSpan.innerText = currentErrors;
            recSpan.innerText = currentErrors / currentL;
        }
        
        // Errors colors
        if (currentErrors == 0) {
            errorsSpan.className = "text-success";
        }
        else if (currentErrors < 5) {
            errorsSpan.className = "text-warning";
        }
        else {
            errorsSpan.className = "text-danger";
        }
        
        // Update output
        currentIndex++;
        outputSpan.innerText = RenderGrayedText(currentText, "*", currentIndex);
        
        // Checks if next character is a letter
        while (currentIndex < currentText.length && !IsCharOrSpace(removeAccents(currentText.substring(currentIndex, currentIndex + 1)).toUpperCase().charCodeAt(0)))
        {
            currentIndex++;
            outputSpan.innerText = RenderGrayedText(currentText, "*", currentIndex);
            currentL--;
        }
        
        // Win Modal
        if (currentIndex == currentText.length) {
            moderrSpan.innerText = currentErrors;
            $('#hsModal').modal();
        }
    }
}

// Save Highscore
function saveClick()
{
    var nameToSave = nameInput.value;
    var rec = currentErrors / currentL;
    loadJSON(highScoreURL, function(data){
        data.push({"name": nameToSave, "err": currentErrors, "rec": rec, "l": currentL, "subject": subjects[currentSubject]});
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
    currentL = currentText.length;
    outputSpan.innerText = RenderGrayedText(currentText, "*", currentIndex);
}

function PopulateDropDown()
{
    for (var i = 0; i < subjects.length; i++)
    {
        dropd.innerHTML += "<li><a href=\"#\" onclick=\"newGame(" + i + ")\">" + subjects[i] + "</a></li>";
    }
}

function PopulateHiScores()
{
    // Loads the JSON
    loadJSON(highScoreURL, function(data){
        // Sort the table by rendundancy
        data.sort(function(a,b) {return (a.rec > b.rec) ? 1 : ((b.rec > a.rec) ? -1 : 0);} );
        
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

function ResetHiScores()
{
    loadJSON(highScoreURL, function(data){
        data = [];
        saveJSON(highScoreURL, data, function () {
            PopulateHiScores();
        });
    });
}
