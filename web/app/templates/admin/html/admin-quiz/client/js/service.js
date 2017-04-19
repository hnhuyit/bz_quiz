'use strict';

angular.module('quiz').factory('Quiz', ['$resource',
    function($resource) {
        return $resource( window.cmsprefix + '/quiz/:itemId', {
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
