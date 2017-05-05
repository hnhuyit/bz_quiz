'use strict';

ApplicationConfiguration.registerModule('result');
angular.module('result').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', 'Results', 'result', 'dropdown', '/result(/create)?');
        Menus.addSubMenuItem('topbar', 'result', 'List Results', 'result');
        Menus.addSubMenuItem('topbar', 'result', 'New Result', 'result/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
        state('listResult', {
            url: '/result',
            templateUrl: '/templates/admin-result/list-result.html'
        }).
        state('createResult', {
            url: '/result/create',
            templateUrl: '/templates/admin-result/create-result.html'
        }).
        state('viewResult', {
            url: '/result/:itemId',
            templateUrl: '/templates/admin-result/view-result.html'
        }).
        state('editResult', {
            url: '/result/:itemId/edit',
            templateUrl: '/templates/admin-result/edit-result.html'
        });
    }
]);
