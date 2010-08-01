Venue.prototype = new Object();
Venue.prototype.constructor = Venue;
Venue.superclass = Object.prototype;

Venue._venueList = {};

function Venue(args) {
	if (args == null || args.id == null)
		return;
	if (Venue._venueList[args.id] != null)
		alert('Trying to recreate venue.');
	this.id = args.id;
	Venue._venueList[this.id] = this;
}

Venue.prototype.setValues = function(venueData) {
	this.name = venueData.name;
	this.address = venueData.address;
	this.state = venueData.state;
	this.city = venueData.city;
	this.geolat = venueData.geolat;
	this.geolong = venueData.geolong;
	if (venueData.stats != null) {
		if (venueData.stats.mayor != null)
		this.mayor = User.getUser(venueData.stats.mayor.user.id,
				venueData.stats.mayor.user.id);
	}
}

Venue.prototype.id = "";
Venue.prototype.name = "";
Venue.prototype.address = "";
Venue.prototype.state = "";
Venue.prototype.city = "";
Venue.prototype.geolat = "";
Venue.prototype.geolong = "";
Venue.prototype.mayor = null;

Venue.getVenue = function (id, venueData) {
	if (Venue._venueList[id] != null)
		return Venue._venueList[id];
	if (!venueData)
		return null;
	var newVenue = new Venue({id: id});
	newVenue.setValues(venueData);
	return newVenue;
}
