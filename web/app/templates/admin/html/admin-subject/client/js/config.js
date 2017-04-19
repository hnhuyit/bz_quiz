'use strict';

ApplicationConfiguration.registerModule('subject');
angular.module('subject').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Subjects', 'subject', 'dropdown', '/subject(/create)?');
        Menus.addSubMenuItem('topbar', 'subject', 'List Subjects', 'subject');
        Menus.addSubMenuItem('topbar', 'subject', 'New Subject', 'subject/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
        state('listSubject', {
            url: '/subject',
            templateUrl: '/templates/admin-subject/list-subject.html'
        }).
        state('createSubject', {
            url: '/subject/create',
            templateUrl: '/templates/admin-subject/create-subject.html'
        }).
        state('viewSubject', {
            url: '/subject/:itemId',
            templateUrl: '/templates/admin-subject/view-subject.html'
        }).
        state('editSubject', {
            url: '/subject/:itemId/edit',
            templateUrl: '/templates/admin-subject/edit-subject.html'
        });
    }
]);
