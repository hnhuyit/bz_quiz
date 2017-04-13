'use strict';

ApplicationConfiguration.registerModule('posts');

angular.module('posts')
    .run(['Menus',
        function(Menus) {
            // Set top bar menu items
            Menus.addMenuItem('topbar', 'Posts', 'posts', 'dropdown', '/posts(/create)?');
            Menus.addSubMenuItem('topbar', 'posts', 'List Posts', 'posts');
            Menus.addSubMenuItem('topbar', 'posts', 'New Post', 'posts/create');
        }
    ])
    .config(['$stateProvider',
        function($stateProvider) {
            // posts state routing
            $stateProvider.
            state('listPosts', {
                url: '/posts',
                templateUrl: '/templates/admin-post/list-posts.html'
            }).
            state('createPost', {
                url: '/posts/create',
                templateUrl: '/templates/admin-post/create-post.html'
            }).
            state('viewPost', {
                url: '/posts/:postId',
                templateUrl: '/templates/admin-post/view-post.html'
            }).
            state('editPost', {
                url: '/posts/:postId/edit',
                templateUrl: '/templates/admin-post/edit-post.html'
            });
        }
    ]);