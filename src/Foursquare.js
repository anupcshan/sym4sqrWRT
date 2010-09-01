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
FoursquareAPI._loggedIn = false;
FoursquareAPI._API_ROOT = 'http://api.foursquare.com/v1/';
FoursquareAPI._username = "";
FoursquareAPI._password = "";

FoursquareAPI._serviceObject = null;
FoursquareAPI._location = {hasLocation: false};

FoursquareAPI.listFriends = function(callback, userId) {
    var params = {};
    if (userId != null)
        params.uid = userId;
    var callbackfn = function(data) {
        callback(FoursquareAPI._listFriendsCallback(data, userId));
    };
    FoursquareAPI._makeNetworkRequest({apifn: "friends.json", type: "GET",
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
    FoursquareAPI._makeNetworkRequest({apifn: "venues.json", type: "GET",
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
    FoursquareAPI._makeNetworkRequest({apifn: "user.json", type: "GET",
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
    FoursquareAPI._makeNetworkRequest({apifn: "venue.json", type: "GET",
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

FoursquareAPI.login = function() {
    FoursquareAPI._username = $('#username').val();
    FoursquareAPI._password = $('#password').val();
    FoursquareAPI._makeNetworkRequest({apifn: "user.json", type: "GET", params: {},
            callback: FoursquareAPI._loginRequestCallback});
}

FoursquareAPI._loginRequestCallback = function(data) {
    if (data['user'] == null) {
        FoursquareAPI._loggedIn = false;
        alert('Login error.');
        return;
    }

    FoursquareAPI._loggedIn = true;
    FoursquareAPI._me.setValues(data['user']);
    alert('Logged in as ' + FoursquareAPI._me.firstname);
    sym4sqr.showMainWindow();
}

FoursquareAPI._makeNetworkRequest = function(args) {
    /*
     * args : Bag of parameters containing
     *     - apifn    => API function to be called
     *    - callback => Function to be called once network request is completed
     *    - params   => Parameters to be sent in the request
     *    - type     => GET/POST
     *    - inclLocn => Boolean value indicating whether location info can be
     *                   included in the request.
     */
    if (args.params == null)
        args.params = {};

    if (args.type == null)
        args.type = "GET";

    if (args.inclLocn == true && FoursquareAPI._location.hasLocation == true) {
        args.params.geolong = FoursquareAPI._location.longitude;
        args.params.geolat = FoursquareAPI._location.latitude;
    }
    $.ajax({url: FoursquareAPI._API_ROOT + args.apifn,  success: args.callback,
            data: args.params, username: FoursquareAPI._username,
            password: FoursquareAPI._password, type: args.type});
}

// Gets the GPS position
FoursquareAPI.getLocationAsync = function() {
    try {
        //Retrieves the Service object to the ILocation interface
        FoursquareAPI._serviceObject = device.getServiceObject("Service.Location",
                "ILocation");
    } catch (e) {
        alert(e);
        return;
    }

    // This specifies update option used while retrieving location estimation.
    var updateoptions = new Object();
    // Setting PartialUpdates to 'FALSE' ensures that user get atleast
    // BasicLocationInformation (Longitude, Lattitude, and Altitude.) is the
    // default when no LocationInformationClass criteria is given.
    updateoptions.PartialUpdates = false;

    var criteria = new Object();
    criteria.Updateoptions = updateoptions;
    criteria.LocationInformationClass = "GenericLocationInfo";

    try {
        // Executes the GetLocation method and sets the callbackLocation
        // as the callback function to be called.
        FoursquareAPI._serviceObject.ILocation.GetLocation(criteria,
                FoursquareAPI.gpsCallbackLocation);
    } catch (e) {
        alert (e);
    }
}
 
FoursquareAPI.gpsCallbackLocation = function(transId, eventCode, result){
    if (result.ErrorCode != 0) {
        FoursquareAPI.getLocationAsync();
        return;
    }
    FoursquareAPI._location.hasLocation = true;
    FoursquareAPI._location.latitude = result.ReturnValue.Latitude;
    FoursquareAPI._location.longitude = result.ReturnValue.Longitude;
}
