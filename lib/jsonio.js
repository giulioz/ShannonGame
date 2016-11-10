//
// Functions for async JSON I/O using the MyJson.com API
// 08/11/2016, Giulio Zausa
//

var baseURL = "https://api.myjson.com/bins/";

function loadJSON(id, callback)
{
    httpReqAsync(id, "GET", null, "application/json; charset=utf-8", function(data) {callback(JSON.parse(data))});
}

function saveJSON(id, object, callback)
{
    httpReqAsync(id, "PUT", JSON.stringify(object), "application/json; charset=utf-8", callback);
}

function createJSON(object, callback)
{
    httpReqAsync(baseURL, "POST", JSON.stringify(object), "application/json; charset=utf-8", callback);
}

// Async HTTP Request (http://stackoverflow.com/questions/247483/http-get-request-in-javascript)
function httpReqAsync(theUrl, reqtype, content, ctype, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && (xmlHttp.status == 200 || xmlHttp.status == 201))
            callback(xmlHttp.responseText);
    }
    xmlHttp.open(reqtype, theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-type", ctype);
    xmlHttp.send(content);
}
