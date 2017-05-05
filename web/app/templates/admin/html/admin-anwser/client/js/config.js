'use strict';

ApplicationConfiguration.registerModule('anwser');
angular.module('anwser').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', 'Anwsers', 'anwser', 'dropdown', '/anwser(/create)?');
        Menus.addSubMenuItem('topbar', 'anwser', 'List Anwsers', 'anwser');
        Menus.addSubMenuItem('topbar', 'anwser', 'New Anwser', 'anwser/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
        state('listAnwser', {
            url: '/anwser',
            templateUrl: '/templates/admin-anwser/list-anwser.html'
        }).
        state('createAnwser', {
            url: '/anwser/create',
            templateUrl: '/templates/admin-anwser/create-anwser.html'
        }).
        state('viewAnwser', {
            url: '/anwser/:itemId',
            templateUrl: '/templates/admin-anwser/view-anwser.html'
        }).
        state('editAnwser', {
            url: '/anwser/:itemId/edit',
            templateUrl: '/templates/admin-anwser/edit-anwser.html'
        });
    }
]);
