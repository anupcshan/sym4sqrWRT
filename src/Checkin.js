Checkin.prototype = new Object();
Checkin.prototype.constructor = Checkin;
Checkin.superclass = Object.prototype;

Checkin._checkinList = [];

function Checkin(args) {
	if (args == null || args.id == null)
		return;
	if (Checkin._checkinList[args.id] != null)
		alert('Trying to recreate checkin.');
	this.id = args.id;
	Checkin._checkinList[id] = this;
}

Checkin.prototype.setValues = function(checkinData) {
	this.user = User.getUser(checkinData.user.id, false);
	this.venue = Venue.getVenue(checkinData.venue.id, false);
	if (checkinData.shout) {
		this.shout = checkinData.shout;
	}

	// Jugglery to change time format to JS type.
	var time = checkinData.created;
	time.splice(0, 1);
	var temp = time[0];
	time[0] = time[1];
	time[1] = temp + ',';
	time[2] = '20' + time[2];
	this.created = new Date(time.join(' '));
}

Checkin.prototype.id = "";
Checkin.prototype.user = null;
Checkin.prototype.venue = null;
Checkin.prototype.shout = "";
Checkin.prototype.created = null;

Checkin.getCheckin = function (id, nocreate) {
	if (Checkin._checkinList[id] != null)
		return Checkin._checkinList[id];
	if (nocreate)
		return null;
	return Checkin._checkinList[id] = new Checkin(id);
}
