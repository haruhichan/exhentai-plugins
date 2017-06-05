function loadData() {
    const loadSaved = localStorage.getItem("exh_sddd");

    if (loadSaved == "1") {
        $("#saveLogin").attr("checked", "checked");
    } else {
        return; // We"re not reviving!
    }

    const savedUser = localStorage.getItem("exh_user");
    const savedPass = localStorage.getItem("exh_pass");

    if (savedUser != null && savedPass != null) {
        $("#usernameInput").val(savedUser);
        $("#passwordInput").val(savedPass);
    }
}

function saveData() {
    if ($("#saveLogin").is(":checked")) {
        localStorage.setItem("exh_user", $("#usernameInput").val());
        localStorage.setItem("exh_pass", $("#passwordInput").val());
        localStorage.setItem("exh_sddd", "1");
    } else {
        localStorage.removeItem("exh_user");
        localStorage.removeItem("exh_pass");
        localStorage.removeItem("exh_sddd");
    }
}

function displayError(error) {
    console.log(`Error: ${error}`);
    $("#errorMsg").css("visibility", "visible")
                  .html(`<b>Error</b>: ${error}`)
                  .hide()
                  .fadeIn("slow");
}

function disableLoginForm(msg) {
    $("#loginbutton").addClass("disabled");
    $("#loginbutton").html(msg);
    $("#usernameInput").prop("disabled", true);
    $("#passwordInput").prop("disabled", true);
    $("#saveLogin").prop("disabled", true);
}

function resetLoginForm() {
    $("#loginbutton").removeClass("disabled");
    $("#loginbutton").html("Sign in");
    $("#usernameInput").prop("disabled", false);
    $("#passwordInput").prop("disabled", false);
    $("#saveLogin").prop("disabled", false);
}

function reloadPage() {
    browser.runtime.sendMessage("reload")
    .catch(error => console.log(`Error: ${error}`));
}

function copyCookies() {
    console.log("DEBUG -- ex.js: copying cookies");
    browser.runtime.sendMessage("cookieDataSet")
    .then(() => {
        saveData();
        reloadPage();
    }).catch(error => {
        displayError(error);
        resetLoginForm();
    });
}

function handleLoginClick() {
    disableLoginForm("Logging in...");

    const username = encodeURIComponent($("#usernameInput").val());
    const password = encodeURIComponent($("#passwordInput").val());

    if (username.length == 0 || password.length == 0) {
        displayError("Username and Password required!");
        resetLoginForm();
    } else {
        $.post("https://forums.e-hentai.org/index.php?act=Login&CODE=01",
               "&referer=https://forums.e-hentai.org/index.php"
               + "&UserName=" + username
               + "&PassWord=" + password
               + "&CookieDate=1",
               x => {
            if (x.indexOf("Username or password incorrect") != -1) {
                displayError("Login failure!");
                resetLoginForm();
            } else if (x.indexOf("You must already have registered for an account before you can log in") != -1) {
                displayError(`No account exists with name ${username}`);
                resetLoginForm();
            } else if (x.indexOf("You are now logged in as:") != -1) {
                console.log("DEBUG -- ex.js: Calling browser.runtime.sendMessage()");
                copyCookies();
            } else {
                displayError("Error parsing login result page!");
                resetLoginForm();
            }
        }).fail(() => {
            displayError("Error sending POST request to forums.e-hentai.org!");
            resetLoginForm();
        });
    }
}

function makeLoginForm() {

    document.title = "ExHentai Easy! ~ Login";

    let b = $("body");

    b.html(""); //clear the page"s 404 msg or other contents

    //safe html and annoying jquery templating
    b.append(
        $("<div>", { align: "center" })
            .append($("<img>", { src: "https://exhentai.org", alt: "Sad Panda is Sad" }))
        .append($("<div>", { id: "errorMsg", class: "alert alert-danger", style: "visibility:hidden; text-align: left;" }))
    );

    b.append(
        $("<div>", { class: "container" })
            .append(
                $("<div>", { class: "form-signin" })
                    .append( $("<input>", { id: "usernameInput", type: "text", class: "form-control", placeholder: "Username", required: "", autofocus: ""}) )
                    .append( $("<input>", { id: "passwordInput", type: "password", class: "form-control", placeholder: "Password", required: ""}) )
                    .append(
                        $("<label>", { class: "checkbox" })
                            .append( $("<input>", { id: "saveLogin", type: "checkbox", value: "remember-me" }).val(" Remember me") )
                            .append(" Remember me")
                    )
                    .append( $("<button>", { id: "loginbutton", class: "btn btn-lg btn-success btn-block" }).text("Sign In") )
                    .append( $("<button>", { id: "cookiebutton", class: "btn btn-lg btn-success btn-block" }).text("Copy Cookies") )
                    .append(
                        $("<div>", { align: "center", style: "margin-top: 12px; font-size: 12px;" })
                            .append($("<a>", { href: "http://haruhichan.com/", target: "_blank" }).text("Presented by Haruhichan"))
                            .append($("<br>"))
                            .append($("<a>", { href: "http://haruhichan.com/forum/showthread.php?24909-Firefox-ExHentai-Easy-v2-Get-past-sad-panda!", target: "_blank" }).text("Support - Contact - Donate"))
                            .append($("<br>"))
                            .append($("<a>", { href: "bitcoin:15kJLmbnU4jyY8TcJ4jJ6uBKaHv3PqPm5n" }).text("Bitcoin"))
                            .append(": 15kJLmbnU4jyY8TcJ4jJ6uBKaHv3PqPm5n")
                            .append($("<br>"))
                            .append($("<a>", { href: "dogecoin:D8LBPmry9QeEpFAgJhoQcyfD4jEW1CtBVi" }).text("Dogecoin"))
                            .append(": D8LBPmry9QeEpFAgJhoQcyfD4jEW1CtBVi")
                            .append($("<br>"))
                            .append($("<a>", { href: "litecoin:LLmgH3dduf4UAJy1xovv7Zmx3yz4qSqcuh" }).text("Litecoin"))
                            .append(": LLmgH3dduf4UAJy1xovv7Zmx3yz4qSqcuh")
                    )
            )
    );

    loadData();

    $("#loginbutton").click(handleLoginClick);
    $("#cookiebutton").click(copyCookies);
    $(document).keypress(e => {
        if (e.which == 13) {
            $("#loginbutton").click();
        }
    });
}

// Needed because title resets when only SadPanda image on screen
$(window).resize(() => document.title = "ExHentai Easy! ~ Login");

$(document).ready(function() {
    const exSrc = $(`img[src="${document.URL}"]`); // If SadPanda present

    if (exSrc.length) {
        makeLoginForm();
    }
});
