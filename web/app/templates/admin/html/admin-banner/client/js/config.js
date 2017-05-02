'use strict';

ApplicationConfiguration.registerModule('banners');

angular.module('banners').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Banners', 'banners', 'dropdown', '/banners(/create)?');
        Menus.addSubMenuItem('topbar', 'banners', 'List Banners', 'banners');
        Menus.addSubMenuItem('topbar', 'banners', 'New Banner', 'banners/create');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        // Banners state routing
        $stateProvider.
        state('listBanners', {
            url: '/banners',
            templateUrl: '/templates/admin-banner/list-banners.html'
        }).
        state('createBanner', {
            url: '/banners/create',
            templateUrl: '/templates/admin-banner/create-banner.html'
        }).
        state('viewBanner', {
            url: '/banners/:bannerId',
            templateUrl: '/templates/admin-banner/view-banner.html'
        }).
        state('editBanner', {
            url: '/banners/:bannerId/edit',
            templateUrl: '/templates/admin-banner/edit-banner.html'
        });
    }
]);
