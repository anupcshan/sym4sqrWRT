var sym4sqr = {};

sym4sqr._loggedIn = false;
sym4sqr._API_ROOT = 'http://api.foursquare.com/v1/';
sym4sqr._username = "";
sym4sqr._password = "";
sym4sqr._me = null;

sym4sqr.doWork = function() {
	if (sym4sqr._loggedIn == true)
		sym4sqr.showMainWindow();
	else	sym4sqr.showLoginWindow();
}

sym4sqr.showMainWindow = function() {
	$('#sym4sqrContainer').text('');
	$('#lightBox').hide(400);
}

sym4sqr.showLoginWindow = function() {
	var innerHTML = '<div id="lightBoxInner">\
				<span style="display: block;">Username</span>\
				<input id="username"></input>\
				<span style="display: block;">Password</span>\
				<input id="password" type="password"></input>\
				<input type="button" id="loginButton" value="Login"\
					style="display: block; margin-left: auto; margin-right: auto;">\
				</input>\
			</div>';
	$('#lightBox').text('');
	$('#lightBox').append(innerHTML);
	$('#lightBox').css({display: 'table'});
	$('#loginButton').click(sym4sqr._loginButtonHandler);
}

sym4sqr._makeNetworkRequest = function(args) {
	/*
	 * args : Bag of parameters containing
	 * 	- apifn    => API function to be called
	 *	- callback => Function to be called once network request is completed
	 *	- params   => Parameters to be sent in the request
	 *	- type     => GET/POST
	 */
	if (args.params == null)
		args.params = "";

	if (args.type == null)
		args.type = "GET";
	$.ajax({url: sym4sqr._API_ROOT + args.apifn,  success: args.callback, data: args.params, username: sym4sqr._username, password: sym4sqr._password, type: args.type});
}

sym4sqr._loginButtonHandler = function() {
	sym4sqr._username = $('#username').val();
	sym4sqr._password = $('#password').val();
	sym4sqr._makeNetworkRequest({apifn: "user.json", type: "GET", params: {}, callback: sym4sqr._loginRequestCallback});
}

sym4sqr._loginRequestCallback = function(data) {
	if (data['user'] == null) {
		sym4sqr._loggedIn = false;
		alert('Login error.');
		return;
	}

	sym4sqr._loggedIn = true;
	sym4sqr._me = User.getUser(data['user'].id, data['user']);
	alert('Logged in as ' + sym4sqr._me.firstname);
	sym4sqr.showMainWindow();
}

function init()
{
	sym4sqr.doWork();
}
