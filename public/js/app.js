/* -------------------- APP CONFIG ---------------------------- */

var app = angular.module("poshApp", ['ui.router', 'toastr']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('login');

    $stateProvider.state('login', {
            url: '/login',
            templateUrl: '/login.html',
            controller: 'loginCtrl'
        })
        .state('landing', {
            url: '/posts',
            templateUrl: '/landing.html',
            controller: 'landingCtrl'
        })
        .state('favs', {
            url: '/favs',
            templateUrl: '/favs.html',
            controller: 'favsCtrl'
        });



});
