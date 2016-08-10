function sanatizeS(s){
    //quick and dirty - jquery .text() converts everything to html entities
    var a = $("<div>").text(s);
    return a.text();
}

function saveData() {
    if($('#saveLogin').is(':checked')) {
	self.port.emit('saveUsername', sanatizeS( $('#usernameInput').val() ));
        self.port.emit('savePassword', sanatizeS( $('#passwordInput').val() ));
    } else {
        self.port.emit('deleteLogin', null);
    }
}

function setLocalCookie(name, value) {
    var exp = new Date();
    exp.setMonth(exp.getMonth() + 6);    
    document.cookie = sanatizeS(name) + '=' + sanatizeS(value) + ';expires=' + exp.toGMTString();
}

function deleteLocalCookie(name) {
    document.cookie = sanatizeS(name) + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
}

function loginToEhResult(r) {
    if(r == null || r.text == null) {
        displayError('Unknown error!');
        resetLoginForm();
        return;
    }
    
    if(r.text.indexOf('Username or password incorrect') != -1 || r.text.indexOf('we could not find a member using those log in details') != -1) {
        displayError('Incorrect Login!');
        resetLoginForm();
        return;
    }

    /* The Set-Cookie handling is awful for this shit, so we're going to make it better....*/
    var ipb_member_id = null;
    var ipb_pass_hash = null;
    var ipb_session_id = null;
    
    ipb_session_id = /[0-9a-f]{32}/i.exec(r.headers['Set-Cookie']);
    
    for (var headerName in r.headers) {
        if(headerName.indexOf('ipb_member_id') != -1) {
            ipb_member_id = /ipb_member_id=(0|[1-9][0-9]*);/i.exec(headerName);
            
            if(ipb_member_id != null) {
                ipb_member_id = ipb_member_id[1];
            }
        } else if(headerName.indexOf('ipb_pass_hash') != -1) {
            ipb_pass_hash = /ipb_pass_hash=([0-9a-f]{32});/i.exec(headerName);
            
            if(ipb_pass_hash != null) {
                ipb_pass_hash = ipb_pass_hash[1];
            }
        }
    }
    
    if(ipb_session_id == null || ipb_member_id == null || ipb_pass_hash == null) {
        displayError('Login Failure!');
        resetLoginForm();
        return;
    } else {
        setLocalCookie('ipb_session_id', ipb_session_id);
        setLocalCookie('ipb_member_id', ipb_member_id);
        setLocalCookie('ipb_pass_hash', ipb_pass_hash);
        
        //alert('Login successful, we\'re sending you back to the home page now!');
        
        window.location.href = 'https://exhentai.org';
    }
}

function loginToEh() {
    disableLoginForm('Logging in...');
    saveData();
    
    self.port.on('loginToEHResult', loginToEhResult);
    self.port.emit('loginToEH', {username:sanatizeS( $('#usernameInput').val() ), password: sanatizeS( $('#passwordInput').val() )});
}

function displayError(e) {
        $('#errorMsg').css('visibility', 'visible').text('Error: ' + e).hide().fadeIn('slow');
}

function disableLoginForm(msg) {
        $('#loginButton').addClass('disabled');
        $('#loginButton').text(msg);
        $('#usernameInput').prop('disabled', true);
        $('#passwordInput').prop('disabled', true);
        $('#saveLogin').prop('disabled', true);
}

function resetLoginForm() {
        $('#loginButton').removeClass('disabled');
        $('#loginButton').text('Sign in');
        $('#usernameInput').prop('disabled', false);
        $('#passwordInput').prop('disabled', false);
        $('#saveLogin').prop('disabled', false);
}

$(function() {
    // Don't know why we'd need this but here it is
    deleteLocalCookie('ipb_session_id');
    deleteLocalCookie('ipb_member_id');
    deleteLocalCookie('ipb_pass_hash');

    // Stinky 404
    document.title = 'ExHentai Easy! ~ Login';


    //workaround for bug that appeared in Android Version of FF34 when using contentStyleFile
    // Add the stylesheets here
    var temp = '<link rel="stylesheet" href="xxxxx.css" type="text/css" />';
    $( 'head' ).append( temp.replace( "xxxxx.css", self.options.style_files[ 0 ] ) );
    $( 'head' ).append( temp.replace( "xxxxx.css", self.options.style_files[ 1 ] ) );
    $( 'head' ).append( temp.replace( "xxxxx.css", self.options.style_files[ 2 ] ) );
        
    // Append main page content
    var b = $('body');

    b.html(''); //clear the page's 404 msg or other contents

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
                    .append( $("<button>", { id: "loginButton", class: "btn btn-lg btn-success btn-block" }).text("Sign In") )
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
    
    $('#loginButton').bind('click', loginToEh);
    $(document).keypress(function(e) {
        if(e.which == 13) {
            $('#loginButton').click();
        }
    });
    
    self.port.on('obtainUsername', function(payload) {
        if(payload != null) {
            $('#usernameInput').val(payload);
        }
    });
    
    self.port.on('obtainPassword', function(payload) {
        if(payload != null) {
            $('#passwordInput').val(payload);
        }
    });
    
    self.port.emit('giveUsername', null);
    self.port.emit('givePassword', null);
});
