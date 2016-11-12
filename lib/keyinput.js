//
// Functions for Keyboard Input Handling
// 08/11/2016, Giulio Zausa
//

// Fires with every keycode
function RegisterKeyEvent(callback)
{
    document.addEventListener('keydown', function(event) {
        //event.preventDefault();
        callback(event.keyCode);
    });
}

// Fires only on char or space, with the key as parameter
function RegisterCharEvent(callback)
{
    document.addEventListener('keydown', function(event) {
        //event.preventDefault();
        
        // BUG with space and scrolling
        if (event.keyCode == 32)
			event.preventDefault();
        if (IsCharOrSpace(event.keyCode)) {
            callback(String.fromCharCode(event.keyCode));
        }
    });
}

function IsCharOrSpace(keycode)
{
    return keycode == 32 || (keycode >= 65 && keycode <= 90);
}
