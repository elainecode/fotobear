/* -------------------- FAVS CONTROLLER ---------------------------- */

var app = angular.module("poshApp");

app.controller('favsCtrl', ['$scope', 'postService', 'authService', 'toastr', '$state',
    function($scope, postService, authService, toastr, $state) {

        $scope.author;
        $scope.favorites;

        var author = function() {
            authService.getUsername().then(function(response) {
                $scope.author = response;
            })
        };

        author();

        var getFavs = function() {
            postService.getFavs().then(function(response) {
                $scope.favorites = response.data;
            })
        };

        getFavs();

        $scope.removeFav = function(post) {
            postService.removeFav(post).then(function(response) {
                var index = $scope.favorites.indexOf(response);
                $scope.favorites.splice(index, 1);
                toastr.success("Favorite removed!");
            })
        };

        $scope.goLanding = function(author) {
            return author ? $state.go('landing') : toastr.info('login to view');
        };

        $scope.logout = function() {
            authService.logout().then(function() {
                $state.go('login');
            });
        };




    }
]);
