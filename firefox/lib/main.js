//sdk requirements
//make sure all api's are mobile compatible
	var pageMod = require("sdk/page-mod");
	var store = require("sdk/simple-storage");
	var request = require("sdk/request").Request;
	var notify = require("sdk/notifications");	
	var tabs = require("sdk/tabs");
	var data = require("sdk/self").data;
	var self = this;	

//main
exports.main = function() {

	pageMod.PageMod({
		include: "http://exhentai.org*",
		contentScriptWhen: "end",
		contentScriptFile: [self.data.url("js/jquery.js"), self.data.url("js/redirect.js")]
	});

    	pageMod.PageMod({
		include: "http://exhentai.org/login",		
		contentScriptWhen: "end",
		contentScriptFile: [self.data.url("js/jquery.js"), self.data.url("js/exhentai.js")],

		//workaround for bug that appeared in Android Version of FF34 when using contentStyleFile
                contentScriptOptions: {
                	style_files: [ 
                        	data.url("css/bootstrap.min.css"),
                                data.url("css/bootstrap-theme.min.css"),
                                data.url("css/login.css") 
                        ]                        
                },


		onAttach: function(worker) {
	
		// Username Save Stuff
		worker.port.on('giveUsername', function(payload) {worker.port.emit('obtainUsername', store.storage.username);});
		worker.port.on('givePassword', function(payload) {worker.port.emit('obtainPassword', store.storage.password);});
		worker.port.on('saveUsername', function(payload) {store.storage.username = payload;});
		worker.port.on('savePassword', function(payload) {store.storage.password = payload;});
		worker.port.on('deleteLogin', function(payload) {	
			delete store.storage.username;
			delete store.storage.password;
		});

		worker.port.on('loginToEH', function(payload) {
			request({
                    		url: 'https://forums.e-hentai.org/index.php?act=Login&CODE=01',
                    		content: {
                        		'referer':'https://forums.e-hentai.org/index.php',
                        		'UserName':payload.username,
                       	 	        'PassWord':payload.password,
                        		'CookieDate':'1'
                    		},
                    		onComplete: function(r) {
                        	worker.port.emit('loginToEHResult', {text:r.text, statusText:r.statusText, headers:r.headers});
				}
			}).post();
		});
        	}
	});

};
