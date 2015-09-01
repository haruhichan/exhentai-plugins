function setHentaiCookies() {
	try {
		chrome.cookies.getAll({domain:'.e-hentai.org'}, function(got) {
			for(var i = 0; i < got.length; i++) {
				if(got[i].name.indexOf('ipb_') != -1 || got[i].name.indexOf('uconfig') != -1) {
					chrome.cookies.set({url:'http://exhentai.org/', domain:'.exhentai.org', name:got[i].name, path:'/', value:got[i].value});
				}
			}
		});
			
		return true;
	} catch(e) {
		return false;
	}
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request == 'cookieDataSet') {
		sendResponse((setHentaiCookies() ? 'ok' : 'Unable to set cookies'));
	} else if(request == 'deleteAllCookies') {
		chrome.cookies.remove({name:"yay", url:"http://exhentai.org/"}, function(){});
		chrome.cookies.remove({name:"ipb_anonlogin", url:"http://exhentai.org/"}, function(){});
		chrome.cookies.remove({name:"ipb_member_id", url:"http://exhentai.org/"}, function(){});
		chrome.cookies.remove({name:"ipb_pass_hash", url:"http://exhentai.org/"}, function(){});
		chrome.cookies.remove({name:"ipb_session_id", url:"http://exhentai.org/"}, function(){});
		chrome.cookies.remove({name:"ipb_anonlogin", url:"http://e-hentai.org/"}, function(){});
		chrome.cookies.remove({name:"ipb_member_id", url:"http://e-hentai.org/"}, function(){});
		chrome.cookies.remove({name:"ipb_pass_hash", url:"http://e-hentai.org/"}, function(){});
		chrome.cookies.remove({name:"ipb_session_id", url:"http://e-hentai.org/"}, function(){});		
		sendResponse();
	} else if(request == 'reload') {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.reload(tab.id);
		});
	}
});