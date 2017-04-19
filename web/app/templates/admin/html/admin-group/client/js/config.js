'use strict';

ApplicationConfiguration.registerModule('group');
angular.module('group').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', 'Groups', 'group', 'dropdown', '/group(/create)?');
        Menus.addSubMenuItem('topbar', 'group', 'List Groups', 'group');
        Menus.addSubMenuItem('topbar', 'group', 'New Group', 'group/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
        state('listGroup', {
            url: '/group',
            templateUrl: '/templates/admin-group/list-group.html'
        }).
        state('createGroup', {
            url: '/group/create',
            templateUrl: '/templates/admin-group/create-group.html'
        }).
        state('viewGroup', {
            url: '/group/:itemId',
            templateUrl: '/templates/admin-group/view-group.html'
        }).
        state('editGroup', {
            url: '/group/:itemId/edit',
            templateUrl: '/templates/admin-group/edit-group.html'
        });
    }
]);
