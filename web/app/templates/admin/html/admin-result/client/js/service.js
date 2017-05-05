'use strict';

angular.module('result').factory('Result', ['$resource',
    function($resource) {
        return $resource('result/:itemId', {
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
