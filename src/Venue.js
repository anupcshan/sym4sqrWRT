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
                venueData.stats.mayor.user);
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
    if (Venue._venueList[id] != null) {
        Venue._venueList[id].setValues(venueData);
        return Venue._venueList[id];
    }
    if (!venueData)
        return null;
    var newVenue = new Venue({id: id});
    newVenue.setValues(venueData);
    return newVenue;
}
