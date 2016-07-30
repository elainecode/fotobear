/* -------------------- LANDING CONTROLLER ---------------------------- */

var app = angular.module("poshApp");

app.controller('landingCtrl', ['$scope', '$location', 'postService', 'authService', 'toastr', '$http',
    function($scope, $location, postService, authService, toastr, $http) {

        $scope.author;
        $scope.allPosts;


        var author = function() {
            authService.getUsername().then(function(response) {
                $scope.author = response;
                console.log($scope.author);
            });

        };

        author();


        var allPosts = function() {
            postService.getAllPosts().then(function(response) {
                $scope.allPosts = response.data;
            });
        };

        allPosts();


        $scope.addFav = function(id) {
            postService.addFav(id).then(function(response) {
                toastr.success('Added to Favs!', 'Favorite');
            }, function(err) {
                toastr.info(err.data);
            });
        };

        $scope.addLikes = function(post) {
            if (!post.hasLiked) { postService.addLikes(post); } else toastr.info("Already voted!");
        };


        $scope.addPost = function(post) {
            if (typeof post === "undefined" || !post) {
                return toastr.error("Post is incomplete");
            }
            postService.createPost(post).then(function(response) {
                $scope.post = {};
                $scope.allPosts.push(response.data);
                toastr.success("Post Submitted!");
            }, function(err) {
                toastr.error(err.data);
            });
        };

        $scope.goFav = function(author) {
            return author ? $location.path('favs') : toastr.info('login to view');
        };

        $scope.logout = function() {
            authService.logout()
                .then(function() {
                    $location.path('login');
                });
        };



    }
]);
