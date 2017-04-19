'use strict';

angular.module('subject').factory('Subject', ['$resource',
    function($resource) {
        return $resource(window.cmsprefix + '/subject/:itemId', {
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
