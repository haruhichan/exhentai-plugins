$(document).ready(function() {
	var menu = $('#nb');
	
	if(!menu.length) {
		return;
	}
	
	menu.html(menu.html() + 
		'<img src="data:image/gif;base64,R0lGODlhBQAHALMAAK6vr7OztK+urra2tkJCQsDAwEZGRrKyskdHR0FBQUhISP///wAAAAAAAAAAAAAAACH5BAEAAAsALAAAAAAFAAcAAAQUUI1FlREVpbOUSkTgbZ0CUEhBLREAOw==" alt="">' + 
		' <a id="haruhichanLogout" href="#">Logout</a>');
		
	$('#haruhichanLogout').click(function() {
		chrome.runtime.sendMessage('deleteAllCookies', function(){ 
			chrome.runtime.sendMessage('reload', function(){});
		});
	});
});
