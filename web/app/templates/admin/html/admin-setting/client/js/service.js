'use strict';

//Settings service used to communicate Settings REST endpoints
angular.module('settings').factory('Settings', ['$resource',
    function($resource) {
        return $resource(window.cmsprefix + '/setting/:settingId', {
            settingId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            query: {
                isArray: false,
            }
        });
    }
]);