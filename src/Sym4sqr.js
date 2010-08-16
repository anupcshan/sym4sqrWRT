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

sym4sqr = {};

sym4sqr._loggedIn = false;
sym4sqr._API_ROOT = 'http://api.foursquare.com/v1/';
sym4sqr._username = "";
sym4sqr._password = "";
sym4sqr._me = null;
sym4sqr._serviceObject = null;
sym4sqr._location = {hasLocation: false};

sym4sqr.doWork = function() {
    if (sym4sqr._loggedIn == true)
        sym4sqr.showMainWindow();
    else    sym4sqr.showLoginWindow();
}

sym4sqr.showMainWindow = function() {
    $('#lightBox').hide(400);
}

sym4sqr.showLoginWindow = function() {
    var innerHTML = '<div id="lightBoxInner">\
            <span style="display: block;">Username</span>\
            <input id="username"></input>\
            <span style="display: block;">Password</span>\
            <input id="password" type="password"></input>\
            <input type="button" id="loginButton" value="Login"\
                style="display: block; margin-left: auto; margin-right: auto;">\
            </input>\
        </div>';
    $('#lightBox').text('');
    $('#lightBox').append(innerHTML);
    $('#lightBox').css({display: 'table'});
    $('#loginButton').click(sym4sqr._loginButtonHandler);
}

sym4sqr._makeNetworkRequest = function(args) {
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

    if (args.inclLocn == true && sym4sqr._location.hasLocation == true) {
        args.params.geolong = sym4sqr._location.longitude;
        args.params.geolat = sym4sqr._location.latitude;
    }
    $.ajax({url: sym4sqr._API_ROOT + args.apifn,  success: args.callback,
            data: args.params, username: sym4sqr._username,
            password: sym4sqr._password, type: args.type});
}

sym4sqr._loginButtonHandler = function() {
    sym4sqr._username = $('#username').val();
    sym4sqr._password = $('#password').val();
    sym4sqr._makeNetworkRequest({apifn: "user.json", type: "GET", params: {},
            callback: sym4sqr._loginRequestCallback});
}

sym4sqr._loginRequestCallback = function(data) {
    if (data['user'] == null) {
        sym4sqr._loggedIn = false;
        alert('Login error.');
        return;
    }

    sym4sqr._loggedIn = true;
    sym4sqr._me = User.getUser(data['user'].id, data['user']);
    alert('Logged in as ' + sym4sqr._me.firstname);
    sym4sqr.showMainWindow();
}

function init()
{
    sym4sqr.getLocationAsync();
    sym4sqr.doWork();
}

// Gets the GPS position
sym4sqr.getLocationAsync = function() {
    try {
        //Retrieves the Service object to the ILocation interface
        sym4sqr._serviceObject = device.getServiceObject("Service.Location",
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

    try {
        // Executes the GetLocation method and sets the callbackLocation
        // as the callback function to be called.
        sym4sqr._serviceObject.ILocation.GetLocation(criteria,
                sym4sqr.gpsCallbackLocation);
    } catch (e) {
        alert (e);
    }
}
 
sym4sqr.gpsCallbackLocation = function(transId, eventCode, result){
    sym4sqr._location.hasLocation = true;
    sym4sqr._location.latitude = result.ReturnValue.Latitude;
    sym4sqr._location.longitude = result.ReturnValue.Longitude;
}
