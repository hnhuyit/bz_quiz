'use strict';

angular.module('anwser').factory('Anwser', ['$resource',
    function($resource) {
        return $resource('anwser/:itemId', {
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
