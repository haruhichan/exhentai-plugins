$(document).ready(() => {
    let menu = $("#nb");

    if (!menu.length) {
        return;
    }

    menu.html(menu.html() +
        `<img src="data:image/gif;base64,R0lGODlhBQAHALMAAK6vr7OztK+urra2tkJCQsDAwEZGRrKyskdHR0FBQUhISP///wAAAAAAAAAAAAAAACH5BAEAAAsALAAAAAAFAAcAAAQUUI1FlREVpbOUSkTgbZ0CUEhBLREAOw==">` +
        ` <a id="haruhichanLogout" href="#">Logout</a>`);

    $("#haruhichanLogout").click(() => {
        console.log("DEBUG -- logout.js: clicked logout");
        browser.runtime.sendMessage("deleteAllCookies")
        .then(() => browser.runtime.sendMessage("reload"))
        .catch(error => console.log(`Error: ${error}`));
    });
});
