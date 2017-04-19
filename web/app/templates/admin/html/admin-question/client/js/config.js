'use strict';

ApplicationConfiguration.registerModule('question');
angular.module('question').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', 'Questions', 'question', 'dropdown', '/question(/create)?');
        Menus.addSubMenuItem('topbar', 'question', 'List Questions', 'question');
        Menus.addSubMenuItem('topbar', 'question', 'New Question', 'question/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
        state('listQuestion', {
            url: '/question',
            templateUrl: '/templates/admin-question/list-question.html'
        }).
        state('createQuestion', {
            url: '/question/create',
            templateUrl: '/templates/admin-question/create-question.html'
        }).
        state('viewQuestion', {
            url: '/question/:itemId',
            templateUrl: '/templates/admin-question/view-question.html'
        }).
        state('editQuestion', {
            url: '/question/:itemId/edit',
            templateUrl: '/templates/admin-question/edit-question.html'
        });
    }
]);
