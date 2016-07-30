/* -------------------- LOGIN CONTROLLER ---------------------------- */

var app = angular.module("poshApp");

app.controller('loginCtrl', ['$scope', 'authService', '$state', 'toastr',
    function($scope, authService, $state, toastr) {

        $scope.logIn = function(user) {
            if (!user || !user.password || !user.username) {
                return toastr.error("Login is incomplete");
            }
            authService.logIn(user).then(function(response) {
                $state.go('landing');
            }, function(err) {
                toastr.error(err, "Your Login:");
            });
        };

        $scope.signUp = function(newUser) {
            if (!newUser || !newUser.password || !newUser.username) {
                return toastr.error("Signup is incomplete");
            }
            authService.signUp(newUser).then(function(response) {
                toastr.success("You have been registered", "Thanks!");
                $scope.toSignUp = !$scope.toSignUp;
            }, function(err) {
                toastr.error(err, "Your Sign up:");
            })
        };

    }
]);
