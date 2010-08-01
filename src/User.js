User.prototype = new Object();
User.prototype.constructor = User;
User.superclass = Object.prototype;

User._userList = {};

function User(args) {
	if (args == null || args.id == null)
		return;
	if (User._userList[args.id] != null)
		alert('Trying to recreate user.');
	this.id = args.id;
	User._userList[this.id] = this;
}

User.prototype.setValues = function(userData) {
	if (userData.firstname != null)
		this.firstname = userData.firstname;
	if (userData.lastname != null)
		this.lastname = userData.lastname;
	if (userData.phone != null)
		this.phone = userData.phone;
	if (userData.photo != null)
		this.photo = userData.photo;
	if (userData.twitter != null)
		this.twitter = userData.twitter;
	if (userData.facebook != null)
		this.facebook = userData.facebook;
	if (userData.gender != null)
		this.gender = userData.gender;
	if (userData.checkins != null) {
		for (var checkin in userData.checkins) {
			var checkinobj = Checkin.getCheckin(checkin.id, checkin);
			if (this.checkins.indexOf(checkinobj) != -1)
				continue;
			this.checkins.push(checkinobj);
		}
	}
	if (userData.checkin != null) {
		var checkin = userData.checkin;
		checkin.user = this;
		var checkinobj = Checkin.getCheckin(checkin.id, checkin);
		if (this.checkins.indexOf(checkinobj) == -1)
			this.checkins.push(checkinobj);
	}
	if (userData.badges != null)
		this.badges = [];	// TODO
	if (userData.mayorships != null)
		this.mayorships = [];	// TODO
	if (userData.friends != null)
		this.friends = [];	// TODO
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

User.getUser = function (id, userData) {
	if (User._userList[id] != null)
		return User._userList[id];
	if (!userData)
		return null;
	var newUser = new User({id: id});
	newUser.setValues(userData);
	return newUser;
}
