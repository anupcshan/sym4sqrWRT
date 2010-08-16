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
FoursquareAPI._me = User.getUser();

FoursquareAPI.listFriends = function(callback, userId) {
    var params = {};
    if (userId != null)
        params.uid = userId;
    var callbackfn = function(data) {
        callback(FoursquareAPI._listFriendsCallback(data, userId));
    };
    sym4sqr._makeNetworkRequest({apifn: "friends.json", type: "GET",
            params: params, callback: callbackfn});
}

FoursquareAPI._listFriendsCallback = function(data, userId) {
    if (data == null || data.friends == null)
        return null;

    var friends = [];
    for (var i = 0, len = data.friends.length; i < len; i ++) {
        friends.push(User.getUser(data.friends[i].id, data.friends[i]));
    }

    if (userId == null)
        FoursquareAPI._me.setData({friends: friends});
    else {
        var user = User.getUser(userId, {});
        if (user != null)
            user.setData({friends: friends});
    }
    return friends;
}

FoursquareAPI.listVenues = function(callback) {}
FoursquareAPI.listTips = function(callback, venueId) {}
FoursquareAPI.getUserDetails = function(callback, userId) {}
FoursquareAPI.getVenueDetails = function(callback, venueId) {}
FoursquareAPI.searchUser = function(callback) {}
FoursquareAPI.searchVenues = function(callback) {}
FoursquareAPI.getHistory = function(callback, userId) {}
FoursquareAPI.getRecentActivity = function(callback) {}
