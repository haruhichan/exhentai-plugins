$(document).ready(function() {
	var menu = $('#nb');
	
	if(!menu.length) {
		return;
	}
	
	menu.html(menu.html() + 
		'<img src="https://exhentai.org/img/mr.gif" alt="">' + 
		' <a id="haruhichanLogout" href="#">Logout</a>');
		
	$('#haruhichanLogout').click(function() {
		chrome.runtime.sendMessage('deleteAllCookies', function(){ 
			chrome.runtime.sendMessage('reload', function(){});
		});
	});
});
