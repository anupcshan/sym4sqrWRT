var sym4sqr = {};

sym4sqr._loggedIn = false;
sym4sqr.doWork = function() {
	if (this._loggedIn == true)
		this.showMainWindow();
	else	this.showLoginWindow();
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

sym4sqr._loginButtonHandler = function() {
	alert('Implement login feature.');
}

function init()
{
	sym4sqr.doWork();
}
