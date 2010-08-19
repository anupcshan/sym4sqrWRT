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

FoursquareAPI = {};
FoursquareAPI._me = User.getUser(null, {});

FoursquareAPI.listFriends = function(callback, userId) {
    var params = {};
    if (userId != null)
        params.uid = userId;
    var callbackfn = function(data) {
        callback(FoursquareAPI._listFriendsCallback(data, userId));
    };
    sym4sqr._makeNetworkRequest({apifn: "friends.json", type: "GET",
            params: params, callback: callbackfn, inclLocn: true});
}

FoursquareAPI._listFriendsCallback = function(data, userId) {
    if (data == null || data.friends == null)
        return null;

    var friends = [];
    for (var i = 0, len = data.friends.length; i < len; i ++) {
        friends.push(User.getUser(data.friends[i].id, data.friends[i]));
    }

    if (userId == null)
        FoursquareAPI._me.setValues({friends: friends});
    else {
        var user = User.getUser(userId, {});
        if (user != null)
            user.setData({friends: friends});
    }
    return friends;
}

FoursquareAPI.listVenues = function(callback) {
    var params = {};
    var callbackfn = function(data) {
        callback(FoursquareAPI._listVenuesCallback(data));
    };
    sym4sqr._makeNetworkRequest({apifn: "venues.json", type: "GET",
            params: params, callback: callbackfn, inclLocn: true});
}

FoursquareAPI._listVenuesCallback = function(data) {
    if (data == null || data.groups == null)
        return null;
    var venues = [], venue;
    for (var i = 0, grps = data.groups.length; i < grps; i ++) {
        for (var j = 0, len = data.groups[i].venues.length; j < len; j ++) {
            venue = data.groups[i].venues[j];
            venues.push(Venue.getVenue(venue.id, venue));
        }
    }
    return venues;
}

FoursquareAPI.listTips = function(callback, venueId) {} // TODO

FoursquareAPI.getUserDetails = function(callback, userId) {
    var params = {};
    if (userId != null)
        params.uid = userId;
    var callbackfn = function(data) {
        callback(FoursquareAPI._getUserDetailsCallback(data, userId));
    };
    sym4sqr._makeNetworkRequest({apifn: "user.json", type: "GET",
            params: params, callback: callbackfn, inclLocn: true});
}

FoursquareAPI._getUserDetailsCallback = function(data, userId) {
    if (data == null || data.user == null)
        return null;

    var userData = data.user;

    var user = null;
    if (userId == null) {
        FoursquareAPI._me.setValues(userData);
        user = FoursquareAPI._me;
    }
    else {
        user = User.getUser(userId, userData);
    }
    return user;
}

FoursquareAPI.getVenueDetails = function(callback, venueId) {
    var params = {};
    if (venueId == null) {
        callback(null);
        return;
    }

    params.vid = venueId;
    var callbackfn = function(data) {
        callback(FoursquareAPI._getVenueDetailsCallback(data, venueId));
    };
    sym4sqr._makeNetworkRequest({apifn: "venue.json", type: "GET",
            params: params, callback: callbackfn, inclLocn: true});
}

FoursquareAPI._getVenueDetailsCallback = function(data, venueId) {
    if (data == null || data.venue == null)
        return null;

    return Venue.getVenue(venueId, data.venue);
}

FoursquareAPI.searchUser = function(callback) {} // TODO
FoursquareAPI.searchVenues = function(callback) {} // TODO
FoursquareAPI.getHistory = function(callback, userId) {} // TODO
FoursquareAPI.getRecentActivity = function(callback) {} // TODO
