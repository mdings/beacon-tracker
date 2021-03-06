(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var notificationId = 1;
var points = [];
var watchId = null;

var onGeoSuccess = function onGeoSuccess(position) {

    points.push(position);
};

var onGeoError = function onGeoError(error) {

    document.getElementById('geo').innerHTML = error.message;
};

var app = {
    // Application Constructor
    initialize: function initialize() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function onDeviceReady() {

        // cordova.plugins.backgroundMode.enable();

        var delegate = new cordova.plugins.locationManager.Delegate();

        delegate.didDetermineStateForRegion = function (pluginResult) {

            document.getElementById('state').innerHTML = pluginResult.state;

            if (pluginResult.state == 'CLRegionStateOutside') {

                document.getElementById('state').innerHTML = 'outside';

                cordova.plugins.notification.local.schedule({
                    id: notificationId++,
                    title: "you're OUTSIDE the zone",
                    text: "Single notification"
                });

                navigator.geolocation.getCurrentPosition(function (position) {

                    // Bugfender.log('outside event', {

                    //     time: position.timestamp,
                    //     latitude: position.coords.latitude,
                    //     longitude: position.coords.longitude
                    // })

                }, function () {

                    // Bugfender.error('Error while retreiving position on outside state')

                }, {
                    enableHighAccuracy: true
                });
            }

            if (pluginResult.state == 'CLRegionStateInside') {

                document.getElementById('state').innerHTML = 'inside';
                cordova.plugins.notification.local.schedule({
                    id: notificationId++,
                    title: "you're INSIDE the zone",
                    text: "Single notification"
                });

                navigator.geolocation.getCurrentPosition(function (position) {

                    // Bugfender.log('inside event', {

                    //     time: position.timestamp,
                    //     latitude: position.coords.latitude,
                    //     longitude: position.coords.longitude
                    // })

                }, function () {

                    // Bugfender.error('Error while retreiving position on inside state')

                }, {
                    enableHighAccuracy: true
                });
            }
            // cordova.plugins.locationManager.appendToDeviceLog('[DOM] didDetermineStateForRegion: '
            //     + JSON.stringify(pluginResult));
        };

        delegate.didStartMonitoringForRegion = function (pluginResult) {
            document.getElementById('state').innerHTML = 'start monitoring';
        };

        delegate.didRangeBeaconsInRegion = function (pluginResult) {
            document.getElementById('state').innerHTML = 'state from range: ' + pluginResult.state;
        };

        var uuid = 'EBEFD083-70A2-47C8-9837-E7B5634DF524';
        var identifier = 'Jalee';
        var minor = 1;
        var major = 1;
        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor);

        cordova.plugins.locationManager.setDelegate(delegate);

        // required in iOS 8+
        cordova.plugins.locationManager.requestAlwaysAuthorization();

        cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion).fail(function (e) {

            document.getElementById('state').innerHTML = e;
        }).done();
    }

};

app.initialize();

},{}]},{},[1]);
