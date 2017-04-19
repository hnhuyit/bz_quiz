'use strict';

angular.module('group').factory('Group', ['$resource',
    function($resource) {
        return $resource(window.cmsprefix + '/group/:itemId', {
            itemId: '@_id'
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
