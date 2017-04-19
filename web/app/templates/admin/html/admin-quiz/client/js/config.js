'use strict';

ApplicationConfiguration.registerModule('quiz');
angular.module('quiz').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', 'Quizzes', 'quiz', 'dropdown', '/quiz(/create)?');
        Menus.addSubMenuItem('topbar', 'quiz', 'List Quizzes', 'quiz');
        Menus.addSubMenuItem('topbar', 'quiz', 'New Quiz', 'quiz/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
        state('listQuiz', {
            url: '/quiz',
            templateUrl: '/templates/admin-quiz/list-quiz.html'
        }).
        state('createQuiz', {
            url: '/quiz/create',
            templateUrl: '/templates/admin-quiz/create-quiz.html'
        }).
        state('viewQuiz', {
            url: '/quiz/:itemId',
            templateUrl: '/templates/admin-quiz/view-quiz.html'
        }).
        state('editQuiz', {
            url: '/quiz/:itemId/edit',
            templateUrl: '/templates/admin-quiz/edit-quiz.html'
        });
    }
]);
