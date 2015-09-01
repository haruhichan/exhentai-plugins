//<3 	
	var exSrc = $("img[src='" + document.URL + "']");
	var menu = $('#nb');

	if(exSrc.length) {
		window.location.href = 'http://exhentai.org/login';
	} else if(menu.length) {

		menu.append($("<img>", { src: "http://st.exhentai.net/img/mr.gif", alt: "" }));
		menu.append(" ");
		menu.append($("<a>", { id: "haruhichanLogout", href: "#" }).text("Logout"));


		$('#haruhichanLogout').click(function() {
    			deleteLocalCookie('ipb_session_id');
    			deleteLocalCookie('ipb_member_id');
    			deleteLocalCookie('ipb_pass_hash');	
			window.location.href = 'http://exhentai.org/login';	
			return false;	
		});
	}


function deleteLocalCookie(name) {
    document.cookie = name + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
}

