function setHentaiCookies() {
    const getting = browser.cookies.getAll({domain:".e-hentai.org"});
    return getting.then(cookies =>
        Promise.all(
            cookies
            .filter(cookie => cookie.name.indexOf("ipb_") != -1
                           || cookie.name.indexOf("uconfig") != -1)
            .map(cookie => browser.cookies.set({
                                url: "https://exhentai.org/",
                                domain: ".exhentai.org",
                                name: cookie.name,
                                path: "/",
                                value: cookie.value}))));
}


function deleteHentaiCookies(cookies) {
    return Promise.all(cookies.map(cookie => browser.cookies.remove(cookie)));
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("DEBUG -- background.js: Message recieved by background.js: " + request);
    if (request == "cookieDataSet") {
        sendResponse(setHentaiCookies());
    } else if(request == "deleteAllCookies") {
        const cookies_to_delete = [
            {name: "yay", url: "https://exhentai.org/"},
            {name: "ipb_anonlogin", url: "https://exhentai.org/"},
            {name: "ipb_member_id", url: "https://exhentai.org/"},
            {name: "ipb_pass_hash", url: "https://exhentai.org/"},
            {name: "ipb_session_id", url: "https://exhentai.org/"},
            {name: "ipb_anonlogin", url: "http://e-hentai.org/"},
            {name: "ipb_member_id", url: "http://e-hentai.org/"},
            {name: "ipb_pass_hash", url: "http://e-hentai.org/"},
            {name: "ipb_session_id", url: "http://e-hentai.org/"}
        ];

        sendResponse(deleteHentaiCookies(cookies_to_delete));
    } else if (request == "reload") {
        browser.tabs.query({currentWindow: true, active: true})
        .then(([tab]) => browser.tabs.reload(tab.id))
        .catch(error => console.log(`Error: ${error}`));
    }
});
