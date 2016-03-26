var validateLoginForm = function() {
    var id = document.forms["loginForm"]["id"].value;
    if (id == null || id == "") {
        alert("ID must be filled out");
        return false;
    }

    var password = document.forms["loginForm"]["password"].value;
    if (password == null || password != "test") {
        alert("incorrect password");
        return false;
    }

    var zhost = document.forms["loginForm"]["zhost"].value;
    if (zhost == null || zhost == "") {
        alert("zhost must be filled out");
        return false;
    }

    var khost = document.forms["loginForm"]["khost"].value;
    if (khost == null || khost == "") {
        alert("khost must be filled out");
        return false;
    }

    var kport = document.forms["loginForm"]["kport"].value;
    if (kport == null || kport == "") {
        alert("kport must be filled out as integer");
        return false;
    }

    login(zhost,khost,kport);
}

var login = function(zhost, khost, kport) {
	// build the login info to send
	var info = {};
	info["zhost"] = zhost;
	info["khost"] = khost;
	info["kport"] = Number(kport);
	info = JSON.stringify(info);

    var url = "/submit";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onload = function() {
        if (xhr.status == 200) {
            console.log(xhr.responseText);
            window.location="/index";
        }
    };
    xhr.timeout = 10000;
    xhr.ontimeout = function() {
        console.log("Request timed out");
    };
    xhr.onerror = function() {
        console.log("Error occurred on request");
    };
    xhr.send(info);
}

function isNormalInteger(str) {
    var n = ~~Number(str);
    return String(n) === str && n >= 0;
}