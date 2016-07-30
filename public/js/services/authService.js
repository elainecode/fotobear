/* -------------------- AUTH SERVICE ---------------------------- */

var app = angular.module("poshApp");

app.factory('authService', function($http, $q) {
    var obj = {};

    obj.username;

    obj.logIn = function(user) {
        var dfd = $q.defer();
        $http.post('/login', user).success(function(response) {
            dfd.resolve(response);
        }).error(function(err) {
            dfd.reject(err);
        })
        return dfd.promise;
    };


    obj.signUp = function(newUser) {
        var dfd = $q.defer();
        $http.post('/signup', newUser).success(function(response) {
            dfd.resolve(response);
        }).error(function(err) {
            dfd.reject(err);
        })
        return dfd.promise;
    };


    obj.getUsername = function() {
        return $http.get('/username').then(function(response) {
            obj.username = response.data;
            return obj.username;
        }, function(err) {
            console.log(err)
        });
    };


    obj.logout = function() {
        return $http.get('/logout');
    };

    return obj;

});
