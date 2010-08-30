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
    $('#loginButton').click(FoursquareAPI.login);
}

function init()
{
    FoursquareAPI.getLocationAsync();
    sym4sqr.doWork();
}
