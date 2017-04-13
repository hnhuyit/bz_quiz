'use strict';

ApplicationConfiguration.registerModule('settings');
// Configuring the Articles module
angular.module('settings').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Settings', 'settings', 'dropdown', '/settings(/create)?');
        Menus.addSubMenuItem('topbar', 'settings', 'List Settings', 'settings');
        Menus.addSubMenuItem('topbar', 'settings', 'New Setting', 'settings/create');
        // Menus.addSubMenuItem('topbar', 'settings', 'Control Panel', 'settings/controlPanel');
    }
]).config(['$stateProvider',
    function($stateProvider) {
        // Settings state routing
        $stateProvider.
        state('listSettings', {
            url: '/settings',
            templateUrl: '/templates/admin-setting/list-settings.html'
        }).
        state('createSetting', {
            url: '/settings/create',
            templateUrl: '/templates/admin-setting/create-setting.html'
        }).
        state('controlPanel', {
            url: '/settings/controlPanel',
            templateUrl: '/templates/admin-setting/control-panel.html'
        }).
        state('viewSetting', {
            url: '/settings/:settingId',
            templateUrl: '/templates/admin-setting/view-setting.html'
        }).
        state('editSetting', {
            url: '/settings/:settingId/edit',
            templateUrl: '/templates/admin-setting/edit-setting.html'
        });
    }
]);