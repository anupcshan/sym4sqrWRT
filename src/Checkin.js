/*
 * Copyright (C) 2010 - Anup C Shan
 *
 * This file is part of the Sym4Sqr project.
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation; either version 2, or (at your option) any
 * later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA
 */

Checkin.prototype = new Object();
Checkin.prototype.constructor = Checkin;
Checkin.superclass = Object.prototype;

Checkin._checkinList = {};

function Checkin(args) {
	if (args == null || args.id == null)
		return;
	if (Checkin._checkinList[args.id] != null)
		alert('Trying to recreate checkin.');
	this.id = args.id;
	Checkin._checkinList[this.id] = this;
}

Checkin.prototype.setValues = function(checkinData) {
	this.user = User.getUser(checkinData.user.id, checkinData.user);
	this.venue = Venue.getVenue(checkinData.venue.id, checkinData.venue);
	if (checkinData.shout) {
		this.shout = checkinData.shout;
	}

	// Jugglery to change time format to JS type.
	var time = checkinData.created.split(' ');
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

Checkin.getCheckin = function (id, checkinData) {
	if (Checkin._checkinList[id] != null)
		return Checkin._checkinList[id];
	if (!checkinData)
		return null;
	var newCheckin = new Checkin({id: id});
	newCheckin.setValues(checkinData);
	return newCheckin;
}
