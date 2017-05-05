'use strict';

angular.module('option').factory('Option', ['$resource',
    function($resource) {
        return $resource('option/:itemId', {
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
