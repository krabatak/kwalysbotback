'use strict';
//console.clear();

function base_url(segment) {
    // get the segments
    var pathArray = window.location.pathname.split('/');
    // find where the segment is located
    var indexOfSegment = pathArray.indexOf(segment);
    // make base_url be the origin plus the path to the segment
    return window.location.origin + pathArray.slice(0, indexOfSegment).join('/') + '/';
}
function api_url() {
    return "http://local.dev/analyseViews/";
}

var app = angular.module('appBot', ['ngRoute', 'starter.services', 'starter.controllers', 'ngSanitize', 'ngMaterial', 'ngCookies', 'ngMessages', 'material.svgAssetsCache', 'ngAnimate', 'ui.bootstrap']);
app.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value)
            return '';

        max = parseInt(max, 10);
        if (!max)
            return value;
        if (value.length <= max)
            return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
                //Also remove . and , so its gives a cleaner result.
                if (value.charAt(lastspace - 1) === '.' || value.charAt(lastspace - 1) === ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});
var Ctrl = angular.module('starter.controllers', []);
var factories = angular.module('starter.services', []);
app.config(function ($routeProvider, $httpProvider) {
//    delete $httpProvider.defaults.headers.common['X-Requested-With'];
//    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
//    $httpProvider.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
//    $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
//    $httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
//    $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
//    $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
//    $httpProvider.defaults.useXDomain = true;
    $routeProvider
            .when('/dashboard', {templateUrl: 'pages/home.html', controller: 'HomeCtrl'})
            .when('/login', {templateUrl: 'pages/login.html', controller: 'LoginCtrl'})
            //bot routes
            .when('/bots/add', {templateUrl: 'pages/bots/add.html', controller: 'BotsCtrl'})
            .when('/bots/edit-:id', {templateUrl: 'pages/bots/edit.html', controller: 'BotsCtrl'})
            .when('/bots/tree-:id', {templateUrl: 'pages/bots/tree.html', controller: 'BotsCtrl'})
            .when('/bots/index', {templateUrl: 'pages/bots/index.html', controller: 'BotsCtrl'})
            //bot routes
            .when('/conversations/index', {templateUrl: 'pages/conversations/index.html', controller: 'ConversationCtrl'})
            .otherwise({redirectTo: '/login'});
}).run(function ($rootScope, $location, $cookies, $cookieStore, BotsFactory) {
    $rootScope.baseUrl = base_url();
    $rootScope.help = function ($event) {
        $event.preventDefault();
        $("#helpModal").modal('toggle');
    };
    $rootScope.$watch(function () {
        return $location.path();
    },
            function (a) {
//                console.log(a);
                setTimeout(function () {
                    var currentSession = sessionStorage.getItem('connected');
//                    console.log($.inArray(currentSession, [undefined, null, "false", false]));
                    if ($.inArray(currentSession, [undefined, null, "false", false]) >= 0) {
//                        console.log($location);
                        setTimeout(function () {
//                            $location.path("/login");
                            document.location.href = "#/login";
//                            init_dashboard();
                        }, 500);
                        $("#sidebar_html").hide();
                        $("#topbar_html").hide();
                        $("footer").hide();
                    } else {
                        $rootScope.timeAgo = function (created, lang) {
                            if (lang === "" || lang == undefined) {
                                lang = "fr";
                            }
                            return moment(created).locale(lang).fromNow();
                        };
                        BotsFactory.getAlerts()
                                .then(function (response) {
                                    $rootScope.countAllAlerts = response.data.countAlerts;
                                    $rootScope.alerts = response.data.alerts;
//                                    console.log(response);
                                });
                        var ifApllyed = $("div#sidebar-menu").attr('data-apply');
                        if (ifApllyed === "") {
                            init_dashboard();
                        }
                        $("#sidebar_html").removeAttr('style');
                        $("#topbar_html").removeAttr('style');
                        $("footer").removeAttr('style');
                        $rootScope.connectedPourcentProfile = "50%";
                        $rootScope.connectedFullName = "Hedi Riahi";
                    }
                }, 1000);
//                console.log('url has changed: ' + a);
                // show loading div, etc...
            });
});