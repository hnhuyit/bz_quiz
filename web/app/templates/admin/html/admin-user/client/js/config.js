'use strict';

ApplicationConfiguration.registerModule('users');

angular.module('users').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Users', 'users', 'dropdown', '/users(/create)?');
        Menus.addSubMenuItem('topbar', 'users', 'List Users', 'users');
        Menus.addSubMenuItem('topbar', 'users', 'New User', 'users/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        // Users state routing
        $stateProvider.
        state('listUsers', {
            url: '/users',
            templateUrl: '/templates/admin-user/list-users.html'
        }).
        state('createUser', {
            url: '/users/create',
            templateUrl: '/templates/admin-user/create-user.html'
        }).
        state('viewUser', {
            url: '/users/:userId',
            templateUrl: '/templates/admin-user/view-user.html'
        }).
        state('editUser', {
            url: '/users/:userId/edit',
            templateUrl: '/templates/admin-user/edit-user.html'
        });
    }
]);
