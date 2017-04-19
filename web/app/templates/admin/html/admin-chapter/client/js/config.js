'use strict';

ApplicationConfiguration.registerModule('chapter');
angular.module('chapter').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', 'Chapters', 'chapter', 'dropdown', '/chapter(/create)?');
        Menus.addSubMenuItem('topbar', 'chapter', 'List Chapters', 'chapter');
        Menus.addSubMenuItem('topbar', 'chapter', 'New Chapter', 'chapter/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
        state('listChapter', {
            url: '/chapter',
            templateUrl: '/templates/admin-chapter/list-chapter.html'
        }).
        state('createChapter', {
            url: '/chapter/create',
            templateUrl: '/templates/admin-chapter/create-chapter.html'
        }).
        state('viewChapter', {
            url: '/chapter/:itemId',
            templateUrl: '/templates/admin-chapter/view-chapter.html'
        }).
        state('editChapter', {
            url: '/chapter/:itemId/edit',
            templateUrl: '/templates/admin-chapter/edit-chapter.html'
        });
    }
]);
