User.prototype = new Object();
User.prototype.constructor = User;
User.superclass = Object.prototype;

User._userList = [];

function User(args) {
	if (args == null || args.id == null)
		return;
	if (User._userList[args.id] != null)
		alert('Trying to recreate user.');
	this.id = args.id;
	User._userList[id] = this;
}

User.prototype.setValues = function(userData) {
	this.firstname = userData.firstname;
	this.lastname = userData.lastname;
	this.phone = userData.phone;
	this.photo = userData.photo;
	this.twitter = userData.twitter;
	this.facebook = userData.facebook;
	this.gender = userData.gender;
	this.checkins = [];
	this.badges = [];
	this.mayorships = [];
	this.friends = [];
}

User.prototype.id = "";
User.prototype.firstname = "";
User.prototype.lastname = "";
User.prototype.phone = "";
User.prototype.photo = "";
User.prototype.twitter = "";
User.prototype.facebook = "";
User.prototype.gender = "";
User.prototype.checkins = [];
User.prototype.badges = [];
User.prototype.mayorships = [];
User.prototype.friends = [];

User.getUser = function (id, nocreate) {
	if (User._userList[id] != null)
		return User._userList[id];
	if (nocreate)
		return null;
	return new User(id);
}
