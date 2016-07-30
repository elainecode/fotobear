/* -------------------- POST SERVICE ---------------------------- */

var app = angular.module("poshApp");

app.factory('postService', function($http, $q) {

    var obj = {};

    obj.getAllPosts = function() {
        return $http.get('/posts').then(function(response) {
            return response;
        }, function(err) {
            console.log(err);
        });
    };

    obj.createPost = function(post) {
        post.likes = 0;
        post.url = "http://p-hold.com/macaron/300/200";
        return $http.post('/posts', post).then(function(response) {
            return response;
        });
    };

    obj.addLikes = function(post) {
        return $http.put('/posts/likes/' + post._id)
            .then(function(response) {
                post.likes += 1;
                post.hasLiked = true;
                return post;
            }, function(err) {
                console.log(err);
            })
    };

    obj.addFav = function(id) {
        return $http.put('/favorites/add/' + id).then(function(response) {
            return response;
        });
    };


    obj.removeFav = function(post) {
        return $http.put('/favorites/remove/' + post._id).then(function(response) {
            return post;
        }, function(err) {
            console.log(err);
        });
    };

    obj.getFavs = function() {
        return $http.get('/favorites').then(function(response) {
            return response;
        }, function(err) {
            console.log(err);
        });
    };

    return obj;

});
