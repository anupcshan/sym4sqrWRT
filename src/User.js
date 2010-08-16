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

User.prototype = new Object();
User.prototype.constructor = User;
User.superclass = Object.prototype;

User._userList = {};

function User(args) {
    if (args == null || args.id == null)
        return;
    if (User._userList[args.id] != null)
        alert('Trying to recreate user.');
    if (args.id)
        this.id = args.id;
    else
        this.id = "0";
    User._userList[this.id] = this;
}

User.prototype.setValues = function(userData) {
    if (userData.id != null && this.id == "0") {
        // Overwrite id only if its not already set.
        // Needed for setting "me" user.
        User._userList[this.id] = null;
        this.id = userData.id;
        User._userList[this.id] = this;
    }
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
        this.badges = [];    // TODO
    if (userData.mayorships != null)
        this.mayorships = [];    // TODO
    if (userData.friends != null) {
        this.friends = [];
        for (var i = 0, len = userData.friends.length; i < len; i ++) {
            this.friends.push(User.getUser(userData.friends[i].id, userData.friends[i]));
        }
    }
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
